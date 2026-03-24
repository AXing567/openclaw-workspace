# ClawTeam 2026-03-23 复盘

## 目标
今天尝试把 ClawTeam 从“能起队但不够稳”提升到更接近可实战的状态，重点验证：worktree、自动认领、监控催办、以及用它跑真实投资分析任务的表现。

## 今天已经做成的事
- 修复了 workspace/worktree 相关问题：避免 unborn repo / `master` 基引用导致的假成功或直接报错。
- 当前 workspace 已完成首个 commit，并同步到 GitHub，可作为 ClawTeam 的真实 repo 使用。
- `spawn` 后可自动 claim 唯一 owner 的 pending task。
- 增加了 `clawteam monitor`：可看进度、收 inbox、看 incomplete tasks。
- monitor 支持分类催办：区分 `pending` / `in_progress` / `blocked`。
- monitor 支持“同状态只催一次”，避免同一状态反复轰炸。
- monitor 支持 runtime/backend 故障识别：能识别 `rate_limit`、`auth_failed`、`timeout` 等，不再把这类问题误判成普通 worker 拖延。
- monitor 支持 busy signal / busy grace：worker 处于 `streaming/running/thinking/working` 时，先给宽限期，不立刻乱催。
- 内置模板已部分改成更主动推进型：`hedge-fund`、`code-review`、`research-paper`。

## 核心没打穿的问题
最关键的问题没有解决：

- `openclaw tui --message <prompt>` 这条启动链路 **不可靠**。
- 现象是：tmux 窗口能起来，session 能起来，task 也能 auto-claim，但 agent 可能停在：
  - `connecting | idle`
  - 或只显示静态 task 文本
- 这意味着：
  - `spawn success` != `task execution started`
  - 现在的编排层已经能监控、催办、识别故障，但启动执行层本身仍不够硬。

## 已验证无效或不值得继续的方向
- 单纯继续 tweak tmux/Enter/nudge 没有根治问题。
- 多轮 Enter 握手仍可能只得到“会话已打开，但任务未实际开跑”。
- 继续在这条线上硬磨，已经进入收益递减区。

## 为什么今天先停
原因很简单：继续修的边际收益太低了。

已经修出来的部分有价值，但最关键的“稳定开跑”还卡在 OpenClaw TUI 的启动语义上。今天继续深挖，只会继续烧时间，不适合再投入。

## 如果以后重开，第一刀该从哪开始
不要再从 monitor、auto-nudge、tmux Enter 这些外围行为继续修。

第一刀应该直接研究：

### 程序化注入首轮任务
目标是把：
- `session created`
变成
- `first task injected`
再变成
- `execution confirmed`

而不是继续依赖：
- `openclaw tui --message ...` 是否会自动提交首轮任务
- tmux 发送 Enter 是否恰好能触发执行

## 当前结论
- ClawTeam 今天确实从很毛糙提升到了“有监控、有分类催办、有故障识别”的程度。
- 但最关键的启动执行层没有彻底打通。
- 因此今天对这个项目的最优策略是：**先收手，不继续优化。**
