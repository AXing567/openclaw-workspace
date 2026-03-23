import { chromium } from 'playwright';
import { writeTaskState } from './state.js';

export async function findXhsUsers({ keyword = '亚马逊 卖家', limit = 10 }) {
  writeTaskState({
    phase: '执行搜索',
    current: `打开小红书搜索页并准备采集，关键词：${keyword}`,
    status: 'running',
    blocked: null,
  });

  const browser = await chromium.launch({ headless: true, executablePath: '/home/ax/.openclaw/workspace/projects/xhs-user-finder/.browser-cache/chrome-linux64/chrome', env: { ...process.env, LD_LIBRARY_PATH: '/home/ax/.openclaw/workspace/projects/xhs-user-finder/.local-libs/usr/lib/x86_64-linux-gnu:/home/ax/.openclaw/workspace/projects/xhs-user-finder/.local-libs/lib/x86_64-linux-gnu' } });
  const page = await browser.newPage();
  const url = `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(keyword)}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const title = await page.title();

  writeTaskState({
    phase: '执行搜索',
    current: `已打开页面：${title}`,
    done: ['已完成依赖安装', '已完成 CLI 与执行骨架初始化'],
  });

  await browser.close();
  return { ok: true, keyword, limit, title, url, note: 'MVP 当前先验证页面打开能力，下一步再接结果提取。' };
}
