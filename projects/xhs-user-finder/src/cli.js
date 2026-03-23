#!/usr/bin/env node
import { writeTaskState } from './state.js';
import { findXhsUsers } from './find-xhs.js';

const [,, cmd, ...args] = process.argv;

async function main() {
  if (cmd === 'find') {
    const keyword = args[0] || '亚马逊 卖家';
    const limit = Number(args[1] || '10');
    const result = await findXhsUsers({ keyword, limit });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  writeTaskState({
    task: '搭建小红书找人执行器 MVP',
    status: 'running',
    phase: '待命',
    current: 'CLI 已可用，等待 find 命令执行',
    blocked: null,
  });
  console.log('Usage: node src/cli.js find <keyword> <limit>');
}

main().catch((err) => {
  writeTaskState({
    status: 'blocked',
    phase: '执行失败',
    current: 'CLI 运行时报错',
    blocked: err?.message || String(err),
  });
  console.error(err);
  process.exit(1);
});
