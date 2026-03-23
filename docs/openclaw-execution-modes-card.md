# OpenClaw Execution Modes Card

## 1) 直接在当前会话完成
适用：
- 小范围读文件、改文件
- 一次性网页查询
- 明确且短平快的问题

优先工具：
- `read` / `edit` / `write`
- `web_search` / `web_fetch`
- `browser`（仅当确实需要交互）

## 2) `exec + process`
适用：
- 需要运行本地命令
- 命令会持续一段时间
- 需要查看 stdout/stderr、跟进进度

原则：
- `exec` 负责启动
- `process` 负责 poll/log/kill
- 不要高频轮询
- 若被 allowlist/审批限制，先接受边界，不在 heartbeat 里硬撞

## 3) `sessions_spawn` 子会话
适用：
- 慢任务、长任务、可并行任务
- 希望把上下文隔离，避免主会话被占满
- 需要独立汇报完成事件

注意：
- 子会话不默认继承主会话的人格/记忆文件上下文
- 依赖用户偏好、历史决策时，要把必要背景显式写进 task
- 不适合同步的小修补

## 4) `sessions_spawn` + `runtime:"acp"`
适用：
- 用户明确说要用 Codex / Claude Code / Gemini CLI / Pi / OpenCode
- 需要 ACP harness 的线程型编码代理

原则：
- 这是“路由到 ACP”的标准入口
- 线程型会话默认走 `thread: true`（聊天场景）
- 不用本地 PTY 冒充 ACP

## 5) heartbeat 模式
适用：
- 空闲时低打扰维护
- 文档整理、知识压缩、规则沉淀

原则：
- 小步快跑，可见交付
- 避免大工程
- 遇到工具边界就降级做本地沉淀，不做无谓试探
