浏览器登录 - OpenClaw 跳转到主要内容 OpenClaw home page 简体中文 搜索... ⌘ K 
- GitHub 

- Releases 

- Discord 
搜索... Navigation 浏览器 浏览器登录 快速开始 安装 消息渠道 代理 工具 模型 平台 网关与运维 参考 帮助 
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
- 浏览器登录 + X/Twitter 发帖 

- 手动登录（推荐） 

- 使用哪个 Chrome 配置文件？ 

- X/Twitter：推荐流程 

- 沙箱隔离 + 主机浏览器访问 
浏览器 
# 浏览器登录 

# ​ 浏览器登录 + X/Twitter 发帖 

## ​ 手动登录（推荐） 
当网站需要登录时，请在 主机 浏览器配置文件（openclaw 浏览器）中 手动登录 。 不要 将你的凭证提供给模型。自动登录通常会触发反机器人防御并可能锁定账户。 返回主浏览器文档： 浏览器 。 
## ​ 使用哪个 Chrome 配置文件？ 
OpenClaw 控制一个 专用的 Chrome 配置文件 （名为 `openclaw `，橙色调 UI）。这与你的日常浏览器配置文件是分开的。 两种简单的访问方式： 
- 让智能体打开浏览器 ，然后你自己登录。 

- 通过 CLI 打开 ： 
复制 `openclaw browser start openclaw browser open https://x.com `如果你有多个配置文件，传入 `--browser-profile <name> `（默认是 `openclaw `）。 
## ​ X/Twitter：推荐流程 

- 阅读/搜索/话题： 使用 bird CLI Skills（无浏览器，稳定）。 
- 仓库： https://github.com/steipete/bird 

- 发布更新： 使用 主机 浏览器（手动登录）。 

## ​ 沙箱隔离 + 主机浏览器访问 
沙箱隔离的浏览器会话 更容易 触发机器人检测。对于 X/Twitter（和其他严格的网站），优先使用 主机 浏览器。 如果智能体在沙箱中，浏览器工具默认使用沙箱。要允许主机控制： 复制 `{ agents : { defaults : { sandbox : { mode : "non-main" , browser : { allowHostControl : true , } , } , } , } , } `然后定位主机浏览器： 复制 `openclaw browser open https://x.com --browser-profile openclaw --target host `或者为发布更新的智能体禁用沙箱隔离。 浏览器（OpenClaw 托管） 浏览器故障排除 ⌘ I 技术支持 This documentation is built and hosted on Mintlify, a developer documentation platform
