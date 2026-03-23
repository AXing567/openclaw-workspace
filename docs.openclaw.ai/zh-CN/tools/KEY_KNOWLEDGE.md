# OpenClaw Tools 关键知识沉淀

## 1. 工具体系总览
- OpenClaw 把 `browser`、`canvas`、`nodes`、`cron` 等能力做成一流 typed tools，优先直接用工具，不要退回老式 `openclaw-*` skills + shell 兜底。
- 全局工具可通过 `openclaw.json` 的 `tools.allow` / `tools.deny` 控制，`deny` 优先级更高。
- 工具策略会影响模型实际能看到哪些工具；所以“配置里允许”和“当前 agent 真能用”是两层约束。

## 2. exec / process / 审批 / elevated
### exec 核心参数
- `command` 必填。
- `workdir` 默认当前工作目录。
- `yieldMs` 默认 10000ms，超时后自动转后台。
- `background=true` 立即后台。
- `timeout` 默认 1800 秒。
- `pty=true` 用于 TTY CLI / 编码 agent / terminal UI。
- `host`: `sandbox | gateway | node`。
- `security`: `deny | allowlist | full`。
- `ask`: `off | on-miss | always`。
- `elevated=true` 申请提升模式；只有 elevated 解析成 `full` 时才会强制 `security=full`。

### exec 行为重点
- 默认跑在 `sandbox`。
- 若 `process` 被禁用，`exec` 会同步运行，忽略 `yieldMs` / `background`。
- 后台会话按 agent 隔离；`process` 只能看同 agent 的后台会话。
- `node` 执行依赖已配对节点。

### 执行审批（exec approvals）
- 是 companion app / node host 的本地安全护栏，用来决定智能体能否在 `gateway` / `node` 主机执行命令。
- 审批配置文件：`~/.openclaw/exec-approvals.json`。
- 核心策略：
  - `security=deny`：全部拒绝主机执行。
  - `security=allowlist`：仅 allowlist 命令可执行。
  - `security=full`：全部允许，等价提权。
- `ask` 决定是否弹审批；如果 UI 不可用，则由 `askFallback` 决定（默认 deny）。
- 实际生效值取 `tools.exec.*` 和审批默认值里更严格的一方。
- 若 `elevated=full`，可直接跳过审批。

### elevated
- `/elevated on|ask`：切到 gateway 主机执行，但仍遵守 exec 审批。
- `/elevated full`：切到 gateway 主机执行，并跳过 exec 审批。
- 只在 agent 处于 sandbox 隔离时才改变执行位置；非 sandbox agent 本来就在主机上跑。
- elevated 不会绕过工具策略；如果 `exec` 本身被 deny，提权也没用。
- `/elevated` 和 `/exec` 是两套不同控制面：前者控制是否上主机，后者控制 exec 默认值。

## 3. 浏览器 / web / firecrawl
### web 工具定位
- `web_search`: 轻量搜索，不是浏览器自动化。
- `web_fetch`: HTTP GET + 可读性提取，不执行 JS。
- 遇到 JS-heavy、需要登录、反爬严格的站点，应该切浏览器工具，而不是硬怼 `web_fetch`。

### web_search 支持的 provider
- Brave Search
- Firecrawl Search
- Gemini + Google Search grounding
- Grok
- Kimi / Moonshot
- Perplexity / OpenRouter Sonar 路径

### web_fetch 关键点
- 查询结果缓存默认 15 分钟（搜索）。
- `web_fetch` 默认启用。
- 提取顺序：Readability 本地提取 -> Firecrawl（若配置） -> 基础 HTML 清洗回退。

### Firecrawl
- OpenClaw 可把 Firecrawl 作为 `web_fetch` 的回退提取器。
- 适合 JS 密集网站、普通 HTTP 难抓的网站。
- 配置键在 `tools.web.fetch.firecrawl.*`。
- OpenClaw 调 Firecrawl 时默认 `proxy: auto` + `storeInCache: true`。

