Web 工具 - OpenClaw 跳转到主要内容 OpenClaw home page 简体中文 搜索... ⌘ K 
- GitHub 

- Releases 

- Discord 
搜索... Navigation 内置工具 Web 工具 快速开始 安装 消息渠道 代理 工具 模型 平台 网关与运维 参考 帮助 
##### 概览 

- 工具 

##### 内置工具 

- apply_patch 工具 

- Brave Search 

- 提升模式 

- Exec 工具 

- 执行审批 

- Firecrawl 

- LLM 任务 

- Lobster 

- Perplexity Sonar 

- 表情回应 

- 思考级别 

- Web 工具 

##### 浏览器 

- 浏览器（OpenClaw 托管） 

- 浏览器登录 

- 浏览器故障排除 

##### 代理协作 

- Agent Send 

- 子智能体 

- 多智能体沙箱与工具 

##### 技能 

- 创建 Skills 

- 斜杠命令 

- Skills 

- Skills 配置 

- ClawHub 

- 插件 

##### 扩展 

- Architecture 

- Voice Call 插件 

- Zalo Personal 插件 

- 插件清单 

- 插件智能体工具 

- OpenProse 

##### 自动化 

- Hooks 

- 定时任务 

- 定时任务与心跳对比 

- 自动化故障排查 

- Webhooks 

- Gmail PubSub 

- 投票 

- 认证监控 

##### 媒体与设备 

- 节点 

- 节点故障排查 

- 媒体理解 

- 图像和媒体支持 

- 音频与语音消息 

- 相机捕获 

- Talk 模式 

- 语音唤醒 

- 位置命令 

- 文本转语音 
在此页面 
- Web 工具 

- 工作原理 

- 选择搜索提供商 

- 获取 Brave API 密钥 

- 在哪里设置密钥（推荐） 

- 使用 Perplexity（直连或通过 OpenRouter） 

- 获取 OpenRouter API 密钥 

- 设置 Perplexity 搜索 

- 可用的 Perplexity 模型 

- web_search 

- 要求 

- 配置 

- 工具参数 

- web_fetch 

- 要求 

- 配置 

- 工具参数 
内置工具 
# Web 工具 

# ​ Web 工具 
OpenClaw 提供两个轻量级 Web 工具： 
- `web_search `— 通过 Brave Search API、Firecrawl Search、Gemini with Google Search grounding、Grok、Kimi 或 Perplexity Search API 搜索网络。 

- `web_fetch `— HTTP 获取 + 可读性提取（HTML → markdown/文本）。 
这些 不是 浏览器自动化。对于 JS 密集型网站或需要登录的情况，请使用 浏览器工具 。 
## ​ 工作原理 

- `web_search `调用你配置的提供商并返回结果。 

- 结果按查询缓存 15 分钟（可配置）。 

- `web_fetch `执行普通 HTTP GET 并提取可读内容（HTML → markdown/文本）。它 不 执行 JavaScript。 

- `web_fetch `默认启用（除非显式禁用）。 

- 启用捆绑的 Firecrawl 插件后，还会提供 `firecrawl_search `和 `firecrawl_scrape `。 

## ​ 选择搜索提供商 
提供商 结果形式 说明 API 密钥 Brave Search API 结构化结果 + 摘要 支持 Brave `llm-context `模式 `BRAVE_API_KEY `Firecrawl Search 结构化结果 + 摘要 Firecrawl 专用搜索控制请使用 `firecrawl_search ``FIRECRAWL_API_KEY `Gemini AI 综合答案 + 引用 使用 Google Search grounding `GEMINI_API_KEY `Grok AI 综合答案 + 引用 使用 xAI 实时网络搜索 `XAI_API_KEY `Kimi AI 综合答案 + 引用 使用 Moonshot web search `KIMI_API_KEY `/ `MOONSHOT_API_KEY `Perplexity Search 结构化结果 + 摘要 兼容 OpenRouter Sonar 路径 `PERPLEXITY_API_KEY `/ `OPENROUTER_API_KEY `参见 Brave Search 设置 和 Perplexity Sonar 了解提供商特定详情。 在配置中设置提供商： 复制 `{ tools : { web : { search : { provider : "brave" , // 或 "firecrawl" | "gemini" | "grok" | "kimi" | "perplexity" } , } , } , } `示例：切换到 Perplexity Search / Sonar 兼容路径： 复制 `{ plugins : { entries : { perplexity : { config : { webSearch : { apiKey : "pplx-..." , baseUrl : "https://api.perplexity.ai" , model : "perplexity/sonar-pro" , } , } , } , } , } , tools : { web : { search : { provider : "perplexity" , } , } , } , } `
## ​ 获取 Brave API 密钥 

