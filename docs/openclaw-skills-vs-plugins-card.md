# OpenClaw `skills` vs `plugins` 选路卡

## 默认判断
- 看到 `openclaw skills search/install/update`：说明当前版本已经支持从 ClawHub 直接搜索和安装 skill。
- 看到 `openclaw plugins install`：这是插件安装入口，不等于 skill 安装入口。
- 看到某个项目文档要求 `npm install -g xxx`：优先判断它是独立 CLI，不要误认成 OpenClaw plugin/skill 已自动装好。

## 快速区分
- **skills**：面向任务流程/能力说明与封装；可从 ClawHub 安装到 workspace（如 `/workspace/skills/...`）。
- **plugins**：面向平台/工具/provider/channel 扩展；走 `openclaw plugins install <spec>`。
- **独立 CLI**：面向宿主机命令能力；就算装了同名 skill，往往还需要额外安装底层 CLI。

## 常见误判
- 误把 “skill 已安装” 当成 “底层命令已安装”。
- 误把 “plugin 新入口存在” 理解成 “skills 已被 plugins 取代”。
- 看到搜索结果里的名字就默认它是 bundled/official，而没先区分 ClawHub skill、npm CLI、内置 tool。

## 推荐顺序
1. 先判断用户要的是 **skill / plugin / 独立 CLI** 哪一种。
2. 如果是 skill，先用 `openclaw skills search <keyword>`，再考虑 `install`。
3. 如果是 plugin，走 `openclaw plugins install <spec>`。
4. 如果 skill 文档里写了 `npm install -g ...` 或其他安装器，说明 skill 只是入口/说明书，还要继续补底层依赖。

## 完成标准
- 不只说“装好了”，还要区分：
  - skill 是否已安装
  - 底层 CLI 是否已安装
  - 依赖是否补齐
  - 实际能力是否验收通过
