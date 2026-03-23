# OpenClaw 官方文档学习沉淀：Tools

来源：<https://docs.openclaw.ai/zh-CN/tools>
更新时间：2026-03-20

## 1. 总体认知

- OpenClaw 的工具是“一流工具接口”，优先直接调用工具，不要再把老的 `openclaw-*` Skills 当主路径。
- 工具会通过两条通道暴露给模型：
  - 系统提示中的人类可读说明
  - provider API 侧的结构化 tool schema
- 一个工具如果没有出现在提示或 schema 中，模型就不能调用它。

## 2. 工具权限模型

### 2.1 allow / deny
- 通过 `tools.allow` / `tools.deny` 控制工具暴露，`deny` 优先。
- 匹配不区分大小写。
- 支持 `*` 通配符。
- 如果 `tools.allow` 只写了未知/未加载插件工具，OpenClaw 会忽略这份 allowlist，避免把核心工具全锁死。

### 2.2 tools.profile
- `tools.profile` 是基础允许集，先于 allow/deny 生效。
- 常见 profile：
  - `minimal`：只有 `session_status`
  - `coding`：`group:fs`、`group:runtime`、`group:sessions`、`group:memory`、`image`
  - `messaging`：`message` + 若干 session 工具
  - `full`：不限制
- 可按 agent 覆盖：`agents.list[].tools.profile`

### 2.3 byProvider
- `tools.byProvider` 可对特定 provider 或 `provider/model` 再收紧工具。
- 它发生在 profile 之后、allow/deny 之前，所以只能缩小，不能放大。
- 也可按 agent 覆盖：`agents.list[].tools.byProvider`

### 2.4 group:*
- `group:runtime`：`exec`、`bash`、`process`
- `group:fs`：`read`、`write`、`edit`、`apply_patch`
- `group:sessions`：`sessions_list`、`sessions_history`、`sessions_send`、`sessions_spawn`、`session_status`
- `group:memory`：`memory_search`、`memory_get`
- `group:web`：`web_search`、`web_fetch`
- `group:ui`：`browser`、`canvas`
- `group:automation`：`cron`、`gateway`
- `group:messaging`：`message`
- `group:nodes`：`nodes`
- `group:openclaw`：所有内置 OpenClaw 工具（不含 provider 插件）

## 3. 高价值工具心智模型

### 3.1 exec / process
- `exec` 是工作区 shell 执行器。
- 常用参数：
  - `command`
  - `yieldMs`
  - `background`
  - `timeout`
  - `elevated`
  - `host` = `sandbox | gateway | node`
  - `security` = `deny | allowlist | full`
  - `ask` = `off | on-miss | always`
  - `pty: true` 适合必须要 TTY 的 CLI
- 关键规则：
  - 后台运行会返回 `sessionId`，之后必须用 `process` 管理
  - 如果没有 `process` 权限，`exec` 会退化成同步执行，忽略 `yieldMs/background`
  - `elevated` 本质上等价于 `host=gateway + security=full`，但还受 `tools.elevated` 和 agent 级配置双重门控
  - `host=node` 可以把命令打到节点上
- `process` 管后台 exec：`list / poll / log / write / kill / clear / remove`
- `poll` 看新输出和退出状态，`log` 适合按 offset/limit 取日志
- `process` 作用域是 agent 级，不能跨 agent 看别人的会话

### 3.2 browser
- 是 OpenClaw 管理的专用浏览器，不是“让模型瞎写 shell 自动化”。
- 操作分层：
  - 进程/标签：`status/start/stop/tabs/open/focus/close`
  - 页面理解：`snapshot`
  - 视觉确认：`screenshot`
  - 交互：`act`
  - 其他：`navigate/console/pdf/upload/dialog`
- 配置文件能力：`profiles/create-profile/delete-profile/reset-profile`
- 关键实践：
  - 默认流程：`status/start -> snapshot -> act -> screenshot(必要时)`
  - `snapshot` 默认优先 `ai`，要无障碍树才用 `aria`
  - `act` 最好依赖 `snapshot` 产生的 `ref`，而不是脆弱 CSS selector
  - 默认避免 `act -> wait` 这种瞎等，优先等可观察 UI 状态
  - 多 profile 支持多实例浏览器
  - 如果连接了带浏览器能力的节点，可能自动路由到节点