### 浏览器工具
- 是 OpenClaw 托管的浏览器自动化能力，适合真实页面交互、登录态、复杂 JS。
- 可以使用专用浏览器 profile（默认 `openclaw`），也可以接管现有 Chromium/Chrome。
- 浏览器登录推荐人工在主机 profile 中完成，不要把凭证交给模型。
- X/Twitter 一类严格站点，优先主机浏览器，少用 sandbox 浏览器会话。

### Linux 浏览器排障
- `Failed to start Chrome CDP on port 18800` 常见根因是 Ubuntu 的 snap Chromium 限制。
- 官方推荐直接装 `.deb` 版 Google Chrome。
- 如必须用 snap Chromium，则走 attach-only 模式，手动拉起带远程调试端口的浏览器。

## 4. 子智能体 / 多智能体
### 子智能体定义
- 子智能体是从当前 agent 运行中分叉出的后台 agent run。
- 它们有独立 session：`agent:<agentId>:subagent:<uuid>`。
- 完成后会主动通告结果到请求者聊天渠道。

### 子智能体操作
- `/subagents list`
- `/subagents kill <id|#|all>`
- `/subagents log <id|#> [limit] [tools]`
- `/subagents info <id|#>`
- `/subagents send <id|#> <message>`
- `/subagents steer <id|#> <message>`
- `/subagents spawn <agentId> <task> [--model <model>] [--thinking <level>]`

### 子智能体限制
- 设计目标是并行化研究/慢任务，但保持隔离。
- 默认不拿 session tools，降低滥用风险。
- 明确禁止嵌套扇出：子智能体不能再生成子智能体。
- 每个子智能体独立消耗上下文和 token，重任务可给便宜模型。

### 多智能体沙箱与工具
- 每个 agent 可独立配置 `sandbox` 和 `tools`。
- 常见模式：全权限主助手、只读助手、无文件修改助手、纯消息助手。
- `agents.list[].sandbox` 覆盖 `agents.defaults.sandbox`。
- `agents.list[].tools` 可进一步收紧全局 `tools.allow/deny`。

## 5. Skills / ClawHub / 插件
### Skills 基础
- Skill 是一个目录，核心文件是带 YAML frontmatter 的 `SKILL.md`。
- OpenClaw 加载来源：
  1. 内置 skills
  2. `~/.openclaw/skills`
  3. `<workspace>/skills`
  4. `skills.load.extraDirs`（最低优先级）
- 同名优先级：workspace > home > bundled > extraDirs。

### Skills 关键机制
- 加载时会按环境、配置、依赖二进制存在性做过滤。
- 插件也能声明自己的 skills。
- `skills.entries.<skill>.env` / `apiKey` 可注入环境变量，但仅对宿主机运行有效。
- 沙箱里运行的 skills 不继承宿主 `process.env`；要单独在 sandbox docker env 里提供。

### 创建 Skills 最低要求
- 新建 `skills/<name>/SKILL.md`
- `SKILL.md` 里写 frontmatter + markdown 指令
- 刷新 skills 或重启 gateway 即可生效
- 写 skill 时重点是“何时触发、如何用工具、安全边界”，不是写人格废话

### Skills 配置
- `skills.allowBundled`: 只允许指定内置 skills
- `skills.load.watch`: 监听变更自动刷新
- `skills.install.preferBrew`: 安装优先 brew
- `skills.install.nodeManager`: npm/pnpm/yarn/bun
- `skills.entries.<skill>.enabled`: 禁用特定 skill

### ClawHub
- OpenClaw 公共 skills registry。
- 既可搜索/安装，也可更新/发布/备份 skills。
- 适合把本地 skill 公开同步，也适合快速安装社区 skill。

### 插件
- 插件是更底层的扩展机制，可提供 provider hooks、skills、routes、runtime 扩展等。
- skill 是“教模型怎么用工具”；plugin 是“扩展平台能力”。
- 需要新增工具、运行时 hook、控制面 schema 时，看插件文档，不要误用 skill 硬堆。

