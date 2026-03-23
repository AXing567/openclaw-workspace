# OpenClaw 文档学习笔记（2026-03-20 heartbeat）

## 本轮学习主题
- Exec
- 子智能体（Subagents）
- Skills

## 关键结论

### 1. Exec
- `exec` 是工作区 shell 执行入口，长任务通过 `process` 接续前后台。
- 默认 `host=sandbox`，但文档特别强调：**若沙箱隔离默认关闭，sandbox 实际可能直接在 gateway 主机运行且无需审批**。这点很关键，不能把 `sandbox` 误当成总是隔离容器。
- 真正涉及审批和主机安全边界时，要明确理解 `host=gateway|node`、`security`、`ask`、`elevated` 四层关系。
- 主机执行会拒绝 `env.PATH` 与 `LD_* / DYLD_*` 之类加载器覆盖，防止二进制劫持；这说明 host exec 的安全模型比我之前想的更细。
- 后台 exec 退出时会触发系统事件并请求 heartbeat（`tools.exec.notifyOnExit`），这意味着 heartbeat 可以天然充当“异步任务结果通知通道”的接收面。

### 2. 子智能体
- 子智能体是后台独立会话，不阻塞主会话，完成后会主动向请求方聊天面通告结果。
- 设计目标不是“无限分身”，而是：并行研究/慢任务，同时默认隔离，并且**禁止子智能体再生成子智能体**，避免嵌套扇出失控。
- `sessions_spawn` 才是工具层核心接口，`/subagents spawn` 是命令层封装。
- 子智能体有独立 token 成本与上下文，适合把重活/脏活/慢活分出去，并按任务质量要求切换更便宜模型。
- 自动归档与 `cleanup: delete|keep` 说明其生命周期是可控的，不该把它当成永久线程。

### 3. Skills
- Skills 加载优先级：`<workspace>/skills` > `~/.openclaw/skills` > 内置 skills。
- 这意味着工作区 skill 非常适合做“当前项目/当前用户特化”的覆盖，而共享 skill 适合复用能力。
- 第三方 skill 本质上应视作不受信任代码，启用前必须审阅。
- `skills.entries.*.env` / `apiKey` 会把秘密注入宿主进程，因此技能设计时要避免把秘密带入日志/提示词。
- Skills 不只是提示模板，而是 OpenClaw 的“任务流程教学层”；插件则更偏能力扩展层，这个分层值得在方法论里固化。

## 方法论修正
- 以后谈 OpenClaw 执行安全，不能只说“exec 有审批”，而要区分：
  1. tool 策略是否允许
  2. host 选的是 sandbox/gateway/node 哪层
  3. sandbox 是否真的隔离
  4. gateway/node 的 ask/security/allowlist/approvals 如何生效
- 以后谈“多 agent 协作”，要优先理解为：
  - 主会话负责路由、判断、整合
  - 子智能体负责并行、耗时、独立上下文任务
  - 不是所有复杂任务都该塞进一个长上下文里硬做


## 第二轮补充（18:50 heartbeat）

### 4. Agent Send
- `openclaw agent` 本质上是“不依赖入站消息，直接跑一轮 agent”。
- 默认经 Gateway 跑，Gateway 不可达时会回退到本地嵌入式运行时。
- 它适合做脚本化触发、定时任务触发、外部编排，而不是只能靠聊天界面驱动 agent。
- `--deliver` / `--channel` / `--reply-*` 说明“会话归属”和“消息投递目标”是可分离的，这对自动化设计很重要。

### 5. 多智能体沙箱与工具策略
- OpenClaw 的多智能体安全边界不是单一开关，而是“沙箱配置 + 工具 allow/deny + profile + provider 级限制”的组合。
- 文档明确给出过滤顺序：
  1. tools.profile
  2. tools.byProvider[provider].profile
  3. 全局 tools.allow/deny
  4. provider 级 allow/deny
- 这意味着以后诊断“为什么某工具能用/不能用”，不能只看单点配置，必须按层排查。
- 凭证按 agentDir 隔离，不会自动跨 agent 共享；这是安全设计，也意味着多 agent 方案要显式管理认证复制。

### 6. Skills 配置
- `skills.entries.<skill>.env/apiKey` 只对宿主机运行生效；如果会话在 Docker 沙箱里，这些环境变量不会自动进入容器。
- 所以以后如果技能在沙箱里报“缺 key / 缺 env”，优先检查 `agents.defaults.sandbox.docker.env`，而不是误判 skill 本身坏了。
- `allowBundled` 可以白名单内置 skills，说明内置 skill 也能做最小化加载控制。

## 再修正一条方法论
- 以后理解 OpenClaw 时，至少要把问题分成四层：
  1. **会话/路由层**：消息从哪来，要投递到哪
  2. **智能体层**：哪个 agent 处理，是否多 agent / subagent
  3. **执行安全层**：沙箱、host、approval、tool policy
  4. **能力装配层**：skills、plugins、env、auth
- 之前容易把这些层混在一起，现在文档已经足够证明：OpenClaw 实际上是一个分层系统，不是“一个 agent + 一堆工具”的扁平结构。

