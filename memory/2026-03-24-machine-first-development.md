# Session: 2026-03-24 08:41:46 UTC

- **Session Key**: agent:main:telegram:direct:7709890198
- **Session ID**: 1cbc1c31-0760-4100-ae70-3858e5a3ad10
- **Source**: telegram

## Conversation Summary

assistant: [[reply_to_current]] 这套思路整体是对的，而且方向挺先进：**把产品开发从“人类读得懂”改成“机器能稳定消费”**，这对 AI 参与 PRD→接口→页面→测试的流水线非常有帮助。  
但如果你真的按这份文档“一步步照做”，我判断**会有两个风险**：**前期建模成本偏高**，以及**过早追求全链路完备，容易把项目推进速度拖慢**。

我直接说结论：

## 总评
这份步骤适合：
- **业务规则复杂**
- **跨前后端/QA协作多**
- **希望 AI 深度参与开发**
- **希望需求、接口、测试能强绑定追溯**

但不太适合：
- **早期探索型产品**
- **需求还在频繁变**
- **团队人数少、沟通成本本来就低**
- **还没沉淀出稳定 feature 边界**

如果你现在是 **0→1 或 方向还在试**，我不建议完整照搬。  
我建议你把它改成：**“轻量版机器优先开发流程”**。

---

# 这份流程的优点

## 1. 单一真相源这个原则是对的
这是整份文档最有价值的部分。

一旦你让：
- PRD 一套说法
- API 文档一套说法
- 页面稿一套说法
- 测试 case 一套说法

AI 就会开始乱补。  
所以“**结构化源文件优先**”这个原则非常对，尤其适合后面接自动生成、代码代理、测试代理。

---

## 2. `feature_id` 贯穿全链路，非常值得保留
这个设计很强。

因为你后面可以很容易做到：
- PRD → API 的映射
- API → 页面行为的映射
- 页面 → 测试用例的映射
- 某个改动影响了哪些 feature

这是以后做：
- 自动影响分析
- 自动补测试
- 自动回归
- AI 按 feature 精准实现

的基础。

**这一条建议原样保留。**

---

## 3. `open_questions` 显式化，很实用
这比让 AI 或开发“脑补需求”强太多了。

尤其你写了：
- owner
- blocks_automation

这能让流程很清楚地区分：
- 现在就能继续做
- 还是必须停下来等确认

这点是工程化意识，不是形式主义。

---

## 4. PRD / API / QA 都用结构化格式，利于自动化
这点也是对的。  
因为真正要让 AI 稳定产出，靠自然语言段落不够，必须有：
- 明确字段
- 明确枚举
- 明确输入输出
- 明确可追踪 id

否则 agent 很容易“看起来懂了，实际上每轮都理解不一样”。

---

# 这份流程的问题

## 1. 最大问题：太重，容易把项目拖进“文档工程”
你现在这个链路是：

术语 → PRD → 数据模型 → API → 架构 → 页面状态机 → 组件契约 → 代码规范 → QA

这个顺序对“成熟中大型项目”没问题。  
但对普通产品开发来说，**太完整了**。

现实里最容易发生的是：

- feature 还没验证，就开始补 pages.yaml
- 页面还没稳定，就开始写 components.yaml
- API 还没真正打出来，就已经写了一堆 acceptance/cases
- 最后不是在开发产品，而是在维护 docs/machine

**也就是说，这份方法论最大风险不是写不出来，而是写得太漂亮，结果速度没了。**

---

## 2. “不要跳步”这个要求太绝对
文档里写“不要跳步”，我不认同这么绝对。

真实开发里经常是：
- 先快速做一个 API 原型
- 再倒逼 PRD logic 补全
- 先做一个页面交互草稿
- 再回填页面状态机
- 先做数据结构，再发现 feature 边界要重拆

所以更合理的表达应该是：

> **核心契约不能缺，但阶段可以回填，不必机械串行。**

否则你会把开发流程搞成瀑布，而不是 AI 协同开发。

---

## 3. 页面状态机、组件契约这两层，对很多项目来说过早
这两层不是没用，而是**只有在 UI 复杂度够高时才值回票价**。

比如：
- 后台管理系统
- 多状态任务中心
- 审批流、运营流、配置流
- 有复杂 loading/error/empty/partial states

这种场景页面状态机很值。

但如果只是：
- 表单页
- 列表页
- 简单 CRUD 页
- 落地页
- 轻交互 SaaS

你可能只需要：
- 页面清单
- 接口映射
- 权限说明
- 关键异常态

没必要先上完整状态机 DSL。

组件契约也是一样。  
如果还没形成稳定设计系统，先写 `components.yaml` 很容易变成无效劳动。

---

## 4. 缺少“探索态 / 原型态 / 生产态”的分层
这是我觉得最该补的一点。

你这份文档默认所有功能都走同一套重流程。  
但实际上功能应该分层：

### A. 探索态
目标：验证方向  
需要：
- feature 简述
- open_questions
- 粗略输入输出
- 原型或伪接口

### B. 实现态
目标：稳定落地  
需要：
- 完整 logic
- API
- 数据模型
- 验收标准

