# OpenClaw skill 安装选路卡

## 默认判断
- 先区分 **bundled skill** 和 **ClawHub skill**，不要一上来就把所有 skill 都当成“需要安装”。
- `openclaw skills check` 先看三件事：
  1. skill 是否已存在
  2. 是 Ready 还是 Missing requirements
  3. 缺的是 skill 本体，还是外部二进制/环境变量

## 常见分流
- **bundled 且 Missing requirements**：优先补依赖，不要重复装 skill。
  - 例：`github` skill 已存在，真正缺的是 `gh`。
- **ClawHub 搜得到但本地没有**：再用 `openclaw skills install <name>`。
- **搜索/下载报 429**：先停，不要短时间连续重试；记为 ClawHub 限流而不是“skill 不存在”。
- **名称撞车风险**：遇到 skill 依赖某个外部 CLI 时，不要想当然按同名 npm 包安装；先看官方 skill 的 `SKILL.md`、官网和官方 repo，再决定安装源。

## 安装前检查顺序
1. 读 skill 的 `SKILL.md`
2. 看 `metadata.openclaw.requires`
3. 看 `metadata.openclaw.install`
4. 再决定是：
   - 系统包安装
   - 用户态安装
   - ClawHub 安装
   - 暂缓安装

## 这轮经验
- `agent-browser`：ClawHub skill + 外部 CLI，两段式安装。
- `github`：bundled skill，只缺 `gh`，补依赖后立即 Ready。
- `summarize`：bundled skill，但外部 CLI 来源要谨慎确认；同名 npm 包可能装错。
- `proactive-agent-lite`：ClawHub 有，但会遇到下载 429；先停再重试。

## 默认建议
- 先补 **官方 bundled skill 的依赖**，再考虑社区增强类 skill。
- 对“自我提升/主动思考”类 skill，先看说明与收益，再决定要不要装，避免概念先行。