## 第三轮补充（19:54 heartbeat）

### 7. ClawHub
- ClawHub 不只是“下载技能的网站”，而是 OpenClaw 的公共 Skills 注册中心，包含搜索、安装、更新、发布、版本管理、评论星标、审核钩子等完整生态能力。
- 默认安装到当前工作目录的 `./skills`，若已配置 OpenClaw workspace 则会回退到 workspace；这与 OpenClaw 的 workspace-skills 优先级模型是对齐的。
- `clawhub search` 走的是向量/语义搜索，不只是关键词匹配，这意味着后续找技能时可以用需求表达而不是死记名字。
- 发布技能还有“备份”意义，不只是分发；这让 ClawHub 同时承担了技能分发与同步仓库的角色。

### 8. Creating Skills
- 官方创建 skill 的最小模型很轻：一个目录 + 一个 `SKILL.md` 就够。
- 文档强调 skill 的本质是“给 LLM 的指令和工具定义”，不是复杂插件框架；这解释了为什么 skill 适合做流程封装，而不是底层能力开发。
- 最佳实践里最有价值的一条是：**告诉模型做什么，不要写成教 AI 如何扮演 AI 的废话。** 这和当前用户偏好也一致，值得固化成写 skill 的风格准则。
- 文档把本地测试方式明确成 `openclaw agent --message ...`，说明 skill 验证并不依赖真实聊天渠道。

### 9. Slash Commands
- Slash commands 由 Gateway 处理，且分成三类：
  1. 独立命令 `/...`
  2. 指令类（如 `/think` `/model` `/exec`）
  3. 内联快捷方式（如 `/help` `/status`）
- 指令类有一个很关键的语义差异：
  - 独立消息时，会持久化到会话设置
  - 混在普通聊天消息里时，只算当次 inline hint，不持久化
- 这说明 OpenClaw 的“命令系统”和“提示词系统”并不是完全分离，而是有一层前置解析器。
- `/approve`、`/context`、`/exec`、`/elevated` 这些命令把调试、审批、执行边界都暴露成用户可控接口，说明 OpenClaw 很强调可观察性和可干预性。

## 新的结构性理解
- OpenClaw 不只是聊天 agent，而更像一个“消息路由 + agent runtime + tool orchestration + skill registry + policy gate”的操作系统。
- 当前最值得继续系统学习的，不是零散工具清单，而是这些横切机制：
  - 命令/指令解析
  - 技能装载与分发
  - 多智能体与会话隔离
  - 执行审批与工具策略

## 第四轮补充（20:27 heartbeat）

### 10. Plugin
- Plugin 是 OpenClaw 的扩展层，和 Skill 不是一回事。
- 原生 OpenClaw 插件会在进程内加载运行时代码；兼容 bundle 虽然也会显示在插件列表里，但不会以同样方式执行原生运行时代码。
- 插件系统本质上有四层：发现、启用/验证、运行时加载、注册。这说明它比 skill 更接近平台扩展架构，而不是单纯提示词打包。
- 当需要“核心系统尚未内置的能力”时，应优先考虑 plugin；当需要“教 agent 怎么调用已有能力”时，优先考虑 skill。

### 11. Lobster
- Lobster 是确定性工作流运行时，不是普通脚本替代品。它最核心的价值是：
  - 一次调用替代多次工具编排
  - 显式审批关卡
  - 可恢复状态（resume token）
- 这说明它适合把“多步且有副作用”的流程固化成可审计管道，而不是继续交给 LLM 一步步现场编排。
- Lobster 明确支持 `.lobster` 工作流文件，且把条件、stdin、approval 等都变成数据结构；这对重放、审计、版本化都很友好。
- 文档特别强调 Lobster 是沙箱感知的，并且在沙箱隔离状态下禁用，这意味着它依赖本地主机执行环境。

### 12. LLM Task
- `llm-task` 是给工作流体系补“结构化模型步骤”的插件工具：只做 JSON 输入输出，不暴露工具。
- 最合理的用法不是直接替代聊天 agent，而是在 Lobster 这类确定性工作流里嵌入一个受 schema 约束的分类/摘要/起草步骤。
- 文档再次提醒：没有 schema 校验时，输出仍应视为不可信；所以它本质上是“更可控”，不是“绝对可信”。
- 这让 OpenClaw 的自动化能力出现了一个很清晰的分层：
  - agent：开放式对话与判断
  - llm-task：受限的结构化模型步骤
  - lobster：确定性流程编排 + 审批 + 恢复

## 当前最重要的抽象升级
- OpenClaw 的真正强项，不只是“能聊天时顺手调工具”，而是：
  - 用 skill 封装调用方法
  - 用 plugin 扩展底层能力
  - 用 llm-task 注入受限模型能力
  - 用 lobster 把多步流程收敛成可审批、可恢复、可审计的管道
- 这比普通 agent 框架更接近“有策略层和执行层分离的自动化操作系统”。

## 第四轮补充（20:59 heartbeat）

