Firecrawl - OpenClaw 跳转到主要内容 OpenClaw home page 简体中文 搜索... ⌘ K 
- GitHub 

- Releases 

- Discord 
搜索... Navigation 内置工具 Firecrawl 快速开始 安装 消息渠道 代理 工具 模型 平台 网关与运维 参考 帮助 
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
- Firecrawl 

- 获取 API 密钥 

- 配置 Firecrawl 

- 隐身 / 机器人规避 

- web_fetch 如何使用 Firecrawl 
内置工具 
# Firecrawl 

# ​ Firecrawl 
OpenClaw 可以使用 Firecrawl 作为 `web_fetch `的回退提取器。它是一个托管的
内容提取服务，支持机器人规避和缓存，有助于处理
JS 密集型网站或阻止普通 HTTP 请求的页面。 
## ​ 获取 API 密钥 

- 创建 Firecrawl 账户并生成 API 密钥。 

- 将其存储在配置中或在 Gateway 网关环境中设置 `FIRECRAWL_API_KEY `。 

## ​ 配置 Firecrawl 
复制 `{ tools : { web : { fetch : { firecrawl : { apiKey : "FIRECRAWL_API_KEY_HERE" , baseUrl : "https://api.firecrawl.dev" , onlyMainContent : true , maxAgeMs : 172800000 , timeoutSeconds : 60 , } , } , } , } , } `注意事项： 
- 当存在 API 密钥时， `firecrawl.enabled `默认为 true。 

- `maxAgeMs `控制缓存结果可以保留多久（毫秒）。默认为 2 天。 

## ​ 隐身 / 机器人规避 
Firecrawl 提供了一个用于机器人规避的 代理模式 参数（ `basic `、 `stealth `或 `auto `）。
OpenClaw 对 Firecrawl 请求始终使用 `proxy: "auto" `加 `storeInCache: true `。
如果省略 proxy，Firecrawl 默认使用 `auto `。 `auto `在基本尝试失败时会使用隐身代理重试，这可能比
仅使用基本抓取消耗更多积分。 
## ​ `web_fetch `如何使用 Firecrawl 
`web_fetch `提取顺序： 
- Readability（本地） 

- Firecrawl（如果已配置） 

- 基本 HTML 清理（最后回退） 
参见 Web 工具 了解完整的 Web 工具设置。 执行审批 LLM 任务 ⌘ I 技术支持 This documentation is built and hosted on Mintlify, a developer documentation platform