### C. 生产态
目标：长期维护、可回归  
需要：
- QA cases
- 页面状态定义
- 监控/日志/审计
- 变更记录

**不是所有 feature 一上来都值得进生产态模板。**

---

## 5. 缺少“变更成本控制”机制
你文档里强调版本号，但还缺一个更关键的东西：

> 当 `feature_id` 的 logic 改了，哪些文件必须同步变更？

建议加一个规则，比如：

- PRD logic 变更 → 必查 API / data_model / qa
- API schema 变更 → 必查 ui / mock / tests
- 页面状态变更 → 必查 components / e2e / acceptance

否则虽然你说了“单一真相源”，但**实际维护时还是会漂移**。

---

## 6. 缺少“最小可落地模板”
这文档定义得很全，但对真正开始做的人不够友好。

你现在给的是“完整体系”，不是“最小启动包”。  
实际落地时最需要的是：

### 第一天只建这几个文件
- `glossary.yaml`
- `prd/index.yaml`
- `prd/features/F-xx.yaml`
- `api/openapi.yaml`
- `qa/acceptance.yaml`

其他先不建，按需补。

如果没有这个“最小集”，团队很容易一开始就被框架压住。

---

# 我建议怎么优化

## 方案：改成“三层流程”

---

## 第一层：必做层（所有项目都做）
这是最值得保留的骨架。

### 1. glossary.yaml
保留，但只收真正高频、易歧义术语。  
别把所有词都塞进去。

### 2. prd/index.yaml + features/*.yaml
这是核心。  
PRD 结构化是全流程基础。

### 3. open_questions 强制化
必须保留。  
AI 最怕模糊需求下自动脑补。

### 4. API 契约
无论前后端是否分离，只要有数据交互，就建议保留。

### 5. acceptance.yaml
这个也建议早建。  
验收标准不清，AI 和人都会乱跑。

---

## 第二层：按复杂度启用
不是默认全部启用。

### 6. entities.yaml
当存在：
- 多实体关系
- 主键/索引复杂
- 要生成 ORM / migration / mock

再加。

### 7. architecture/system.yaml
当项目开始出现：
- 多服务
- 异步任务
- 数据流转复杂
- 第三方依赖多

再加。

### 8. ui/pages.yaml
当 UI 是多状态、多动作、多角色时再加。  
简单页面别硬建状态机。

---

## 第三层：成熟期补强
适合产品进入稳定交付后再上。

### 9. components.yaml
等设计系统或组件库稳定后再做。

### 10. qa/cases/*.yaml
等关键 feature 稳定后补齐。  
早期只保留 acceptance 就够了。

### 11. code_rules.yaml
如果仓库本身已有 ESLint / TS / Prettier / CI，  
这份规则文件可以简化成“补充机器约束”，不必重复一遍常识。

---

# 我建议你把“执行顺序”改成下面这样

## 轻量版顺序
1. **术语**
2. **Feature PRD**
3. **开放问题清单**
4. **验收标准**
5. **API 契约**
6. **实现代码**
7. **视复杂度补：数据模型 / 架构 / 页面状态机 / 测试用例 / 组件契约**

这会比原版更实战。

---

# 还可以补两块你现在缺的内容

## 1. 增加 feature 生命周期字段
建议在 feature YAML 里加：

```yaml
status: discovery | scoped | in_delivery | released | deprecated
```

这样你就知道这个 feature 目前处于：
- 探索
- 已定义范围
- 开发中
- 已上线
- 已废弃

这对 AI 决定“该不该补全文档深度”很重要。

---

## 2. 增加实施边界字段
比如：

```yaml
automation_level: advisory | partial | full
```

或者：

```yaml
implementation_mode: prototype | production
```

因为很多需求其实只是先做原型，不需要一次把测试、组件契约、状态机全铺满。

---

# 如果你问我：能不能按这个步骤一步步开发？

我的答案是：

**能，但不要原样照搬。**

更准确地说：

- **这是一套很好的“目标态开发规范”**
- **不是最适合今天就完整执行的“起步流程”**

如果你现在直接全量执行，大概率会出现：
- 文档产出很多
- 真正编码变慢
- feature 频繁变化导致 YAML 大量返工
- 团队疲于维护结构化文件

---

# 我的最终建议

## 如果你现在是早期项目
用这个精简版：

### 必须有
- `glossary.yaml`
- `prd/index.yaml`
- `prd/features/*.yaml`
- `open_questions`
- `acceptance.yaml`
- `openapi.yaml`

### 暂时不要强制
- `system.yaml`
- `pages.yaml`
- `components.yaml`
- 全量 `cases/*.yaml`

等某个 feature 稳定、复杂、多人协作时再补。

---

## 如果你现在是中后期项目
可以逐步上这整套，但要加一句原则：

> **文档深度跟随 feature 成熟度，不要求所有 feature 一次性达到同等结构化程度。**

这句话很重要，不然流程会过载。

---

如果你愿意，我下一步可以直接帮你做两件更实用的事之一：

