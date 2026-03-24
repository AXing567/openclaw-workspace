# ClawTeam Upgrade Status Card

更新时间：2026-03-23

## 当前已验证提升
- worktree 基线已修：不再错误依赖 `master`，无首个 commit 的 repo 会明确报错；显式 `--repo` 失败时不再静默降级。
- agent 启动协议已增强：prompt 增加 Mandatory Startup Procedure，强调先收 inbox、列 task、认领 task、再开工。
- tmux + OpenClaw TUI 已加一次 idle kick，降低“会话打开但没真正开工”的概率。
- `spawn` / `launch` 已支持“唯一 owner 的 pending task 自动 claim 为 in_progress”。
- `monitor` 命令已补上：能看 inbox、进度、dead agent、stagnation。
- `monitor` 已支持按状态分类催办：
  - pending → 催 agent 先认领
  - in_progress → 催 agent 更新进度/继续执行/报阻塞
  - blocked → 提醒 leader 处理依赖
- `monitor` 已支持最终 Team summary：输出完成数、未完成数、未完成 owner、最近 agent 消息。

## 当前仍未完全到位
- 催办节流仍偏粗：同一状态可能在短时间内再催一次，后续应改成“同状态只催一次，状态变化后才再催”或按真实时间节流。
- 核心模板（尤其 leader 模板）仍未系统性重写，默认行为还不够像主动推进型 orchestrator。
- OpenClaw TUI 的“spawn success = 真正开工”还不是 100% 强保证，目前只是明显改善。

## 当前评分（主观）
- 修前：约 72/100
- 本轮修后：约 78~80/100
- 下一目标：85/100

## 再往上提分最值钱的两刀
1. 催办节流优化：同状态只催一次，状态变化后才允许再次催办。
2. 重写核心模板（hedge-fund / code-review / research-paper），把 leader 默认行为改成主动推进、主动收敛。
