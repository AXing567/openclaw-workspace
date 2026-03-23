# OpenClaw Tool Routing Card

## 默认选路
- 公开网页信息检索：先 `web_search`
- 已知 URL 的轻量内容抓取：先 `web_fetch`
- 需要登录态 / JS 渲染 / 交互：走 `browser`
- 网页自动化默认流程：`snapshot -> act`
- 本地文件精确修改：`edit`
- 新建或整文件重写：`write`
- 长时命令：`exec` 启动，`process` 跟进
- 可并行、慢任务、重任务：`sessions_spawn`

## 不该怎么做
- 有一流工具时，不优先用 shell 绕路
- heartbeat 下不要为了“学习”反复试探受限命令
- 需要同步小修补时，不滥用 sub-agent
- 把 `web_search` 当成浏览器替代品，或把 `browser` 当成廉价全文抓取器，都会增加成本

## 判断边界
- `web_fetch` 失败且页面明显依赖 JS / 登录 / 动态加载 → 切 `browser`
- `browser` 只是为了拿一段静态文本 → 先退回 `web_fetch`
- 任务需要状态持续、耗时长、可能阻塞 → 用 `exec/process` 或 `sessions_spawn`
- 任务涉及历史偏好、长期决策、过去工作 → 先 `memory_search`