1. **把这份文档改写成一个“更适合真实落地的轻量版 v2”**  
2. **按这个方法，给你做一套最小可用模板目录 + 示例 YAML 文件**

你选一个，我直接给你产出。
user: Conversation info (untrusted metadata):
```json
{
  "message_id": "1211",
  "sender_id": "7709890198",
  "sender": "阿星",
  "timestamp": "Tue 2026-03-24 16:06 GMT+8"
}
```

Sender (untrusted metadata):
```json
{
  "label": "阿星 (7709890198)",
  "id": "7709890198",
  "name": "阿星"
}
```

因为我是ai开发嘛，全都交给ai，比如GPT5.4，opus4.6这样的顶尖大模型
我又想要人工介入很少，ai做事情的时候我这时候做别的
然后文档写完之后，ai开发也比较稳定，我也算是为了开发出程序后尽可能的减少人工debug吧，嫌麻烦，也不爱干，哈哈
所以才想的这个办法
你从这个角度看感觉怎么样？
assistant: [[reply_to_current]] 从你这个目标看，**方向是对的，而且比普通团队更需要这套东西**。  
你不是在写“产品文档”，你其实是在给顶尖模型搭**护栏 + 坐标系 + 交接协议**，目的是：**少盯、少返工、少 debug、让 AI 能自己稳定往前跑**。这个思路我认同。

但我会把结论说得更准一点：

## 结论
**你的思路不是错，甚至很适合 AI-first 开发。**  
不过你现在这份流程还差最后一步升级：

> 它现在更像“完整的软件工程文档体系”，  
> 你真正需要的是“专门为大模型连续执行而设计的机器执行规范”。

也就是说，方向对，但还可以更**偏 agent 化**、更**偏自动实现**、更**偏低监督运行**。

---

# 为什么这套思路适合你

你想要的是：

- 文档先写清
- AI 自己干活
- 你少盯过程
- 少来回解释
- 少 debug
- 尽量一次做对
- 你可以去做别的，回来只看结果

那核心问题就不是“文档规范不规范”，而是：

> **怎么把需求表达成让强模型持续多轮执行时不容易跑偏的格式。**

从这个角度，你这个方案非常合理，因为它本质上在解决 4 个大问题：

---

## 1. 解决“模型每轮理解都不一样”
再强的模型，只要输入是散乱自然语言，就容易出现：

- 这轮理解 A
- 下轮理解成 A'
- 第三轮顺手补了你没要的 B

结构化 PRD / API / acceptance 的价值就在这里：

### 它不是为了好看
而是为了让模型每次进入任务时都看到同一套约束。

这对 GPT-5.4、Opus 4.6 这种强模型尤其重要——  
它们不是不聪明，恰恰是因为太会“合理发挥”，所以更需要边界。

---

## 2. 解决“你不在场时 AI 容易私自补逻辑”
你最怕的其实不是模型写不出代码，  
而是你去忙别的时，它：

- 自己补了个业务规则
- 自己发明了一个边界行为
- 自己改了接口结构
- 自己做了“看起来更优雅”的重构

最后代码跑了，但业务错了。  
这类错误最烦，因为要靠人工 debug + 业务回溯才能抓出来。

你文档里的这些设计正好是克这个问题的：

- `open_questions`
- `blocks_automation`
- `feature_id`
- logic 必须可判定
- API 禁止新增 PRD 没有的分支
- acceptance 可追溯

这套约束非常适合“**我不盯着，AI 自己干**”的开发模式。

---

## 3. 解决“debug 成本高于前期建模成本”
你已经说得很直白了：**你嫌 debug 麻烦，也不爱干。**

这就意味着你的最优策略不是“快速写出来再修”，而是：

> **前面多花点力气把错路堵死，后面少排查。**

这跟很多人不一样。  
很多人是：
- 先糊出来
- 再靠人工调

但你明显更适合：
- 先把规则结构化
- 再让 AI 按规则产出
- 尽量把错误前移到文档阶段

如果你的主要开发者是 AI，这个策略比“先写再改”更划算。

---

## 4. 解决“多模型切换协作的稳定性”
你提到 GPT-5.4、Opus 4.6。  
这就意味着未来可能是：

- 一个模型写 PRD
- 一个模型写接口
- 一个模型写前端
- 一个模型补测试
- 或者同一 feature 在不同模型之间切换

这时候如果没有统一的机器约束层，就会出现：
- 命名不统一
- 类型漂移
- 页面理解和接口理解不一致
- 验收口径变来变去

所以你这套结构化文件，本质上是**跨模型的中间协议层**。  
这个是很有价值的。

---

# 但你还没完全对准“AI 自驱开发”这个目标

你现在这份文档更像是：

> “人类工程团队也能接受的一套完备规范”

而不是：

> “专门为了让大模型低监督连续执行的最优协议”

这两者有重合，但不完全一样。

如果从“AI 尽量自己做，人工尽量少介入”出发，我会建议你重点再补 5 个东西。

---

# 你最该补的 5 个点

## 1. 增加“任务切片单位”
现在你是按 feature_id 管。这个对，但还不够。

