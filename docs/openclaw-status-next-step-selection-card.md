# OpenClaw Status Next-Step Selection Card

## 结论

`openclaw status` 给出总览后，下一步不要机械地把所有 next steps 都展开；应该按**当前任务意图**选一个最能缩小不确定性的入口，避免把 status 后续动作做成默认全家桶。

## 选择顺序

优先问这三个问题：

1. **用户现在是在排障、维护，还是只是了解现状？**
2. **status 输出里哪一项最直接对应当前风险或疑问？**
3. **下一步动作能否显著减少不确定性，而不是只增加更多信息？**

## 默认映射

- **想知道系统大体是否健康** → `openclaw status` 已足够，先总结，不急着深钻。
- **担心 gateway / node 连通性** → 优先进入 gateway 或 node 相关下钻，而不是先看 update。
- **担心安全暴露** → 优先沿着 audit/security 的警告下钻。
- **只是看到 update available** → 先判断是否影响当前问题；若无关，不要让更新提示劫持排障路径。

## 边界

以下做法容易跑偏：

- 见到 status 输出后，默认把 update、audit、gateway、config 全查一遍
- 把 next steps 当作必须全部执行的清单
- 还没确认用户关心什么，就先做一轮全面深挖

## 实操口令

> `status` 之后只选一个最贴近当前意图、最能降不确定性的 next step；其余入口保留，不默认展开。

## 为什么

`openclaw status` 的价值在于快速定向，而不是制造新的信息洪水。真正好的 follow-up 是最小动作拿到最大判别力，而不是“既然列出来了就全跑”。
