# OpenClaw 插件安装入口卡

## 默认判断

当用户提到“安装插件 / 新版本插件怎么装 / 扩展怎么接进 OpenClaw”时，默认先按 **`openclaw plugins`** 体系理解，而不是先想到旧式 `extensions/` 或单纯 `npm -g`。

## 快速分流

- **OpenClaw 外部插件**：优先看文档是否写 `openclaw plugins install <spec>`
- **仓库内插件**：放在 `extensions/` 下，通常自动发现
- **独立 CLI 工具**：若文档只写 `npm install -g xxx`，那通常只是装到机器上，不等于接入 OpenClaw 插件体系
- **bundled skills**：随 OpenClaw 自带，不走插件安装命令

## 常见误判

- 把“独立 CLI”误认为“OpenClaw 插件”
- 把“skill”与“plugin”混成同一概念
- 看到旧文章里的 `extensions/` 就直接照搬，而不先核当前版本 CLI

## 当前优先核法

1. 先看本机 CLI 是否存在 `openclaw plugins ...`
2. 再看包文档里写的是 `openclaw plugins install` 还是 `npm install -g`
3. 若包只有可执行 bin、无 OpenClaw manifest/插件说明，默认视为独立 CLI

## 收手标准

只要已经能回答“当前应走哪条安装路径”，heartbeat 就收手，不扩成完整插件开发研究。