- 在 https://brave.com/search/api/ 创建 Brave Search API 账户 

- 在控制面板中，选择 Data for Search 计划（不是”Data for AI”）并生成 API 密钥。 

- 运行 `openclaw configure --section web `将密钥存储在配置中（推荐），或在环境中设置 `BRAVE_API_KEY `。 
Brave 提供免费层和付费计划；查看 Brave API 门户了解当前限制和定价。 
### ​ 在哪里设置密钥（推荐） 
推荐： 运行 `openclaw configure --section web `。它会把密钥存储到 `~/.openclaw/openclaw.json `的 `plugins.entries.brave.config.webSearch.apiKey `。 环境变量替代方案： 在 Gateway 网关进程环境中设置 `BRAVE_API_KEY `。对于 Gateway 网关安装，将其放在 `~/.openclaw/.env `（或你的服务环境）中。参见 环境变量 。 
## ​ 使用 Perplexity（直连或通过 OpenRouter） 
Perplexity Sonar 模型具有内置的网络搜索功能，并返回带有引用的 AI 综合答案。你可以通过 OpenRouter 使用它们（无需信用卡 - 支持加密货币/预付费）。 
### ​ 获取 OpenRouter API 密钥 

- 在 https://openrouter.ai/ 创建账户 

- 添加额度（支持加密货币、预付费或信用卡） 

- 在账户设置中生成 API 密钥 

### ​ 设置 Perplexity 搜索 
复制 `{ tools : { web : { search : { enabled : true , provider : "perplexity" , } , } , } , plugins : { entries : { perplexity : { config : { webSearch : { // API 密钥（如果设置了 OPENROUTER_API_KEY 或 PERPLEXITY_API_KEY 则可选） apiKey : "sk-or-v1-..." , // 基础 URL（如果省略则根据密钥感知默认值） baseUrl : "https://openrouter.ai/api/v1" , // 模型（默认为 perplexity/sonar-pro） model : "perplexity/sonar-pro" , } , } , } , } , } , } `环境变量替代方案： 在 Gateway 网关环境中设置 `OPENROUTER_API_KEY `或 `PERPLEXITY_API_KEY `。对于 Gateway 网关安装，将其放在 `~/.openclaw/.env `中。 如果未设置基础 URL，OpenClaw 会根据 API 密钥来源选择默认值： 
- `PERPLEXITY_API_KEY `或 `pplx-... `→ `https://api.perplexity.ai `

- `OPENROUTER_API_KEY `或 `sk-or-... `→ `https://openrouter.ai/api/v1 `

- 未知密钥格式 → OpenRouter（安全回退） 

### ​ 可用的 Perplexity 模型 
模型 描述 最适合 `perplexity/sonar `带网络搜索的快速问答 快速查询 `perplexity/sonar-pro `（默认） 带网络搜索的多步推理 复杂问题 `perplexity/sonar-reasoning-pro `思维链分析 深度研究 
## ​ web_search 
使用配置的提供商搜索网络。 
### ​ 要求 

- `tools.web.search.enabled `不能为 `false `（默认：启用） 

- 所选提供商的 API 密钥： 
- Brave ： `BRAVE_API_KEY `或 `plugins.entries.brave.config.webSearch.apiKey `