## 6. Slash Commands / Thinking / Agent Send / Reactions
### Slash Commands
- 大多数命令必须作为单独一条 `/...` 消息发送。
- `/think`、`/verbose`、`/reasoning`、`/elevated`、`/exec`、`/model`、`/queue` 属于“指令”。
- 指令若出现在普通消息里，只是本条消息的 inline 提示；若整条消息只有指令，则会持久化为 session 默认值。
- 指令仅对授权发送者生效；未授权用户发这些会被当普通文本。
- `! <cmd>` / `/bash <cmd>` 是主机 shell 命令入口，但默认关闭，而且要配合 elevated 白名单。

### Thinking
- 支持 `/t <level>`、`/think:<level>`、`/thinking <level>`。
- 级别：`off | minimal | low | medium | high | xhigh`。
- `highest` / `max` 会映射到 `high`。
- 优先级：内联指令 > 会话覆盖 > 全局默认 > 模型回退默认。
- 仅支持推理的模型才真正吃到高思考预算。

### Agent Send
- `openclaw agent --message ...` 可不经聊天入口直接跑单轮 agent。
- 默认经 gateway；加 `--local` 则本地嵌入式运行。
- 可用 `--to` / `--session-id` / `--agent` 决定会话归属。
- `--deliver` 可把回复真正发回渠道。
- gateway 不可达时，CLI 会回退到本地嵌入式运行。

### Reactions
- 是跨渠道统一语义的表情工具。
- `emoji` 必填。
- `emoji=""`：删除机器人当前反应（不同平台略有差异）。
- `remove=true`：删除指定 emoji，但通常仍要求传非空 emoji。

## 7. apply_patch / llm-task / lobster
### apply_patch
- 适合多文件、多段修改，不适合零散小 edit。
- 需要结构化 patch 格式：`*** Begin Patch` ... `*** End Patch`。
- 默认禁用，需在 `tools.exec.applyPatch.enabled` 启用。
- 仅 OpenAI / OpenAI Codex 可用，可用 `allowModels` 限制模型。

### llm-task
- 可选插件工具，用于“纯 JSON 输入输出”的结构化 LLM 步骤。
- 特别适合工作流引擎，例如 Lobster 中某一步要让模型给结构化结果。
- 不暴露工具给模型；若提供 `schema`，返回前会做 JSON Schema 校验。
- 有副作用的后续步骤仍需人工审批，不要把 JSON 输出当成可信事实源。

### Lobster
- 是 OpenClaw 的 typed workflow runtime。
- 目标：把多步工具调用收敛成一个可恢复、带审批门的确定性工作流。
- 优点：
  - 一次 Lobster 调用替代多轮工具编排
  - 显式审批 gate
  - 暂停后可 resume
- 适合邮件分类、审批流、稳定的多步自动化。

## 8. 实战判断原则
- 只是搜资料/拉网页正文：先 `web_search` + `web_fetch`。
- 需要登录、复杂交互、JS 渲染：上 `browser`。
- 要跑本地命令：`exec`。
- 要持续监控/长任务：`exec` + `process` 或子智能体。
- 要并行研究但保持隔离：子智能体。
- 要封装稳定多步流程：Lobster。
- 要做结构化 JSON 推理步骤：`llm-task`。
- 要扩展平台能力：plugin。
- 要教模型遵守某流程：skill。

## 9. 当前这次学习产物
- 已把 `https://docs.openclaw.ai/zh-CN/tools` 下 23 个页面抓取到本地：`docs.openclaw.ai/zh-CN/tools/`
- 已生成：
  - `README.md`：页面索引
  - 各页面原始提取版 `.md`
  - 本文件 `KEY_KNOWLEDGE.md`：关键知识沉淀

## 10. 后续建议
- 下一步适合继续学 `参考`、`网关与运维`、`自动化` 三大块。
- 如果要把知识真正内化为工作习惯，建议再补一份“工具选型决策树”和“常见故障处理手册”。