因为一个 feature 可能还是太大，模型执行时容易出现：
- 一次改太多文件
- 上下文过长
- 一轮实现不完整
- 改动范围失控

建议你在 feature 下面再加一个执行层级，比如：

```yaml
delivery_units:
  - unit_id: U-F01-01
    goal: 建立主键标准化纯函数与单测
    inputs: [sid, asin, seller_sku, local_sku]
    outputs: [canonical_sku_key]
    touches:
      - src/domain/sku/*
      - tests/domain/sku/*
    done_when:
      - 单测通过
      - 无新增 any
      - 不修改 API 层
```

### 这很重要
因为 agent 真正执行时，需要的不是“理解完整 feature”，而是：

> **这一轮具体改什么、不能碰什么、什么算做完。**

没有这个层，强模型还是容易过度发挥。

---

## 2. 增加“禁止越界修改”的硬边界
你有一句：

> 仅实现当前 feature_id / operationId / page_id 范围内需求；禁止顺带重构无关模块。

这句对，但还不够可执行。

建议改成结构化字段，例如：

```yaml
implementation_constraints:
  allowed_paths:
    - src/modules/review/**
    - src/api/review.ts
  forbidden_paths:
    - src/shared/theme/**
    - src/legacy/**
  forbidden_actions:
    - 重命名公共类型
    - 修改全局 ESLint 配置
    - 引入新基础依赖
```

因为对 agent 来说，**“不要乱动”最好不要只写在自然语言里**。  
写成结构化限制，它更容易稳定遵守。

---

## 3. 增加“完成定义（Definition of Done）”
你现在有 acceptance，但还缺“交付完成判据”。

acceptance 更偏业务验证；  
DoD 更偏执行收口。

建议每个 feature 或 delivery unit 加：

```yaml
done_definition:
  - 代码已实现
  - 单元测试通过
  - 类型检查通过
  - 关联契约文件已同步
  - 无 open_questions.blocks_automation = true
  - 变更文件列表已输出
```

这能显著减少“AI 说做完了，其实只写了一半”的情况。

---

## 4. 增加“回归影响声明”
你最讨厌 debug，那就该让 AI 在每次改动时**主动声明影响面**。

建议要求每个任务输出：

```yaml
change_impact:
  affects_feature_ids: [F-01, F-03]
  affects_api: true
  affects_db: false
  affects_ui: false
  requires_migration: false
  requires_regression_cases:
    - AC-01
    - AC-03
```

这东西很值钱。  
因为很多 bug 不是“不会写”，而是“改了 A，炸了 B”。

如果 AI 每次都被迫显式说明影响范围，后期人工排查成本会低很多。

---

## 5. 增加“失败时停机条件”
这是你这种低监督开发里最重要、但文档里还没写透的一块。

因为 AI 自主开发最怕的不是偶尔失败，  
而是**失败了还继续编**。

建议加一条全局规则：

### 遇到以下情况必须停止实现，只能输出阻塞报告
- `open_questions` 中存在 `blocks_automation: true`
- 发现 PRD logic 与 API schema 冲突
- 发现多个 feature 对同一字段定义不一致
- 缺少目标文件或项目结构与约定不符
- 需要新增业务分支但 PRD 未定义
- 测试失败且失败原因无法在当前 feature 范围内收敛

这条会大幅降低“错误被连续放大”的概率。

---

# 从你的目标出发，我会怎么改造这套方法

我不会把它叫“产品开发步骤”了。  
我会把它升级成：

## 《AI 自驱开发协议》
或者
## 《Agent-First Delivery Spec》

因为你真正要的不是“文档规范”，而是：

> **让大模型可以像外包高级工程师一样，拿着契约自己干活，并且尽量少把锅甩给你。**

---

# 适合你的版本，应该长这样

## 核心层：必须有
这些是你这种开发方式最值回票价的。

- `glossary.yaml`
- `prd/index.yaml`
- `prd/features/*.yaml`
- `api/openapi.yaml`
- `qa/acceptance.yaml`

再加上下面几个你原文里还不够强的：

- `delivery_units`
- `implementation_constraints`
- `done_definition`
- `change_impact`
- `stop_conditions`

---

## 增强层：复杂项目再上
- `data_model/entities.yaml`
- `architecture/system.yaml`
- `ui/pages.yaml`

---

## 成熟层：后期补
- `ui/components.yaml`
- `qa/cases/*.yaml`
- `engineering/code_rules.yaml`

---

# 你真正应该追求的，不是“文档越全越好”
而是：

## 文档要满足这 4 个目标
### 1. AI 能稳定理解
不是这轮懂、下轮变。

### 2. AI 能独立执行
你去干别的，它还能推进。

### 3. AI 不敢乱补
不清楚就停，不是胡编。

### 4. 改动可追溯、可回归
出问题时能迅速定位，不用人工满场找。

如果一份文档不能显著提升这四点，再完整也可能只是漂亮的负担。

---

# 所以从你的角度，我的最终判断是

**这条路值得走，而且比普通团队更适合你。**  
因为你本来就不是想“高频亲自盯开发”，你是想把自己从重复沟通、来回 debug、反复解释中解放出来。

但要注意：

