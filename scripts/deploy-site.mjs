import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

export async function deploySite({
  archive,
  token,
  siteId,
  request = fetch,
  wait = sleep,
  attempts = 90,
}) {
  if (!token || !siteId) throw new Error('Netlify token and project ID are required.');

  async function api(path, options = {}) {
    const response = await request(`https://api.netlify.com/api/v1${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...options.headers },
      signal: AbortSignal.timeout(60_000),
    });
    if (!response.ok)
      throw new Error(`Netlify ${options.method || 'GET'} failed (${response.status}).`);
    return response.json();
  }

  const sitePath = `/sites/${encodeURIComponent(siteId)}`;
  let deploy = await api(`${sitePath}/deploys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/zip' },
    body: archive,
  });
  if (typeof deploy.id !== 'string' || !deploy.id) {
    throw new Error('Netlify did not return a deploy ID.');
  }
  const deployId = deploy.id;

  for (let attempt = 0; attempt <= attempts; attempt += 1) {
    if (deploy.state === 'ready') {
      const site = await api(sitePath);
      if (site.published_deploy?.id !== deployId) {
        throw new Error(
          `Deploy ${deployId} is ready but is not published. Check Netlify deploy locking.`,
        );
      }
      return deployId;
    }
    if (['error', 'rejected'].includes(deploy.state)) {
      throw new Error(`Netlify deploy ${deployId} failed (${deploy.state}).`);
    }
    if (attempt === attempts) break;
    await wait(2_000);
    deploy = await api(`/deploys/${encodeURIComponent(deployId)}`);
  }
  throw new Error(
    `Timed out waiting for Netlify deploy ${deployId}. Check its status before retrying.`,
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!process.argv[2]) throw new Error('Pass the ZIP archive of the built site.');
  const deployId = await deploySite({
    archive: await readFile(process.argv[2]),
    token: process.env.NETLIFY_AUTH_TOKEN,
    siteId: process.env.NETLIFY_SITE_ID,
  });
  console.log(`Published Netlify deploy ${deployId}.`);
}
