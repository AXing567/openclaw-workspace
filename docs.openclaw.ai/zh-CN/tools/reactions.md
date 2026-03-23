表情回应 - OpenClaw 跳转到主要内容 OpenClaw home page 简体中文 搜索... ⌘ K 
- GitHub 

- Releases 

- Discord 
搜索... Navigation 内置工具 表情回应 快速开始 安装 消息渠道 代理 工具 模型 平台 网关与运维 参考 帮助 
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
- 表情回应工具 
内置工具 
# 表情回应 

# ​ 表情回应工具 
跨渠道共享的表情回应语义： 
- 添加表情回应时， `emoji `为必填项。 

- `emoji="" `在支持的情况下移除机器人的表情回应。 

- `remove: true `在支持的情况下移除指定的表情（需要提供 `emoji `）。 
渠道说明： 
- Discord/Slack ：空 `emoji `移除机器人在该消息上的所有表情回应； `remove: true `仅移除指定的表情。 

- Google Chat ：空 `emoji `移除应用在该消息上的表情回应； `remove: true `仅移除指定的表情。 

- Telegram ：空 `emoji `移除机器人的表情回应； `remove: true `同样移除表情回应，但工具验证仍要求 `emoji `为非空值。 

- WhatsApp ：空 `emoji `移除机器人的表情回应； `remove: true `映射为空 emoji（仍需提供 `emoji `）。 

- Signal ：当启用 `channels.signal.reactionNotifications `时，收到的表情回应通知会触发系统事件。 
Perplexity Sonar 思考级别 ⌘ I 技术支持 This documentation is built and hosted on Mintlify, a developer documentation platform
