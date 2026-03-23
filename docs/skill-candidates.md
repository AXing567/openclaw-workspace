# 高频 Skills 候选清单

更新时间：2026-03-20

## 目标
识别最值得固化为 Skills 的高频任务，把“临场发挥”变成“稳定流程”。

## P0：优先做

### 1. official-doc-learning
用途：
- 学官方文档
- 扫描章节结构
- 提炼关键知识
- 写本地知识沉淀
- 只把长期原则写进长期记忆

为什么优先：
- 当前你已经明确要求我系统学习 OpenClaw 文档
- 这是正在重复发生的任务类型

应固化的流程：
1. 识别文档范围
2. 抓取/阅读核心章节
3. 区分“专题知识”与“长期原则”
4. 写入 `docs/` 笔记
5. 仅将稳定原则写入长期记忆
6. 汇报已完成章节与后续计划

### 2. memory-maintenance
用途：
- 清理 MEMORY.md
- 合并重复原则
- 把事件型信息下沉
- 维护 daily memory / docs / long-term memory 的边界

为什么优先：
- 这是当前“提高 OpenClaw 智商”任务的核心
- 如果这个 skill 没有，长期记忆会持续长歪

应固化的流程：
1. 读取 MEMORY.md 与近两天 daily memory
2. 判断哪些该保留 / 改写 / 下沉
3. 把事件型信息迁到 daily 或 docs
4. 把长期记忆压成短、稳、可复用原则
5. 输出变更摘要

### 3. long-task-supervision
用途：
- 对长任务做有效监督与状态回报
- 防止黑盒推进和复读式汇报

为什么优先：
- 你已经明确表达对这类问题高度敏感
- 这是协作体验的关键能力

应固化的流程：
1. 定义任务目标、阶段、阻塞标准
2. 区分真实进展与口头承诺
3. 识别无变化、卡住、外部阻塞
4. 回报关键变化，不复读无变化状态
5. 要求有可见沉淀

## P1：第二批

### 4. public-web-research
用途：
- 公开网页调研
- 结构分析
- 浏览器观察
- 轻量抓取与复杂页面攻坚选路

为什么重要：
- 你这边明显会持续有网页相关任务

核心规则：
- 先判断 `web_*` 还是 `browser`
- 先判断环境问题 / 目标站问题 / 风控问题
- 输出结构化结论

### 5. reminder-cron-setup
用途：
- 设置提醒
- 创建定时任务
- 规范生成 cron payload

为什么重要：
- 这是高频事务型任务
- 规则明确，适合 skill 化

### 6. workspace-project-check
用途：
- 心跳时巡检项目状态
- 查看 git 状态、关键文档、待整理内容
- 识别可主动推进的内部事项

## P2：后续再做

### 7. openclaw-config-diagnosis
用途：
- 配置排障
- 工具权限排障
- session / gateway / skills / plugin 路由问题排障

### 8. skill-authoring
用途：
- 创建新 Skills
- 审核现有 Skills 质量
- 按 AgentSkills / OpenClaw 约束整理 skill 目录

## 当前建议
如果接下来只做 2-3 个最值钱的 Skills，优先顺序应是：
1. `official-doc-learning`
2. `memory-maintenance`
3. `long-task-supervision`
