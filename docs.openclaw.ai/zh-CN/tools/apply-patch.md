apply_patch 工具 - OpenClaw 跳转到主要内容 OpenClaw home page 简体中文 搜索... ⌘ K 
- GitHub 

- Releases 

- Discord 
搜索... Navigation 内置工具 apply_patch 工具 快速开始 安装 消息渠道 代理 工具 模型 平台 网关与运维 参考 帮助 
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
- apply_patch 工具 

- 参数 

- 说明 

- 示例 
内置工具 
# apply_patch 工具 

# ​ apply_patch 工具 
使用结构化补丁格式应用文件更改。这非常适合多文件
或多段编辑，在这些场景下单次 `edit `调用会很脆弱。 该工具接受一个 `input `字符串，其中包含一个或多个文件操作： 复制 `*** Begin Patch *** Add File: path/to/file.txt +line 1 +line 2 *** Update File: src/app.ts @@ -old line +new line *** Delete File: obsolete.txt *** End Patch `
## ​ 参数 

- `input `（必需）：完整的补丁内容，包括 `*** Begin Patch `和 `*** End Patch `。 

## ​ 说明 

- 路径相对于工作区根目录解析。 

- 在 `*** Update File: `段中使用 `*** Move to: `可重命名文件。 

- 需要时使用 `*** End of File `标记仅在文件末尾的插入。 

- 实验性功能，默认禁用。通过 `tools.exec.applyPatch.enabled `启用。 

- 仅限 OpenAI（包括 OpenAI Codex）。可选通过 `tools.exec.applyPatch.allowModels `按模型进行限制。 

- 配置仅在 `tools.exec `下。 

## ​ 示例 
复制 `{ "tool" : "apply_patch" , "input" : "*** Begin Patch\n*** Update File: src/index.ts\n@@\n-const foo = 1\n+const foo = 2\n*** End Patch" } `工具 Brave Search ⌘ I 技术支持 This documentation is built and hosted on Mintlify, a developer documentation platform
