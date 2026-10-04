import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { parse } from 'yaml';
import { publishPosts } from './publish-posts.mjs';

const timestamp = '2026-10-03T20:00:00.000Z';

function fixture(t, files) {
  const directory = mkdtempSync(join(tmpdir(), 'blog-publication-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  for (const [filename, source] of Object.entries(files)) {
    const path = join(directory, filename);
    mkdirSync(join(path, '..'), { recursive: true });
    writeFileSync(path, source);
  }
  return directory;
}

test('stamps only ready posts and preserves published posts and drafts byte for byte', (t) => {
  const draft = '---\ntitle: Draft\ndraft: true\n---\nStill writing.\n';
  const published =
    '---\ntitle: Published\npublishedAt: "2020-04-02T18:26:46.000+01:00"\n---\nUnchanged.\n';
  const ready =
    '---\ntitle: Ready\ndraft: false # approved\n---\n<p>Body with --- inside it.</p>\n';
  const directory = fixture(t, {
    'draft.md': draft,
    'old.md': published,
    'nested/ready.md': ready,
  });

  assert.deepEqual(publishPosts({ directory, timestamp }), [join(directory, 'nested/ready.md')]);
  assert.equal(readFileSync(join(directory, 'draft.md'), 'utf8'), draft);
  assert.equal(readFileSync(join(directory, 'old.md'), 'utf8'), published);
  assert.equal(
    readFileSync(join(directory, 'nested/ready.md'), 'utf8'),
    ready.replace('\n---\n<p>', `\npublishedAt: "${timestamp}"\n---\n<p>`),
  );
});

test('all posts in a release receive one timestamp, and retries preserve it', (t) => {
  const ready = '---\ntitle: Ready\ndraft: false\n---\nBody\n';
  const directory = fixture(t, { 'one.md': ready, 'two.md': ready });
  assert.equal(publishPosts({ directory, timestamp }).length, 2);
  const before = readFileSync(join(directory, 'one.md'), 'utf8');
  const frontmatter = parse(before.split('---')[1]);
  assert.equal(frontmatter.publishedAt, timestamp);
  assert.equal(frontmatter.draft, false);
  assert.deepEqual(publishPosts({ directory, timestamp: '2026-11-01T12:00:00.000Z' }), []);
  assert.equal(readFileSync(join(directory, 'one.md'), 'utf8'), before);
});

test('preserves Windows line endings and a byte order mark', (t) => {
  const ready = '\uFEFF---\r\ntitle: Ready\r\ndraft: false\r\n---\r\nBody\r\n';
  const directory = fixture(t, { 'ready.md': ready });
  publishPosts({ directory, timestamp });
  assert.equal(
    readFileSync(join(directory, 'ready.md'), 'utf8'),
    ready.replace('\r\n---\r\nBody', `\r\npublishedAt: "${timestamp}"\r\n---\r\nBody`),
  );
});

test('requires an explicit ready status for an undated post', (t) => {
  const directory = fixture(t, { 'new.md': '---\ntitle: New\n---\nBody\n' });
  assert.throws(() => publishPosts({ directory, timestamp }), /set draft: false explicitly/);
});

test('invalid YAML aborts the release without partially stamping earlier files', (t) => {
  const ready = '---\ntitle: Ready\ndraft: false\n---\nBody\n';
  const directory = fixture(t, {
    'a-ready.md': ready,
    'z-invalid.md': '---\ntitle: Invalid\ndraft: false\ndraft: true\n---\nBody\n',
  });
  assert.throws(() => publishPosts({ directory, timestamp }), /z-invalid.md/);
  assert.equal(readFileSync(join(directory, 'a-ready.md'), 'utf8'), ready);
});

test('a quoted false is rejected instead of accidentally publishing a draft', (t) => {
  const directory = fixture(t, { 'post.md': '---\ntitle: Post\ndraft: "false"\n---\nBody\n' });
  assert.throws(() => publishPosts({ directory, timestamp }), /draft must be a boolean/);
});

test('malformed frontmatter fails clearly', (t) => {
  const directory = fixture(t, { 'post.md': 'No frontmatter.\n' });
  assert.throws(() => publishPosts({ directory, timestamp }), /missing YAML frontmatter/);
});