> **你不是在优化“文档写法”，你是在设计“AI 的施工协议”。**

一旦用这个视角去改，你这套东西会更狠、更实用。

---

如果你要，我下一步可以直接帮你做这两个里最有用的一个：

1. **把你这份文档改写成《AI 自驱开发协议 v2》**，专门服务 GPT-5.4 / Opus 4.6 这类模型低监督执行  
2. **直接给你产出一套最小可用模板**：feature YAML、acceptance YAML、delivery unit YAML、stop conditions 模板，拿来就能喂给 AI

我建议你选 **1**，我先把方法论升级；然后再顺手给你 **2**。
user: Conversation info (untrusted metadata):
```json
{
  "message_id": "1216",
  "sender_id": "7709890198",
  "sender": "阿星",
  "timestamp": "Tue 2026-03-24 16:10 GMT+8"
}
```

Sender (untrusted metadata):
```json
{
  "label": "阿星 (7709890198)",
  "id": "7709890198",
  "name": "阿星"
}
```

行，方法论升级一下吧
assistant: [[reply_to_current]] 行。我直接给你一个 **更适合“顶级大模型低监督连续开发”** 的升级版，不再把重点放在“文档齐全”，而是放在 **AI 能稳定施工、少打扰你、少返工、少 debug**。

你原来的版本我不推翻，核心思想保留，但我会把它重构成一份更像“施工协议”的东西。

---

# AI 自驱开发协议 v2
**目标：让 GPT-5.4 / Opus 4.6 这类强模型在低人工介入下，稳定完成从需求到实现到验证的连续交付。**

---

## 0. 协议定位

这不是传统 PRD 规范，也不是单纯的工程文档模板。  
它是一套 **给 AI 代理看的执行协议**，核心目的是：

- 让 AI **少脑补**
- 让 AI **少越界**
- 让 AI **遇到不清楚时停下**
- 让 AI **一次改动尽量闭环**
- 让人类只在高价值节点介入

### 优先目标
1. **稳定执行**
2. **低监督推进**
3. **减少返工**
4. **减少人工 debug**
5. **跨模型协作一致**

---

# 1. 核心原则

## 1.1 单一机器真相源
所有业务规则、接口约束、验收标准，以 `docs/machine/` 下结构化文件为准。  
自然语言说明、聊天记录、README 仅作辅助解释，不得覆盖结构化定义。

---

## 1.2 AI 只能在显式边界内工作
AI 只允许：
- 实现已声明的 `feature_id`
- 修改允许的文件范围
- 生成在契约中可追溯的代码与测试

AI 不允许：
- 脑补缺失规则
- 顺手重构无关模块
- 擅自引入新业务分支
- 用“更优雅”为理由改写契约外内容

---

## 1.3 不清楚就停，不允许“合理发挥”
遇到以下情况，AI 必须停止实现，只输出阻塞报告：
- 关键 `open_questions` 未决
- PRD 与 API / 数据模型冲突
- 输入字段定义不一致
- 需要新增业务分支但契约未定义
- 任务范围无法定位到具体文件或模块
- 当前测试失败且失败原因超出本任务边界

---

## 1.4 文档深度服从 feature 成熟度
不是所有功能都要一上来写满全套文档。  
结构化程度应随 feature 状态增加：

- `discovery`：只定义边界与待定问题
- `scoped`：定义规则、验收与接口
- `delivery`：补齐实现约束与回归要求
- `released`：补齐测试、影响面、变更记录

---

## 1.5 一次交付必须是“最小闭环”
AI 每一轮交付应该是一个可以验证的最小闭环，而不是“改了一半，剩下以后再说”。

闭环至少包含：
- 明确目标
- 明确改动范围
- 明确完成条件
- 明确验证方法

---

# 2. 协议层级

建议将协议分为三层：

## A. 核心契约层（必须有）
这些文件是 AI 开发的基础护栏。

- `glossary.yaml`
- `prd/index.yaml`
- `prd/features/*.yaml`
- `qa/acceptance.yaml`
- `api/openapi.yaml`（如涉及接口）

---

## B. 执行控制层（强烈建议）
这些是为了让 AI 能低监督稳定执行，不是传统 PRD 必备，但对你最有价值。

- `delivery_units/*.yaml`
- `implementation_constraints.yaml` 或写入 feature 内
- `stop_conditions.yaml`
- `change_impact.yaml`（可按任务输出，不一定长期存）

---

## C. 复杂度增强层（按需启用）
只有在项目复杂时才上。

- `data_model/entities.yaml`
- `architecture/system.yaml`
- `ui/pages.yaml`
- `ui/components.yaml`
- `qa/cases/*.yaml`

---

# 3. 推荐目录结构（v2）

```text
docs/machine/
  glossary.yaml

  prd/
    index.yaml
    features/
      F-01.yaml
      F-02.yaml

  api/
    openapi.yaml

  qa/
    acceptance.yaml
    cases/
      F-01.yaml

  delivery/
    units/
      U-F01-01.yaml
      U-F01-02.yaml
    stop_conditions.yaml

  data_model/
    entities.yaml

  architecture/
    system.yaml

  ui/
    pages.yaml
    components.yaml
```

