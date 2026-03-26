# OpenClaw Status Output Scope Card

## 结论

`openclaw status` 适合作为第一跳真实快照，但它回答的是“当前整体状态概览”，不是“所有异常细节都在这里”。看到 status 正常，只能说明基础运行态大致通；要继续排具体问题，还得按输出提示往下钻。

## 这条卡为什么值得补

仅仅记住“先跑 `openclaw status`”还不够，下一步常见误判是：

- 看到 status 正常，就误以为具体工具、频道、节点一定没问题
- 看到 status 里出现 update available 或 next steps，就忽略这些其实是天然的下钻入口
- 把 status 当成最终答案，而不是总览导航页

所以更实用的经验不是“先看 status”本身，而是“看完 status 后，知道它的回答边界”。

## status 通常能回答什么

- 当前主会话/代理是否活着
- 模型、上下文占用、缓存比例等总览信息
- 是否存在更新提示
- 下一跳排查入口，如 `openclaw status --all`、`openclaw logs --follow`、`openclaw status --deep`

## status 不能替代什么

- 不能替代具体工具级诊断
- 不能替代频道/节点/权限的细粒度排查
- 不能证明“所有功能都正常”
- 不能替代对异常现场的日志追踪

## 默认读法

1. 先看 status 是否能给出整体健康信号
2. 再看它显式给的 next steps，这些往往就是官方建议的下钻路径
3. 若只是做知识沉淀，优先总结“总览层 vs 细查层”的边界，而不是继续围绕 heartbeat 节奏打转

## 实操口令

> `openclaw status` 是总览页，不是终局页；先用它定层级，再按输出给的 next steps 往下钻。
