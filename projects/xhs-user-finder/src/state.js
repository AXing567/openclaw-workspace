import fs from 'node:fs';
const STATE_PATH = '/home/ax/.openclaw/workspace/state/current-task.json';
export function writeTaskState(patch) {
  let current = {};
  try { current = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')); } catch {}
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  fs.writeFileSync(STATE_PATH, JSON.stringify(next, null, 2));
  return next;
}
