# OpenClaw 官方文档学习沉淀：Sub-agents

来源：
- <https://docs.openclaw.ai/tools/subagents>
- 通过 `https://docs.openclaw.ai/llms-full.txt` 提取正文

更新时间：2026-03-21

## 1. Sub-agents 的核心定位

- Sub-agents 不是“同会话里的后台线程”，而是**从当前 agent run 派生出的独立会话**。
- 会话 key 形态是：`agent:<agentId>:subagent:<uuid>`。
- 它完成后不会默默结束，而是会把结果**announce 回请求它的聊天上下文**。
- 这意味着它更适合：
  - 并行研究
  - 慢工具任务
  - 长任务拆分
  - 主代理不想被阻塞的场景

一句话：Sub-agents 是 OpenClaw 的“后台独立 run + 完成后回传”机制，不是普通函数调用。

## 2. 使用心智模型

### 2.1 `/subagents spawn` 和 `sessions_spawn` 的关系

- 用户侧 slash command 是 `/subagents spawn ...`
- 工具侧核心能力是 `sessions_spawn`
- `sessions_spawn` 的语义是：
  1. 启动子代理 run
  2. 不阻塞当前 run
  3. 子代理结束后执行 announce
  4. 把 announce 内容送回请求方

所以真正应该记住的是：**Sub-agents 的编程接口是 `sessions_spawn`，不是把 `/subagents` 当脚本 API。**

### 2.2 默认是非阻塞的

- `sessions_spawn` 总是立即返回 accepted / runId / childSessionKey
- 不会像普通工具那样等结果回来
- 要看过程与结果，应使用：
  - `subagents`
  - `sessions_history`
  - `sessions_list`
  - `/subagents info`
  - `/subagents log`

这和 `exec + process` 的前后台模型很像，但对象从“进程”换成了“agent run”。

## 3. 关键参数理解

` sessions_spawn ` 常用参数：

- `task`：必填，子代理要做什么
- `label`：给 run 一个更易识别的名字
- `agentId`：指定由哪个 agent id 去跑；是否允许，受 allowlist 控制
- `model` / `thinking`：可单独覆盖子代理模型与思考强度
- `runTimeoutSeconds`：运行超时，超时只会停 run，不等于自动清理会话
- `thread`：请求线程绑定
- `mode`：`run | session`
- `cleanup`：`delete | keep`
- `sandbox`：`inherit | require`

几个容易踩坑的点：

### 3.1 `mode` 默认不是永远一样的
- 默认 `mode` 是 `run`
- 但如果 `thread: true` 且没写 `mode`，默认会变成 `session`
- `mode: "session"` 反过来又要求 `thread: true`

结论：**一旦涉及 thread binding，就不要靠隐式默认，最好显式写清楚 `thread` 和 `mode`。**

### 3.2 `cleanup: delete` 不是“彻底无痕删除”
- 文档说明 delete 本质是 archive
- 它会执行 `sessions.delete`
- transcript 会改名成 `*.deleted.<timestamp>` 保留在同目录

结论：它是“归档式删除”，不是物理抹除。

### 3.3 `runTimeoutSeconds` 不负责自动归档
- 超时只会中止 run
- 会话是否清理由 auto-archive 逻辑决定
- 所以不要把“超时”和“生命周期清理”混成一个概念

## 4. Thread-bound session 的真实意义

- 当频道支持 thread binding 时，sub-agent 可以绑定到一个线程
- 之后该线程里的后续消息，会持续路由到这个子代理 session
- 这不是一次性 run，而是变成“线程中的持久工作会话”

关键结论：

- `sessions_spawn({ thread: true })` 不只是“回复开个线程”，而是**尝试建立线程 ↔ session 的持续绑定**
- 如果要做持续协作型子代理，这比一次性 announce 更重要

当前文档明确：