---

# 4. Feature 作为“业务契约”，不是任务单

每个 `feature` 文件仍然保留，但职责要更清晰：

- 它负责描述 **做什么**
- 不负责描述 **这一轮具体怎么改代码**

也就是说：

- `feature` = 业务规则
- `delivery_unit` = AI 这一轮施工单

这个拆分很关键。

---

# 5. Feature YAML（升级版字段）

建议每个 feature 文件至少包含：

```yaml
schema_version: "2.0"
doc_version: 1

feature_id: F-01
title: 数据接入与主键标准化
status: scoped # discovery | scoped | delivery | released | deprecated
priority: P0
depends_on: []
roles: [system, engineering]

summary: >
  将外部数据源中的 SKU 信息标准化为统一主键，供后续任务、分析与复盘流程消费。

inputs:
  - name: sid
    type: string
    source: lingxing_api
    required: true

logic:
  - id: L1
    rule: 业务主键 = sid + asin + seller_sku；若 seller_sku 缺失则回退 sid + asin + local_sku

outputs:
  - name: canonical_sku_key
    type: string
    downstream: [F-03, F-04]

edge_cases:
  - when: seller_sku 与 local_sku 均缺失
    behavior: 排除出自动判定队列并记录原因码 MISSING_STABLE_KEY

open_questions:
  - id: Q-01-1
    question: 领星接口拉取频率与重试策略
    owner: engineering
    blocks_automation: false

acceptance_refs: [AC-01]

implementation_notes:
  - 本 feature 当前只涉及后端域逻辑，不涉及 UI
  - 不要求在本阶段处理批量导入性能优化
```

---

# 6. 新增核心：Delivery Unit（AI 真正执行的最小施工单）

这是 v2 最关键的新增。

## 为什么必须有
因为 feature 往往太大，AI 直接拿 feature 干活时容易：
- 上下文超长
- 改太多文件
- 做出隐式拆解
- 越界修改

### Delivery Unit 的职责
它定义：
- **这一轮只做什么**
- **允许碰哪里**
- **什么算完成**
- **如何验证**
- **失败时是否必须停**

---

## Delivery Unit 示例

