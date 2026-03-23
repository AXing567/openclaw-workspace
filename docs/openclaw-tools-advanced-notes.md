# OpenClaw 官方文档学习沉淀：Web / Plugin / Skills / Exec Approvals / Firecrawl

来源：
- <https://docs.openclaw.ai/zh-CN/tools/web>
- <https://docs.openclaw.ai/zh-CN/tools/plugin>
- <https://docs.openclaw.ai/zh-CN/tools/skills>
- <https://docs.openclaw.ai/zh-CN/tools/exec-approvals>
- <https://docs.openclaw.ai/zh-CN/tools/firecrawl>

更新时间：2026-03-20

## 1. Web 工具的关键心智模型

- `web_search` / `web_fetch` 适合“轻量网页检索与抓取”，不是浏览器自动化替代品。
- JS 很重、反爬明显、需要交互时，应切到 `browser`。
- `web_fetch` 的提取链路是：
  1. Readability（本地）
  2. Firecrawl（若已配置）
  3. 基础 HTML 清理（最后兜底）
- 所以如果页面抓不干净，不一定是 web_fetch 完全没用，可能只是没配 Firecrawl，或者该页本来就该用 browser。

## 2. Firecrawl 的实际价值

- Firecrawl 是 `web_fetch` 的托管提取回退，适合：
  - 反机器人页面
  - JS 重页面
  - 普通 HTTP 抓取效果差的页面
- 核心配置位于：
  - `tools.web.fetch.firecrawl.apiKey`
  - `baseUrl`
  - `onlyMainContent`
  - `maxAgeMs`
  - `timeoutSeconds`
- `web_fetch` 使用 Firecrawl 时，默认走：
  - `proxy: "auto"`
  - `storeInCache: true`
- `auto` 可能比 basic 更耗配额，因为失败后会升到 stealth 重试。
- 结论：Firecrawl 是“增强 web_fetch 抓取质量”的能力，不是浏览器交互能力。

## 3. Plugin 的关键理解

- 插件是扩展 OpenClaw 能力的载体，可以提供：
  - 工具
  - 渠道
  - Skills
  - 其他运行时扩展
- 插件自己的 Skills 会参与正常 Skills 优先级体系，不是独立平行系统。
- 启用第三方插件时，应把它视为高信任面扩展：风险等级高于普通文档配置。
- 适合用插件解决“平台能力扩展”，适合用 skill 解决“任务流程固化”。

## 4. Skills 的关键理解

### 4.1 加载位置和优先级
- 三层来源：
  - 内置 Skills
  - `~/.openclaw/skills`
  - `<workspace>/skills`
- 优先级：
  - `<workspace>/skills` > `~/.openclaw/skills` > 内置
- 还可以通过 `skills.load.extraDirs` 增加额外目录，但优先级最低。

### 4.2 多智能体语义
- `<workspace>/skills` 只对该 workspace 对应 agent 生效。
- `~/.openclaw/skills` 是共享层，对同机多个 agent 可见。
- 想做“用户级共享 skills 包”，优先放共享层；想做“项目专属流程”，放 workspace 层。

### 4.3 SKILL.md 结构要求
- 至少要有：
  - `name`
  - `description`
- frontmatter 解析器有现实限制：
  - 只支持单行 key
  - `metadata` 最好写成单行 JSON 对象
- 文档中引用 skill 目录时用 `{baseDir}` 更稳。

### 4.4 门控与依赖
- `metadata.openclaw` 可定义：
  - `always`
  - `os`
  - `requires.bins`
  - `requires.anyBins`
  - `requires.env`
  - `requires.config`
  - `primaryEnv`
  - `install`
- 重点：Skills 不是“只要写了就会出现”，而是要通过加载时资格检查。
- `requires.bins` 在 host 上检查；若 agent 跑在 sandbox，容器里也必须真有该二进制。

### 4.5 配置注入
- `~/.openclaw/openclaw.json` 里可用：
  - `skills.entries.<name>.enabled`
  - `env`
  - `apiKey`
  - `config`
- `env` / `apiKey` 是“按 agent run 注入到 process.env”，不是全局 shell 永久环境。
- run 结束后环境会恢复。

### 4.6 会话快照与热更新
- Skills 资格列表会在会话开始时快照化。
- 修改 skill 或配置后，通常新会话才稳定生效。
- 若开了 watch，Skills 能热刷新，但应理解为“下一轮可取到新快照”，不要假设当前轮立刻全量同步。

### 4.7 Token 成本
- Skills 列表会被注入系统提示词。
- 每新增一个 skill 都增加固定 token 开销。
- 结论：Skills 不是越多越好，应该控制数量、描述长度和真正必要性。

## 5. 执行审批（exec approvals）的关键理解

### 5.1 本质
- 它是 host 执行层的安全联锁，不是简单弹窗。
- 只有当：
  - 工具策略允许
  - 审批策略允许
  - allowlist / 用户批准满足
  才能真的在 gateway 或 node 主机上执行。
- 但如果 `elevated/full` 直接放开，审批可能被跳过。

### 5.2 核心策略轴
- `security`: `deny | allowlist | full`
- `ask`: `off | on-miss | always`
- `askFallback`: `deny | allowlist | full`
- 生效时取更严格的一边；UI 不可达时由 `askFallback` 决定。

### 5.3 allowlist 的真实含义
- allowlist 是按 agent 维度配置的。
- 匹配目标是“解析后的二进制路径”，不是随便写个命令名就算。
- 大小写不敏感。
- 会记录 last used 等元信息，便于清理。

### 5.4 safeBins 与 shell 限制
- 一些 `safeBins`（如 `jq/grep/cut/sort/...`）在 allowlist 模式下可免显式列入，但仅限 stdin 安全用法。
- allowlist 模式下：
  - shell 链式命令只有在每段都满足允许条件时才允许
  - 重定向默认不支持
  - 命令替换 `$()` / 反引号会被拒绝
- 这意味着：审批系统理解的是“可执行路径和安全语义”，不是文本表面相似就行。

### 5.5 审批投递到聊天
- exec 审批可转发到聊天渠道。
- 用户通过：
  - `/approve <id> allow-once`
  - `/approve <id> allow-always`
  - `/approve <id> deny`
 处理。
- 对话里如果我遇到 approval-pending，应该把可直接执行的 `/approve ...` 原样给用户，而不是自己重新改写成模糊描述。

## 6. 对“提高 OpenClaw 智商”的直接启发

- 真正的提升点，不是盲目加更多 Skills，而是：
  - 保持 Skills 数量克制
  - 把高频且稳定的流程 skill 化
  - 把平台能力扩展留给 plugin
  - 把轻网页抓取和浏览器交互分层
  - 把 host 执行与审批边界讲清楚
- 如果要做更聪明的工作区，应优先形成：
  - 少而精的 Skills
  - 清楚的插件边界
  - 合理的 web/browser 选路
  - 明确的 exec 审批策略
