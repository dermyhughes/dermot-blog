import { globSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

export function publishPosts({ directory = 'content/posts', timestamp = new Date() } = {}) {
  const publishedAt = new Date(timestamp).toISOString();
  const changes = [];

  for (const filename of [...globSync('**/*.md', { cwd: directory })].sort()) {
    const path = resolve(directory, filename);
    const source = readFileSync(path, 'utf8');
    const parts = source.match(/^(\uFEFF?---\r?\n)([\s\S]*?)(\r?\n---(?:\r?\n|$))([\s\S]*)$/);
    if (!parts) throw new Error(`${filename}: missing YAML frontmatter.`);

    const document = parseDocument(parts[2]);
    if (document.errors.length) {
      throw new Error(`${filename}: ${document.errors[0].message}`);
    }

    const draft = document.get('draft');
    if (draft !== undefined && typeof draft !== 'boolean') {
      throw new Error(`${filename}: draft must be a boolean.`);
    }
    if (draft === true || document.has('publishedAt')) continue;
    if (draft !== false) {
      throw new Error(`${filename}: set draft: false explicitly when ready to publish.`);
    }

    const newline = parts[1].endsWith('\r\n') ? '\r\n' : '\n';
    changes.push({
      path,
      source: `${parts[1]}${parts[2]}${newline}publishedAt: ${JSON.stringify(publishedAt)}${
        parts[3]
      }${parts[4]}`,
    });
  }

  // Validate the whole batch before changing any files.
  for (const change of changes) writeFileSync(change.path, change.source);
  return changes.map((change) => change.path);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const changed = publishPosts();
  console.log(`Set first-publication dates for ${changed.length} post(s).`);
}