```yaml
schema_version: "2.0"
doc_version: 1

unit_id: U-F01-01
feature_id: F-01
title: 实现主键标准化纯函数与单元测试

goal: >
  在领域层实现 canonical_sku_key 的生成逻辑，并覆盖 seller_sku 缺失回退场景。

scope:
  in:
    - 实现主键拼接函数
    - 补充单元测试
  out:
    - 不修改 API 层
    - 不接入数据库
    - 不处理批量导入逻辑

inputs:
  - sid
  - asin
  - seller_sku
  - local_sku

expected_outputs:
  - canonical_sku_key
  - reason_code_when_invalid

allowed_paths:
  - src/domain/sku/**
  - tests/domain/sku/**

forbidden_paths:
  - src/api/**
  - src/ui/**
  - src/db/**

depends_on: []

done_definition:
  - 生成函数已实现
  - seller_sku 缺失时回退逻辑已实现
  - 双字段缺失时返回
user: Note: The previous agent run was aborted by the user. Resume carefully or ask for clarification.

Conversation info (untrusted metadata):
```json
{
  "message_id": "1223",
  "sender_id": "7709890198",
  "sender": "阿星",
  "timestamp": "Tue 2026-03-24 16:11 GMT+8"
}
```

Sender (untrusted metadata):
```json
{
  "label": "阿星 (7709890198)",
  "id": "7709890198",
  "name": "阿星"
}
```

升级，然后保存到本地文件中
assistant: 我先把你这份方法论升级成更适合 AI 自驱开发的版本，落到工作区文件里，再给你一个简短说明。
assistant: [[reply_to_current]] 已升级并保存到本地：

`docs/ai-self-driving-delivery-spec-v2.md`

这版不是单纯润色原文，而是把它从“完整工程文档体系”改成了更适合你这种 **低监督、AI 主开发、尽量少 debug** 的 **AI 自驱开发协议**。重点新增了几层最关键的东西：

- `delivery_unit`：把 feature 再切成 AI 真正可执行的小施工单元
- `stop_conditions`：不清楚就停，禁止模型脑补继续干
- `execution_policy`：统一 AI 在仓库里的默认执行策略
- `done_definition` + `change_impact`：防止“写完了但没真正可交付”

如果你要，我下一步可以直接继续给你补一套**最小可用模板文件**，让你马上拿去喂 GPT-5.4 / Opus 4.6 用。
user: Conversation info (untrusted metadata):
```json
{
  "message_id": "1229",
  "sender_id": "7709890198",
  "sender": "阿星",
  "timestamp": "Tue 2026-03-24 16:14 GMT+8"
}
```

Sender (untrusted metadata):
```json
{
  "label": "阿星 (7709890198)",
  "id": "7709890198",
  "name": "阿星"
}
```

好，你自己先审查一遍你写的这份文档
assistant: [[reply_to_current]] 我先直接审。结论：**这版方向对，已经比原版更适合 AI 自驱开发，但还不算收口到“可直接当团队协议”的程度**。主要问题不是理念错，而是**有几处还偏抽象、偏原则化，离“拿来就跑”还差半步**。

---

# 总体评价

我给它的判断是：

- **战略层面：对**
- **工程层面：还需要再压实**
- **落地层面：现在是 7.5/10，还没到 9/10**

它已经解决了原文最关键的问题：
- 从“工程文档体系”转成了“AI 施工协议”
- 加入了 `delivery_unit`
- 加入了 `stop_conditions`
- 强化了 `done_definition`
- 明确了低监督场景的边界

这些都对。

但我自己回看后，发现还有 6 个地方需要继续打磨。

---

# 我觉得写得好的地方

## 1. 定位已经扭正了
最重要的一点是：  
它不再把自己包装成“完整开发文档最佳实践”，而是明确说：

> 这是给 AI 的施工协议、约束层和交接协议

这一下就把目标校正了。  
因为你真正要优化的是：
- 模型稳定性
- 低人工介入
- 少返工
- 少 debug

不是“文档看起来完整”。

这点是成立的。

---

## 2. `delivery_unit` 是真正值钱的升级
这是整篇里最关键的一刀。

因为 feature 往往还是太大、太抽象，AI 执行时真正需要的是：
- 本轮干啥
- 本轮别干啥
- 本轮做到什么程度算完成
- 碰到什么停下

这一层补上之后，整个协议才真正开始服务 agent，而不是服务 PM。

这部分我认为保留，而且应该继续强化。

---

## 3. `stop_conditions` 的方向是对的
这很重要。  
因为低监督开发最怕的不是做慢，而是**错了还继续干**。

把“必须停机”的条件写出来，本质上是在防止：
- 模型补业务规则
- 模型硬拼冲突契约
- 模型把问题往代码层拖

这个机制是正确的，而且比很多“AI coding guide”强。

---

## 4. `change_impact` 这个要求非常适合你
你最不想干的是 debug。  
那就应该强制 AI 每次说清楚：
- 影响了谁
- 改了哪层
- 要不要回归
- 有没有 DB / API 风险

这部分对你来说是高价值设计，不是装饰项。

---

# 我觉得不够好的地方

## 1. 还是偏“说明文”，不够“协议文”
这版虽然已经比之前强很多，但还有一个明显问题：

> 有些段落更像“解释为什么这么设计”，而不是“仓库里必须遵守的规则”。

比如很多地方在讲：
- 为什么 delivery unit 很重要
- 为什么 stop conditions 值得加
- 为什么 acceptance 要前置

这些内容对第一次读文档的人有帮助，  
但如果目标是让它成为真正执行协议，就应该再压缩成更多这种表达：

- MUST
- MUST NOT
- SHOULD
- MAY
- Block if
- Fail if
- Require

也就是说，这份文档现在：
- **适合看懂**
- 但还不够**适合执行**

如果以后真的要拿它喂不同模型/不同 agent，这种“协议语气”还得再加强。

---

## 2. `delivery_unit` 还缺优先级与依赖关系
我写了 `preconditions`，但还不够。

真实执行时，delivery unit 往往会有：
- 哪个先做
- 哪个依赖哪个
- 哪个可以并行
- 哪个失败会阻塞后续

现在文档里还没明确这一层。  
建议补成类似：

```yaml
depends_on_units: []
parallel_safe: true
sequence_order: 10
```

不然当多个 agent 并行干活时，还是容易撞车或顺序错乱。

---

## 3. 没有定义“BLOCKED / GAP / DONE”的标准输出格式
我写了这些概念，但没有把它们结构化。

这是个问题。  
因为如果没有统一输出格式，不同模型会各自发挥：

- 有的说 blocked
- 有的说 pending
- 有的说 gap
- 有的写自然语言一大段

这会导致你后面做自动汇总、任务接力、结果审查时很痛苦。

应该补一个统一结果格式，比如：

```yaml
execution_result:
  status: DONE | BLOCKED | GAP | FAILED
  summary: ...
  changed_files: []
  tests:
    ran: true
    passed: false
  blockers: []
  risks: []
  next_actions: []
