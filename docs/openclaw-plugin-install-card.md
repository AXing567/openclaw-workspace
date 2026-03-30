# OpenClaw 插件安装选路卡

## 默认判断

当用户说“安装插件”时，先默认按 **新版 `openclaw plugins` 体系** 理解，而不是先走旧式 `npm install -g` 或手动塞 `extensions/`。

默认顺序：
1. 先确认目标到底是 **OpenClaw 插件**、**独立 CLI**，还是 **skill**
2. 如果是 OpenClaw 外部插件，优先使用 `openclaw plugins install <spec>`
3. 如果只是第三方独立工具，按它自己的安装方式处理，不要硬说成插件

## 三类东西要分开

### 1. OpenClaw 插件
特征：
- 文档写 `openclaw plugins install <package-or-path>`
- 可能发布到 npm 或 ClawHub
- 由 OpenClaw 自己管理安装、发现、更新

### 2. 独立 CLI / 外部工具
特征：
- 文档写 `npm install -g xxx`、`pip install xxx`、`cargo install xxx`
- 装完后它是系统里的单独命令
- 不会因为装好了就自动成为 OpenClaw 插件

### 3. skill
特征：
- 是提示/流程层，不等于 npm 包
- 可能是 bundled skill、workspace skill，或由插件顺带暴露的能力
- 不能把“有个 skill 名字”直接等同于“有个 npm 包可装”

## 当前新版的实际建议

- 想装 **OpenClaw 插件** → 先试 `openclaw plugins install <spec>`
- 想装 **系统工具** → 按该工具自己的官方安装方式
- 想接入 **workspace 内自定义能力** → 看是建 skill、建插件，还是只保留外部 CLI

## 常见误判

- 把第三方 CLI 误认成 OpenClaw 官方 skill
- 把 skill / plugin / extension / tool 混成同一个概念
- 用户说“装插件”，就直接 `npm install -g`，没先核对新版本插件入口

## 收手条件

只要已经确认“它不是 OpenClaw 插件，而是独立工具”，就别继续围着 `openclaw plugins` 打转；应切回该工具自己的安装文档。
