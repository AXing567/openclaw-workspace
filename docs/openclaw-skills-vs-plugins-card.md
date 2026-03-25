# OpenClaw Skills vs Plugins 选路卡

## 默认判断
- 需要安装一个可复用的任务流程/能力包，且来源是 ClawHub：先看 `openclaw skills search/install`
- 需要安装一个 OpenClaw 插件包（provider/channel/tool/extension）：走 `openclaw plugins install`
- 只是安装一个独立 CLI（npm/go/binary），即使能辅助 agent，也不等于 OpenClaw skill/plugin

## 新版可直接验证的命令
- `openclaw skills --help`
- `openclaw skills search <query>`
- `openclaw skills install <skill>`
- `openclaw plugins install <spec>`

## 快速区分
- 文档写 `openclaw skills install xxx`：按 skill 装，通常进 workspace `skills/`
- 文档写 `openclaw plugins install xxx`：按插件装，由 OpenClaw 插件体系管理
- 文档写 `npm install -g xxx`：大概率只是独立工具，不自动变成 OpenClaw skill/plugin

## 常见失误
- 把 skill 和 plugin 混成一个概念
- 看到 npm 包就误判成 OpenClaw 官方扩展
- 没先跑 `search/info/help`，直接按旧记忆安装

## 收手标准
- 已确认目标属于 skill / plugin / 独立 CLI 三者之一
- 已给出对应安装命令，而不是继续混用旧术语
