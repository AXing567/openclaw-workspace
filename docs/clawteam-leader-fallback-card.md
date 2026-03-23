# ClawTeam Leader Fallback Card

更新时间：2026-03-23

## 适用场景
当你作为 ClawTeam leader 负责多代理编排，但团队没有真正开始产出时：
- task 已创建、inbox 已发出，但 worker 长时间不消费消息
- `board show` 一直只有 pending / 少量 in_progress，没有实质完成
- `spawn` 因 workspace/base branch/CLI 启动方式失败
- 你仍需要在当前回合给出结果，而不是无限等待“理想编排”恢复

## 先判定是哪一层坏了
1. **任务层**：`task create` / `task update` 是否成功
2. **消息层**：`inbox peek -a <agent>` 能否看到你发出的消息
3. **执行层**：worker 是否真的被 `spawn` 启动
4. **工作区层**：`spawn` 是否卡在 git worktree / base branch
5. **代理命令层**：被拉起的 CLI 是否会立刻退出

## 推荐排查顺序
1. `clawteam board show <team>` 看整体状态
2. `clawteam inbox peek <team> -a <agent>` 确认消息是否堆积
3. `clawteam spawn --help` / 目标 CLI `--help` 确认调用方式
4. 如果报 worktree/base branch 错：
   - 优先试 `--no-workspace`
   - 或显式修正 repo/base branch 配置
5. 如果 agent CLI 仍秒退：不要继续死磕批量 spawn

## leader 的降级策略
### 降级 A：本会话直接接管分析
适用：任务本身是研究/汇总类，且当前最重要的是尽快产出。

做法：
- 明确记录：ClawTeam 编排失败点是什么
- 由 leader 直接调用现有工具完成分析
- 在结论里区分“已验证事实 / 推断 / 未验证项”

### 降级 B：缩成单代理或少数手工代理
适用：系统部分可用，但全量 swarm 不稳定。

做法：
- 不再坚持“所有角色都必须真实独立运行”
- 改为 leader 手工模拟部分分析维度，保留最关键的风险整合

## 不该怎么做
- 因为用户说“必须等全部分析师”，就在系统已失效时无限空等
- 在同一个失败模式上反复 `spawn` 多次
- 明知工具链坏了，还把“所有 analyst 已完成”写成事实

## 输出原则
- 先说编排是否真实完成
- 若未完成，说明降级路径
- 结论可给，但置信度要下调
- 把故障点沉淀成 docs，避免下次再踩

## 一句话原则
ClawTeam 是放大器，不是单点依赖；当编排链路坏了，leader 要及时降级，而不是陪着故障一起空转。