- Perplexity ： `OPENROUTER_API_KEY `、 `PERPLEXITY_API_KEY `或 `plugins.entries.perplexity.config.webSearch.apiKey `

### ​ 配置 
复制 `{ plugins : { entries : { brave : { config : { webSearch : { apiKey : "BRAVE_API_KEY_HERE" , } , } , } , } , } , tools : { web : { search : { enabled : true , maxResults : 5 , timeoutSeconds : 30 , cacheTtlMinutes : 15 , } , } , } , } `提供商专属的 web_search 配置现在统一放在 `plugins.entries.<plugin>.config.webSearch.* `。
旧的 `tools.web.search.* `提供商路径仅作为兼容层暂时保留，不应再用于新配置。 
### ​ 工具参数 

- `query `（必需） 

- `count `（1–10；默认来自配置） 

- `country `（可选）：用于特定地区结果的 2 字母国家代码（例如”DE”、“US”、“ALL”）。如果省略，Brave 选择其默认地区。 

- `search_lang `（可选）：搜索结果的 ISO 语言代码（例如”de”、“en”、“fr”） 

- `ui_lang `（可选）：UI 元素的 ISO 语言代码 

- `freshness `（可选，仅限 Brave）：按发现时间过滤（ `pd `、 `pw `、 `pm `、 `py `或 `YYYY-MM-DDtoYYYY-MM-DD `） 
示例： 复制 `// 德国特定搜索 await web_search ({ query : "TV online schauen" , count : 10 , country : "DE" , search_lang : "de" , }); // 带法语 UI 的法语搜索 await web_search ({ query : "actualités" , country : "FR" , search_lang : "fr" , ui_lang : "fr" , }); // 最近结果（过去一周） await web_search ({ query : "TMBG interview" , freshness : "pw" , }); `
## ​ web_fetch 
获取 URL 并提取可读内容。 
### ​ 要求 

- `tools.web.fetch.enabled `不能为 `false `（默认：启用） 

- 可选的 Firecrawl 回退：设置 `tools.web.fetch.firecrawl.apiKey `或 `FIRECRAWL_API_KEY `。 

### ​ 配置 
复制 `{ tools : { web : { fetch : { enabled : true , maxChars : 50000 , timeoutSeconds : 30 , cacheTtlMinutes : 15 , maxRedirects : 3 , userAgent : "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" , readability : true , firecrawl : { enabled : true , apiKey : "FIRECRAWL_API_KEY_HERE" , // 如果设置了 FIRECRAWL_API_KEY 则可选 baseUrl : "https://api.firecrawl.dev" , onlyMainContent : true , maxAgeMs : 86400000 , // 毫秒（1 天） timeoutSeconds : 60 , } , } , } , } , } `
### ​ 工具参数 

- `url `（必需，仅限 http/https） 

- `extractMode `（ `markdown `| `text `） 

- `maxChars `（截断长页面） 
注意： 
- `web_fetch `首先使用 Readability（主要内容提取），然后使用 Firecrawl（如果已配置）。如果两者都失败，工具返回错误。 

- Firecrawl 请求使用机器人规避模式并默认缓存结果。 

- `web_fetch `默认发送类 Chrome 的 User-Agent 和 `Accept-Language `；如需要可覆盖 `userAgent `。 

- `web_fetch `阻止私有/内部主机名并重新检查重定向（用 `maxRedirects `限制）。 

- `web_fetch `是尽力提取；某些网站需要浏览器工具。 

- 参见 Firecrawl 了解密钥设置和服务详情。 

- 响应会被缓存（默认 15 分钟）以减少重复获取。 

- 如果你使用工具配置文件/允许列表，添加 `web_search `/ `web_fetch `或 `group:web `。 

- 如果缺少 Brave 密钥， `web_search `返回一个简短的设置提示和文档链接。 
思考级别 浏览器（OpenClaw 托管） ⌘ I 技术支持 This documentation is built and hosted on Mintlify, a developer documentation platform