```

这会让整套协议更闭环。

---

## 4. `execution_policy` 还不够硬
我写了：

- `allow_cross_feature_changes: false`
- `require_stop_on_gap: true`
- `max_unit_scope`

这些方向没问题，但还不够精细。

比如还应该明确：
- 默认是否允许新增依赖
- 默认是否允许 schema migration
- 默认是否允许自动删文件
- 默认是否允许重命名导出类型
- 默认是否允许修改 lockfile
- 默认是否允许改 CI 配置

因为很多“AI 改炸仓库”的问题，不是业务逻辑，而是工程层面乱动。

这一层要再补硬一点。

---

## 5. 对“人工介入点”定义不够明确
你要的是人工尽量少介入。  
那协议里就应该明确：

> **什么情况下必须叫人，什么情况下可以自己继续。**

现在虽然有 `blocks_automation` 和 `stop_conditions`，但还差一层“人工决策触发条件”。

比如应该明确：

### 必须人工确认的情况
- 涉及删除/覆盖大量旧代码
- 涉及 schema migration
- 涉及对外 API breaking change
- 涉及权限模型变化
- 涉及计费/金额/风控规则变化
- 涉及引入新第三方服务或新依赖

这一层如果不写，AI 虽然能停，但“停到什么程度、什么时候该叫你”还不够清楚。

---

## 6. 缺少“从协议到执行”的最短闭环示例
这份文档现在定义了很多概念，但少了一段真正能让人秒懂的东西：

> 一个真实 feature，怎样从  
> `feature.yaml -> acceptance.yaml -> delivery_unit.yaml -> 实现结果`
> 串起来。

没有这个最短闭环示例，阅读者会理解概念，但不一定知道怎么真正开跑。

对你来说，这个尤其重要，因为你后面大概率真会把它丢给模型跑。  
那最好给一个极小样例，让任何模型都知道这套协议到底怎么用。

---

# 我会怎么继续改

如果我继续修这份文档，我会做三类增强：

---

## 第一类：把“解释型语言”压成“协议型语言”
比如把很多段落改成这种风格：

- AI **MUST NOT** invent business branches not present in PRD logic.
- AI **MUST** stop when any blocking open question exists.
- A delivery unit **MUST** define `allowed_paths`, `done_definition`, and `stop_if`.
- Any result **MUST** emit a normalized `execution_result`.

这样它会更像规范，而不是文章。

---

## 第二类：把关键对象补齐最小字段
重点补：

### 给 `delivery_unit`
- `depends_on_units`
- `parallel_safe`
- `sequence_order`

### 给 `execution_policy`
- `allow_new_dependencies`
- `allow_lockfile_changes`
- `allow_schema_migration`
- `allow_file_deletion`
- `allow_breaking_api_changes`

### 给结果输出
- `execution_result.status`
- `blockers`
- `risks`
- `next_actions`

---

## 第三类：补一个最短闭环示例
最好加一个附录，四个文件就够：

1. `F-01.yaml`
2. `acceptance.yaml`
3. `U-F01-01.yaml`
4. `execution_result.yaml`

这样这份协议就不只是“知道该怎么想”，而是“知道该怎么跑”。

---

# 最终审查结论

我给这份文档的当前结论是：

## 可以保留的
- 总体方向
- AI-first 定位
- delivery unit 分层
- stop conditions
- done definition
- change impact
- 轻量模式 / 分层启用

## 必须补强的
- 协议语言更硬
- execution result 统一格式
- delivery unit 的依赖/并行字段
- execution policy 的工程边界字段
- 人工介入触发条件
- 最短闭环示例

---

# 一句话判断

**这版已经有骨架了，但还没完全长成“能直接拿来约束多个顶尖模型持续协作”的正式协议。**  
离可实战只差一轮精修，不是推倒重写。

如果你点头，我下一步不空谈，直接做这件事：

> **我把这份 `ai-self-driving-delivery-spec-v2.md` 继续修成 v2.1**  
> 专门补齐上面这 6 个缺口，并直接覆盖本地文件。  

如果要，我就直接改。
user: Conversation info (untrusted metadata):
```json
{
  "message_id": "1238",
  "sender_id": "7709890198",
  "sender": "阿星",
  "timestamp": "Tue 2026-03-24 16:24 GMT+8"
}
```

Sender (untrusted metadata):
```json
{
  "label": "阿星 (7709890198)",
  "id": "7709890198",
  "name": "阿星"
}
```

你先告诉我你写的文档的完整路径，我去看看
assistant: [[reply_to_current]] `/home/ax/.openclaw/workspace/docs/ai-self-driving-delivery-spec-v2.md`
user: Conversation info (untrusted metadata):
```json
{
  "message_id": "1240",
  "sender_id": "7709890198",
  "sender": "阿星",
  "timestamp": "Tue 2026-03-24 16:25 GMT+8"
}
```

Sender (untrusted metadata):
```json
{
  "label": "阿星 (7709890198)",
  "id": "7709890198",
  "name": "阿星"
}
```

好，我看到了，你按照你的想法升级吧
assistant: 我直接把它升级成更硬的 v2.1，补齐协议化表达、统一结果格式、人工介入点和最短闭环示例，然后保存覆盖本地文件。
assistant: [[reply_to_current]] 我已经按刚才那套审查意见升级了，还是覆盖在原文件：

`/home/ax/.openclaw/workspace/docs/ai-self-driving-delivery-spec-v2.md`

这次主要补了 6 件事：

- 把语气从“说明文”压成更硬的协议语言：`MUST / MUST NOT / SHOULD`
- 给 `delivery_unit` 补了依赖、顺序、并行字段
- 补了统一的 `execution_result` 结果协议
- 补了 `human_review_policy`，明确哪些情况必须叫你
- 把 `execution_policy` 的工程边界加硬了
- 加了一个最短闭环示例，不再只是讲概念

你先看这一版。  
如果你看完觉得方向稳，我下一步就不再写大段方法论了，直接给你补**可直接开用的模板文件集**。