- 约束：
  - profile 名只能小写字母数字加连字符
  - 端口范围 18800-18899
  - 远程 profile 只支持 attach，不支持 start/stop/reset

### 3.3 web_search / web_fetch
- `web_search` 走 Brave Search API，需要配置 API key。
- `web_fetch` 用来抓 URL 并转 markdown/text，可截断长页面。
- 两者默认都有缓存（15 分钟）。
- JS 重站优先用 `browser`，不是 `web_fetch`。

### 3.4 nodes
- 面向配对节点：发现、描述、通知、远程执行、相机/屏幕、定位。
- 常用动作：
  - `status/describe`
  - `pending/approve/reject`
  - `notify`
  - `run`
  - `camera_snap/camera_clip/screen_record`
  - `location_get`
- 关键边界：
  - 摄像头/录屏前要确认用户同意
  - 先 `status/describe` 再做媒体能力调用
  - `run` 属于强能力，文档明确建议仅在用户明确同意时使用

### 3.5 canvas
- 用于驱动节点画布渲染：`present/hide/navigate/eval/snapshot/a2ui_push/a2ui_reset`
- 底层经 Gateway `node.invoke`
- A2UI 只支持 v0.8，不认 v0.9 JSONL

### 3.6 message
- 统一消息工具，覆盖 Discord / Telegram / WhatsApp / Slack / Signal / iMessage / Teams 等。
- 能力很多：发消息、投票、表情、读取、编辑、删除、置顶、线程、搜索、成员/角色、频道、语音状态、事件、管理动作等。
- 关键安全规则：
  - 若工具调用绑定到当前聊天会话，发送会被限制在该会话目标，避免跨上下文泄露
  - WhatsApp 发送和部分 poll 走 Gateway

### 3.7 cron
- 管理 Gateway 定时任务和唤醒。
- 动作：`status/list/add/update/remove/run/runs/wake`
- `add` 需要完整 cron 对象，`update` 用 `{ id, patch }`

### 3.8 gateway
- 管理 Gateway 进程级操作：`restart`、`config.get`、`config.schema`、`config.apply`、`config.patch`、`update.run`
- `config.apply/patch` 会做验证、写配置、重启并唤醒
- `restart` 默认不是随便开的，要显式启用 `commands.restart: true`

### 3.9 sessions_* / session_status
- `sessions_list`：列会话
- `sessions_history`：查历史
- `sessions_send`：向别的会话发消息
- `sessions_spawn`：起子 agent
- `session_status`：看当前或指定会话状态 / 模型覆盖
- 关键点：
  - `sessions_spawn` 非阻塞，立即 `accepted`
  - 任务完成后的 announce 是尽力而为，不等于消息一定送达
  - `sessions_send` 可以等待，也可以 fire-and-forget
  - agent-to-agent 存在 ping-pong 轮次上限，且有 announce 步骤

## 4. 推荐流程

### 4.1 浏览器自动化
1. `browser -> status/start`
2. `snapshot`
3. `act`
4. 必要时 `screenshot`

### 4.2 Canvas
1. `canvas -> present`
2. 必要时 `a2ui_push`
3. `snapshot`

### 4.3 节点操作
1. `nodes -> status`
2. `describe`
3. `notify/run/camera/screen`

## 5. 对我后续行为的直接启发

- 以后在 OpenClaw 环境里，优先想“有没有一流工具可直接做”，其次才是 shell 或绕路方案。
- 遇到浏览器任务，默认采用 `browser + snapshot + act` 工作流，而不是手搓 CLI 自动化。
- 遇到长任务，`exec + process` 是标准组合；没有 `process` 权限时，不要误以为后台真生效。
- 涉及消息、节点、摄像头、远程执行、Gateway 配置修改时，要明显提高安全阈值。
- 需要多 agent 协作时，优先用 `sessions_spawn` / `sessions_send`，并记住 `spawn` 是异步的。

## 6. 还值得继续学的后续文档

- `/tools/web`
- `/tools/plugin`
- `/tools/skills`
- `/tools/exec-approvals`
- `/tools/firecrawl`
- `/tools/lobster`
- `/tools/llm-task`