- 持久 thread-bound subagent session 目前主要支持 Discord
- 可通过 `/focus`、`/unfocus`、`/agents`、`/session idle`、`/session max-age`` 管理绑定

## 5. 工具面与安全边界

### 5.1 默认不给 session/system 工具

默认 sub-agent 会拿到“几乎所有工具”，但**不包含 session tools 和 system tools**，尤其是：

- `sessions_list`
- `sessions_history`
- `sessions_send`
- `sessions_spawn`

这是很关键的安全默认值：

- 子代理能干活
- 但默认不能到处翻会话 / 再乱开会话 / 控制系统级调度

### 5.2 开启嵌套后，depth-1 orchestrator 权限会变化

如果配置 `maxSpawnDepth >= 2`：

- depth-1 orchestrator sub-agent 会额外获得：
  - `sessions_spawn`
  - `subagents`
  - `sessions_list`
  - `sessions_history`
- depth-2 worker 仍然不能继续 spawn

这说明 OpenClaw 对“可编排子代理”和“纯执行工人子代理”是分层授权的。

## 6. 嵌套 Sub-agents 的最佳理解

### 6.1 默认禁止继续套娃

- 默认 `maxSpawnDepth: 1`
- 也就是主代理可以 spawn 子代理
- 但子代理不能再 spawn 孙代理

### 6.2 推荐模式是深度 2

文档推荐的典型模式：

- main
- orchestrator sub-agent
- worker sub-sub-agents

也就是：

1. 主代理负责面向用户
2. orchestrator 负责拆任务
3. workers 负责具体执行

### 6.3 announce 是逐层回流，不是直接都回主会话

结果链路是：

1. depth-2 worker → announce 给 depth-1 orchestrator
2. orchestrator 汇总后结束 → announce 给 main
3. main 再面向用户组织最终输出

这点很关键：**每层只直接看到自己子层的 announce，不是所有结果都自动直达顶层。**

## 7. 运行与清理机制

### 7.1 Auto-archive 是 best-effort

- 默认 `archiveAfterMinutes = 60`
- gateway 重启会丢失挂起中的 archive timer
- 所以它不是强一致生命周期系统，而是“尽量清理”

### 7.2 并发是专门的 lane

- lane 名叫 `subagent`
- 默认并发上限 `maxConcurrent = 8`

这说明 Sub-agents 不是和所有别的任务完全混在一起抢同一队列，而是有独立并发控制。

### 7.3 停止会级联

- 主聊天里 `/stop`
- `/subagents kill <id>`
- `/subagents kill all`

都会对下层子代理产生级联终止效果。

结论：编排链条不是松散关系，而是带父子生命周期联动。

## 8. 认证模型

- Sub-agent 的 auth 按 **agent id** 解析，不按 session 类型解析
- 会从该 agent 的 `agentDir` 加载 auth
- 同时主 agent 的 auth profile 会作为 fallback 合并进来

含义：

- 子代理不是天然完全隔离身份
- 更像“子代理优先用自己 agent 的身份，主 agent 身份作为兜底”

所以如果以后做多 agent 分工，应该把 auth 边界设计成“主身份 + 定向覆盖”，不要误以为 session 一拆就天然强隔离。

## 9. 对当前工作区的直接启发

### 9.1 什么时候该用 Sub-agents

适合：
- 需要并行探索多个方向
- 主对话不能被慢操作阻塞
- 长研究任务需要后台跑完再回报
- 需要 orchestrator / worker 分层时

不适合：
- 只改一两个文件的小修补
- 纯读取本地几份文件的即时任务
- 需要共享当前会话完整人格/上下文的任务

### 9.2 当前最该记住的一条上下文差异

文档明确写了：

- sub-agent context **只注入 `AGENTS.md` + `TOOLS.md`**
- 不注入：`SOUL.md` / `IDENTITY.md` / `USER.md` / `HEARTBEAT.md` / `BOOTSTRAP.md`

这意味着：

- 子代理天然不是“完整的我”
- 它更像被约束过上下文的执行体
- 如果任务依赖用户偏好、人格语气、长期记忆，主代理必须在 task 里显式补充

这是当前工作区做多代理协作时最容易忽略、也最容易出错的一点。

### 9.3 对“提高 OpenClaw 智商”的方法论补充

真正聪明的用法不是“能 spawn 就全 spawn”，而是：

- 小任务直接本地做
- 长任务/慢任务/可并行任务再 spawn
- 对需要人格与长期上下文的任务，主代理显式传任务边界
- 若要做 orchestrator 模式，优先限制在 depth 2
- 用 `maxConcurrent` 和 `maxChildrenPerAgent` 防止失控 fan-out

## 10. 可以沉淀进长期记忆的稳定原则

建议长期保留的不是具体参数细节，而是这些原则：

1. Sub-agents 是“独立 session 的后台 agent run + 完成 announce 回传”，不是普通工具调用。
2. `sessions_spawn` 是非阻塞模型；检查和控制要靠 subagent/session 相关工具，不要按同步工具理解。
3. Sub-agent 默认上下文不含 `SOUL.md/USER.md/MEMORY.md` 这一类人格与长期记忆，因此依赖这些信息的任务必须显式传入。
4. 嵌套 sub-agents 只适合有限深度的 orchestrator 模式，推荐深度 2；不要无约束套娃。

