创建 Skills - OpenClaw 跳转到主要内容 OpenClaw home page 简体中文 搜索... ⌘ K 
- GitHub 

- Releases 

- Discord 
搜索... Navigation 技能 创建 Skills 快速开始 安装 消息渠道 代理 工具 模型 平台 网关与运维 参考 帮助 
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
- 创建自定义 Skills 🛠 

- 什么是 Skill？ 

- 分步指南：你的第一个 Skill 

- 1. 创建目录 

- 2. 定义 SKILL.md 

- 3. 添加工具（可选） 

- 4. 刷新 OpenClaw 

- 最佳实践 

- 共享 Skills 
技能 
# 创建 Skills 

# ​ 创建自定义 Skills 🛠 
OpenClaw 被设计为易于扩展。“Skills”是为你的助手添加新功能的主要方式。 
## ​ 什么是 Skill？ 
Skill 是一个包含 `SKILL.md `文件（为 LLM 提供指令和工具定义）的目录，可选包含一些脚本或资源。 
## ​ 分步指南：你的第一个 Skill 

### ​ 1. 创建目录 
Skills 位于你的工作区中，通常是 `~/.openclaw/workspace/skills/ `。为你的 Skill 创建一个新文件夹： 复制 `mkdir -p ~/.openclaw/workspace/skills/hello-world `
### ​ 2. 定义 `SKILL.md `
在该目录中创建一个 `SKILL.md `文件。此文件使用 YAML frontmatter 作为元数据，使用 Markdown 作为指令。 复制 `--- name : hello_world description : A simple skill that says hello. --- # Hello World Skill When the user asks for a greeting, use the `echo` tool to say "Hello from your custom skill!". `
### ​ 3. 添加工具（可选） 
你可以在 frontmatter 中定义自定义工具，或指示智能体使用现有的系统工具（如 `bash `或 `browser `）。 
### ​ 4. 刷新 OpenClaw 
让你的智能体”刷新 skills”或重启 Gateway 网关。OpenClaw 将发现新目录并索引 `SKILL.md `。 
## ​ 最佳实践 

- 简洁明了 ：指示模型 做什么 ，而不是如何成为一个 AI。 

- 安全第一 ：如果你的 Skill 使用 `bash `，确保提示词不允许来自不受信任用户输入的任意命令注入。 

- 本地测试 ：使用 `openclaw agent --message "use my new skill" `进行测试。 

## ​ 共享 Skills 
你也可以在 ClawHub 上浏览和贡献 Skills。 多智能体沙箱与工具 斜杠命令 ⌘ I 技术支持 This documentation is built and hosted on Mintlify, a developer documentation platform
