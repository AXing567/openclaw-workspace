# OpenClaw skills vs plugins 安装卡

## 默认判断
- 遇到 **skill**：先想 `openclaw skills search/install`
- 遇到 **plugin**：先想 `openclaw plugins install`
- 不要把外部 CLI、skill、plugin 三者混成一回事

## skills 线
- 新版本可直接从 ClawHub 搜索与安装：
  - `openclaw skills search <keyword>`
  - `openclaw skills install <skill-name>`
  - `openclaw skills update`
  - `openclaw skills check`
- 安装位置默认落到当前 workspace 的 `skills/`
- `openclaw skills install` 安装的是 skill 包本身（说明、触发规则、可能附带脚本），**不等于**底层外部 CLI/浏览器/系统依赖一定已经装好

## plugins 线
- OpenClaw 插件仍走：
  - `openclaw plugins install <package-or-spec>`
- 适用于真正的 OpenClaw plugin，而不是普通 npm CLI

## 外部 CLI 判断
- 如果文档写的是：
  - `npm install -g xxx`
  - `pip install xxx`
  - `uv tool install xxx`
  那大概率是在装**独立 CLI/运行时**，不是 OpenClaw skill/plugin 本体
- 常见情况：
  - 先 `openclaw skills install <skill>`
  - 再按 `SKILL.md` 继续装底层 CLI 或系统依赖

## 这次踩坑提炼
- `agent-browser` 在 ClawHub 里确实有 skill，可用 `openclaw skills install agent-browser`
- 但该 skill 只是封装 `agent-browser` CLI 的用法说明；真正可用还需要继续执行：
  - `npm install -g agent-browser`
  - `agent-browser install --with-deps`
- 结论：**skill 已安装 ≠ 底层工具已可用**

## 收手条件
- 搞清楚“它是 skill / plugin / 独立 CLI”中的哪一种
- 确认实际安装命令属于哪条线
- 如有 `SKILL.md`，再看是否还要求额外依赖安装