### 10. Browser（OpenClaw 托管）
- OpenClaw 浏览器本质是“专供 agent 使用的独立浏览器配置文件”，不是去劫持用户日常浏览器。
- `openclaw` profile 是托管隔离浏览器，`chrome` profile 则是扩展中继到系统浏览器；这两种模式的心智模型必须分清。
- 浏览器控制服务只绑 loopback，本地有内部控制平面；如果是远程/节点，还可以通过节点浏览器代理或远程 CDP 走外部浏览器。
- 文档已经明确支持多 profile、远程 CDP、Browserless、节点代理，说明浏览器能力不是单点功能，而是一套可替换后端的控制架构。

### 11. Browser Login
- 官方明确建议：需要登录的网站，优先让人类在 host 浏览器 profile 里手动登录；**不要把凭证交给模型**。
- 对 X/Twitter 这类严格风控站点，推荐“读/搜用 CLI skill，发帖用 host 浏览器手动登录后操作”，这是一个很实用的攻防边界。
- 文档承认沙箱浏览器更容易触发反机器人检测，因此对严格站点优先 host browser，而不是一味追求更自动化。

### 12. Browser Troubleshooting (Linux)
- `Failed to start Chrome CDP on port 18800` 的一个核心根因，是 Ubuntu 的 Chromium 往往是 snap 包，受 AppArmor 限制，OpenClaw 不容易正常拉起/管理。
- 官方推荐解法是直接装 Google Chrome `.deb`，而不是继续和 snap 包死磕。
- 另一条可行路径是 `attachOnly + 手动启动 Chromium --remote-debugging-port`，也就是把“浏览器拉起责任”从 OpenClaw 挪给外部进程。
- 这和我之前总结的“受限环境下用 attach / local executablePath / no-sandbox / 手动补依赖打通浏览器”思路是吻合的，可以相互印证。

## 与既有经验对齐后的新判断
- OpenClaw 浏览器体系的正确理解不是“一个 browser 工具”，而是：
  1. **控制平面**：Gateway loopback browser service
  2. **执行后端**：托管 profile / 扩展 relay / 节点代理 / 远程 CDP / Browserless
  3. **身份态**：独立 profile 登录态
  4. **风险边界**：host vs sandbox，手动登录 vs 自动登录
- 以后做网页任务时，应优先按页面类型选路径：
  - 普通公开页面：托管 browser / web 工具
  - 复杂交互页面：host openclaw browser
  - 强风控登录站点：host browser + 人类手动登录
  - 远程浏览器环境：节点代理或 remote CDP

## 第五轮补充（22:04 heartbeat）

### 13. Web 工具
- `web_search` 和 `web_fetch` 是轻量 Web 工具，不是浏览器自动化；JS 重页面或登录态页面应直接切 browser。
- `web_search` 不是绑死某一家，OpenClaw 把 Brave / Firecrawl / Gemini / Grok / Kimi / Perplexity 都抽象成统一入口，这对后续做 provider 切换很重要。
- 搜索结果有缓存 TTL，说明它适合“信息检索”而不是“必须秒级最新”的场景。
- 提供商相关配置已统一推荐写到 `plugins.entries.<plugin>.config.webSearch.*`，旧 `tools.web.search.*` 路径只是兼容层，不该继续当新配置写法。

### 14. Firecrawl
- Firecrawl 在 OpenClaw 里的定位不是通用浏览器替代，而是 `web_fetch` 的托管提取回退层。
- `web_fetch` 的提取顺序很关键：
  1. Readability（本地）
  2. Firecrawl（已配置时）
  3. 基本 HTML 清理
- Firecrawl 的优势是机器人规避和缓存，尤其适合普通 HTTP 抓取失败、又不想直接开浏览器的时候。
- 但它的 `proxy:auto` 可能触发 stealth 重试并消耗更多额度，所以它更像“有成本的增强抓取”，不是该无脑常开乱用。

### 15. LLM Task
- `llm-task` 是可选插件工具，核心价值是：用纯 JSON 输入/输出跑一个结构化 LLM 子任务，而不是把整个流程都塞进主 agent 推理里。
- 它特别适合 Lobster 之类工作流编排，说明 OpenClaw 不只是给 agent 用，也在给“工作流引擎里的一个 LLM 步骤”留接口。
- 安全边界很清晰：
  - 纯 JSON 模式
  - 不向模型暴露工具
  - 最好配 `schema` 验证
  - 有副作用前另设审批
- 这等于把“LLM 作为结构化变换器”显式产品化了，而不只是聊天模型。

## 新的选型准则
- 以后网页相关任务，优先这样分流：
  - **找资料/找链接** → `web_search`
  - **抓正文/提可读文本** → `web_fetch`
  - **HTTP 不行但又不想开浏览器** → `web_fetch + Firecrawl`
  - **JS 交互/登录/点击输入** → `browser`
- 以后结构化小推理子步骤，优先考虑：
  - 如果只是“把输入变成 JSON 输出”，比起开一个完整子智能体，更适合 `llm-task`
  - 如果需要长上下文、多轮探索、工具使用，再上 subagent
