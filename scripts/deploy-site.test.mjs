import assert from 'node:assert/strict';
import test from 'node:test';
import { deploySite } from './deploy-site.mjs';

function fixture(responses) {
  const calls = [];
  const waits = [];
  return {
    calls,
    waits,
    options: {
      archive: Buffer.from('ZIP contents'),
      token: 'test-token',
      siteId: 'test-site',
      wait: async (duration) => waits.push(duration),
      request: async (url, options) => {
        calls.push({ url, ...options });
        assert.ok(responses.length, 'Unexpected API request');
        return Response.json(responses.shift());
      },
    },
  };
}

test('uploads the built archive and waits until it is the published deploy', async () => {
  const { options, calls, waits } = fixture([
    { id: 'deploy-1', state: 'uploaded' },
    { id: 'deploy-1', state: 'processing' },
    { id: 'deploy-1', state: 'ready' },
    { published_deploy: { id: 'deploy-1' } },
  ]);
  assert.equal(await deploySite(options), 'deploy-1');
  assert.equal(calls[0].url, 'https://api.netlify.com/api/v1/sites/test-site/deploys');
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].headers['Content-Type'], 'application/zip');
  assert.deepEqual(calls[0].body, options.archive);
  assert.ok(calls.every((call) => call.headers.Authorization === 'Bearer test-token'));
  assert.equal(calls[1].url, 'https://api.netlify.com/api/v1/deploys/deploy-1');
  assert.deepEqual(waits, [2_000, 2_000]);
});

test('requires credentials before making a request', async () => {
  const { options, calls } = fixture([]);
  await assert.rejects(deploySite({ ...options, token: '' }), /token and project ID are required/);
  assert.equal(calls.length, 0);
});

test('HTTP failures fail the job without exposing the response or token', async () => {
  const { options } = fixture([]);
  options.request = async () => new Response('private response', { status: 401 });
  await assert.rejects(deploySite(options), { message: 'Netlify POST failed (401).' });
});

test('a processing failure stops the release', async () => {
  const { options } = fixture([
    { id: 'deploy-1', state: 'processing' },
    { id: 'deploy-1', state: 'error' },
  ]);
  await assert.rejects(deploySite(options), /failed \(error\)/);
});

test('a ready deploy that is not published fails instead of claiming success', async () => {
  const { options } = fixture([
    { id: 'deploy-1', state: 'ready' },
    { published_deploy: { id: 'previous-deploy' } },
  ]);
  await assert.rejects(deploySite(options), /ready but is not published/);
});

test('polling stops after a bounded number of attempts', async () => {
  const { options, calls } = fixture([
    { id: 'deploy-1', state: 'processing' },
    { id: 'deploy-1', state: 'processing' },
    { id: 'deploy-1', state: 'processing' },
  ]);
  await assert.rejects(deploySite({ ...options, attempts: 2 }), /Timed out waiting/);
  assert.equal(calls.length, 3);
});

test('accepts a deployment that becomes ready on the final poll', async () => {
  const { options } = fixture([
    { id: 'deploy-1', state: 'processing' },
    { id: 'deploy-1', state: 'ready' },
    { published_deploy: { id: 'deploy-1' } },
  ]);
  assert.equal(await deploySite({ ...options, attempts: 1 }), 'deploy-1');
});
