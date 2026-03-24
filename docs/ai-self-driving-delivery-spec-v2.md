# AI 自驱开发协议 v2.1

> 目标：让 GPT-5.4、Opus 4.6、Codex 等顶尖模型在**低人工介入**条件下，围绕同一套机器可读契约，稳定完成从需求到实现到测试的连续交付；尽量减少来回解释、隐性脑补、无关重构与后期人工 debug。

---

## 0. 文档定位

本文件不是普通意义上的“产品文档规范”或“工程最佳实践说明文”。

本文件是：

> **给 AI 执行者使用的施工协议、约束层、停机规则和交付协议。**

若某条规则以自然语言解释与结构化契约发生冲突，以 `docs/machine/` 下结构化文件为准；若结构化文件之间相互冲突，AI 必须停止执行并输出 `BLOCKED`。

---

## 1. 协议目标

本协议用于解决以下问题：

1. **多轮理解漂移**：同一需求在不同轮次、不同模型、不同 agent 中被理解成不同版本。
2. **无人盯防时自动脑补**：AI 在需求缺失或冲突时，自行补业务规则并继续施工。
3. **改动范围失控**：AI 顺手重构、跨 feature 修改、扩大影响面。
4. **做完不等于可交付**：写出代码，但未同步契约、未测试、未声明影响面。
5. **后期 debug 成本过高**：错误直到代码阶段才暴露，需要人类回溯 PRD、接口、状态、边界条件。

本协议的核心思想是：

> **把错误前移到契约与执行边界层，而不是留到代码与人工 debug 阶段。**

---

## 2. 规范用语

本协议中的关键字按以下强度理解：

- **MUST**：必须；违反即视为协议不合规
- **MUST NOT**：禁止；违反即必须停止并报告
- **SHOULD**：强烈建议；仅在有充分理由时偏离，并需说明
- **MAY**：可选；是否采用取决于项目复杂度与阶段

除非特别说明，下文所有“AI”均指：执行仓库开发任务的模型、agent、编码代理或自动化流水线。

---

## 3. 核心原则

### 3.1 单一真相源
- 业务规则、接口契约、验收条件 **MUST** 以 `docs/machine/` 下结构化文件为准。
- README、聊天记录、注释、临时说明 **MAY** 作为补充，但 **MUST NOT** 与结构化契约冲突。
- 若发现冲突，AI **MUST** 停止执行并输出 `BLOCKED`。

### 3.2 AI 不得脑补
- AI **MUST NOT** 发明 PRD `logic` 中不存在的业务分支。
- AI **MUST NOT** 自行补全未定义字段的业务语义。
- 对未定义、冲突、缺失、歧义项，AI **MUST** 记录为 `open_questions`、`GAP` 或 `BLOCKED`，不得私自实现。

### 3.3 按切片施工
- AI **MUST NOT** 直接以“大 feature”作为单次实现单位，除非该 feature 本身已经被压缩到足够小。
- AI **MUST** 以 `delivery_unit` 作为默认施工单元。
- 每个 `delivery_unit` **MUST** 明确：允许修改范围、禁止修改范围、完成判据、停机条件。

### 3.4 先契约，后实现
- 若目标需求尚无足够契约支撑，AI **MUST NOT** 直接写代码。
- PRD / acceptance / API / delivery unit 的缺失，原则上优先补契约，再进实现。

### 3.5 少 debug 的本质是前移约束
- 本协议的目标不是增加文档数量，而是减少后期返工、补逻辑、人工排查和隐式决策。
- 任意新增字段或文档层若不能降低跑偏、返工或 debug 成本，则 **SHOULD NOT** 引入。

---

## 4. 适用范围

本协议适合：
- 主要由 GPT-5.4、Opus 4.6、Codex 等强模型执行开发
- 人工希望只做少量确认、审核、决策
- 希望 AI 可在低监督模式下持续推进
- 希望跨模型、跨 agent 使用同一中间契约层
- 希望把 debug 工作尽量前移并压缩

本协议不适合：
- 纯探索型的一次性想法验证
- 简单脚本、极低复杂度原型
- 当天立项、当天推翻的高波动需求

若项目处于早期探索期，**SHOULD** 使用第 14 节“轻量模式”。

---

## 5. 推荐目录结构

```text
docs/
  machine/
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
      execution_policy.yaml
      human_review_policy.yaml
      result_schema.yaml
    data_model/
      entities.yaml
    architecture/
      system.yaml
    ui/
      pages.yaml
      components.yaml
    engineering/
      code_rules.yaml
```

分层说明：
- **最小必备层**：`glossary / prd / api / qa / delivery`
- **按需启用层**：`data_model / architecture / ui`
- **成熟补强层**：`cases / components / code_rules`

---

## 6. 最小必备契约层

### 6.1 `glossary.yaml`
用途：统一术语、英文命名、字段口径。

要求：
- 一个概念 **MUST** 只有一个稳定 key
- 高频且易歧义术语 **SHOULD** 收录
- 低价值同义词说明 **SHOULD NOT** 无限制扩张

最小结构：

```yaml
schema_version: "2.1"
doc_version: 1
terms:
  - key: canonical_sku_key
    zh: 标准 SKU 主键
    definition: sid + asin + seller_sku 的稳定拼接结果
```

---

### 6.2 `prd/index.yaml` + `prd/features/*.yaml`
用途：定义业务功能，不直接等于一次实现任务。

每个 feature 文件 **MUST** 至少包含：

```yaml
schema_version: "2.1"
doc_version: 1
feature_id: F-01
title: 数据接入与主键标准化
status: scoped # discovery | scoped | in_delivery | released | deprecated
priority: P0
depends_on: []
roles: [system, engineering]
automation_level: full # advisory | partial | full
inputs: []
logic: []
outputs: []
edge_cases: []
open_questions: []
acceptance_refs: []
```

字段要求：
- `status`
  - `discovery`：仅允许分析、补契约，不允许稳定施工
  - `scoped`：范围已明确，允许进入 delivery unit
  - `in_delivery`：正在开发
  - `released`：已上线
  - `deprecated`：废弃
- `automation_level`
  - `advisory`：AI 仅可分析与建议
  - `partial`：AI 可局部实施，但需要人工继续放行
  - `full`：满足条件时 AI 可自行推进
- `open_questions` 每项 **MUST** 包含：
  - `id`
  - `question`
  - `owner`
  - `blocks_automation`

规则：
- 若任一 `open_questions.blocks_automation = true` 且未关闭，AI **MUST** 停止实现并输出 `BLOCKED`
- `logic` **MUST** 可判定；模糊形容词 **MUST NOT** 作为验收逻辑直接出现

---

### 6.3 `api/openapi.yaml`
用途：定义接口契约。

要求：
1. 每个 operation **MUST** 标注 `x-feature-ids`
2. 每个 operation **SHOULD** 标注 `x-delivery-units`
3. 枚举 **MUST** 使用 `enum`
4. 错误结构 **MUST** 统一
5. API **MUST NOT** 引入 PRD `logic` 中不存在的业务分支

示例：

```yaml
paths:
  /sku/{canonical_sku_key}/review-state:
    get:
      operationId: getSkuReviewState
      x-feature-ids: [F-05, F-11]
      x-delivery-units: [U-F11-01]
```

---

### 6.4 `qa/acceptance.yaml`
用途：定义业务交付是否成立。

要求：
- 每个 P0 feature **MUST** 至少关联一个 acceptance
- 每条 acceptance **MUST** 可验证
- acceptance **MUST NOT** 使用“体验更好”“尽量快”等不可判定描述

最小结构：

```yaml
schema_version: "2.1"
doc_version: 1
acceptance:
  - ac_id: AC-01
    description: 当 seller_sku 缺失但 local_sku 存在时，系统仍可生成稳定主键
    feature_ids: [F-01]
    priority: P0
```

---

### 6.5 `delivery/units/*.yaml`
用途：定义 AI 的单次施工切片。

这是本协议中最关键的对象。

每个 `delivery_unit` **MUST** 至少包含：

```yaml
schema_version: "2.1"
doc_version: 1
unit_id: U-F01-01
feature_id: F-01
goal: 建立主键标准化纯函数与单元测试
sequence_order: 10
depends_on_units: []
parallel_safe: true
preconditions:
  - feature_status = scoped
  - no_blocking_open_questions
inputs:
  - sid
  - asin
  - seller_sku
  - local_sku
outputs:
  - canonical_sku_key
allowed_paths:
  - src/domain/sku/**
  - tests/domain/sku/**
forbidden_paths:
  - src/ui/**
  - src/legacy/**
forbidden_actions:
  - 修改 API schema
  - 引入新依赖
  - 重命名公共类型
related_operation_ids: []
related_acceptance_ids: [AC-01]
done_definition:
  - 纯函数已实现
  - 单元测试已补齐并通过
  - 类型检查通过
  - 未修改 allowed_paths 外文件
stop_if:
  - feature_status != scoped
  - exists_blocking_open_question
  - discovered_new_business_branch_without_prd_logic
handoff_output:
  - execution_result
  - changed_files
  - test_results
  - unresolved_risks
```

字段要求：
- `sequence_order`：用于同 feature 内部排序
- `depends_on_units`：显式声明依赖单元
- `parallel_safe`
  - `true`：可与其他 unit 并行
  - `false`：必须串行执行
- `allowed_paths`：未列出的路径默认视为禁止修改
- `forbidden_actions`：列出即禁止
- `done_definition`：用于判定是否真正完成
- `stop_if`：命中任一即必须停止执行

规则：
- 缺少 `allowed_paths`、`done_definition` 或 `stop_if` 的 unit，AI **MUST NOT** 开工
- 同一轮执行 **SHOULD** 只聚焦单个 `delivery_unit`
- 若一个需求跨多个 unit，AI **MUST** 分批执行并逐批交付

---

## 7. 全局执行策略 `delivery/execution_policy.yaml`

用途：统一 AI 在仓库中的默认施工边界。

示例：

```yaml
schema_version: "2.1"
doc_version: 1
policy:
  default_mode: contract_first
  allow_cross_feature_changes: false
  require_acceptance_traceability: true
  require_changed_files_report: true
  require_stop_on_gap: true
  allow_new_dependencies: false
  allow_lockfile_changes: false
  allow_schema_migration: false
  allow_file_deletion: false
  allow_breaking_api_changes: false
  max_unit_scope:
    files: 8
    feature_ids: 1
  preferred_execution_order:
    - glossary
    - prd
    - acceptance
    - api
    - delivery_unit
    - implementation
```

规则：
- 若未显式允许，AI **MUST NOT** 新增依赖、改 lockfile、删文件、做 migration、引入 breaking API 变更
- 若某次任务确需越过默认边界，AI **MUST** 输出 `BLOCKED` 并请求人工放行

---

## 8. 人工介入策略 `delivery/human_review_policy.yaml`

用途：定义什么情况下 AI 必须停机并请求人工确认，而不是继续“尽力补全”。

建议结构：

```yaml
schema_version: "2.1"
doc_version: 1
human_review_required:
  - id: HR-01
    when: 涉及删除或覆盖大量旧代码
  - id: HR-02
    when: 涉及 schema migration 或数据回填
  - id: HR-03
    when: 涉及对外 API breaking change
  - id: HR-04
    when: 涉及权限模型变化
  - id: HR-05
    when: 涉及金额、计费、风控、审核规则变化
  - id: HR-06
    when: 涉及新增第三方服务或新依赖
```

规则：
- 命中任一人工介入条件时，AI **MUST** 输出 `BLOCKED_REVIEW_REQUIRED`
- AI **MUST NOT** 在未获人工确认前继续实施对应变更

---

## 9. 停机条件 `delivery/stop_conditions.yaml`

这是低监督开发场景下的核心护栏。

示例：

```yaml
schema_version: "2.1"
doc_version: 1
stop_conditions:
  - id: STOP-01
    when: 存在 open_questions.blocks_automation = true 且未解决
    action: block
  - id: STOP-02
    when: PRD logic 与 API schema 冲突
    action: block
  - id: STOP-03
    when: 发现需要新增业务分支，但 PRD 中没有对应 logic
    action: block
  - id: STOP-04
    when: 目标 delivery unit 未定义 allowed_paths 或 done_definition
    action: block
  - id: STOP-05
    when: 测试失败且失败原因超出当前 feature 范围
    action: block_and_report
  - id: STOP-06
    when: 多个 feature 对同一字段、枚举或状态定义不一致
    action: block_and_report
```

规则：
- 命中 stop condition 后，AI **MUST** 停止实现
- 停止后，AI **MAY** 输出：冲突点、缺失点、建议补哪个契约文件
- 停止后，AI **MUST NOT** 自行创造新业务逻辑绕过冲突

---

## 10. 执行结果协议 `delivery/result_schema.yaml`

用途：统一 `DONE / BLOCKED / GAP / FAILED` 的结果格式，避免不同模型各说各话。

建议结构：

```yaml
schema_version: "2.1"
doc_version: 1
execution_result:
  status: DONE # DONE | BLOCKED | BLOCKED_REVIEW_REQUIRED | GAP | FAILED
  unit_id: U-F01-01
  feature_id: F-01
  summary: 主键标准化纯函数与单测已完成
  changed_files:
    - src/domain/sku/index.ts
    - tests/domain/sku/index.test.ts
  tests:
    ran: true
    passed: true
    details: []
  change_impact:
    affects_feature_ids: [F-01]
    affects_api: false
    affects_db: false
    affects_ui: false
    requires_migration: false
    requires_regression_cases: [AC-01]
    touched_paths:
      - src/domain/sku/index.ts
      - tests/domain/sku/index.test.ts
  blockers: []
  risks: []
  next_actions: []
```

状态定义：
- `DONE`：本 unit 已满足 done_definition
- `BLOCKED`：因契约缺失/冲突/stop condition 停机
- `BLOCKED_REVIEW_REQUIRED`：命中人工介入策略，需人工确认
- `GAP`：发现当前契约无法支撑目标实现，但尚未进入可执行阶段
- `FAILED`：已执行但未达到完成标准，且无法在当前边界内收敛

规则：
- 每次交付 **MUST** 输出统一的 `execution_result`
- 若无结构化结果，仅有自然语言汇报，则视为交付不完整

---

## 11. Done Definition：完成不等于写完

以下条件 **SHOULD** 作为全局默认完成判据：
- 代码已实现
- 相关测试已通过
- 类型检查已通过
- 契约文件已同步
- 未触发 stop condition
- 未越界修改 forbidden paths
- 变更文件列表已输出
- `execution_result` 已输出
- `change_impact` 已输出

规则：
- 只写代码、不补契约、不报影响面、不统一交付结果，**MUST NOT** 视为完成

---

## 12. 按需启用层

### 12.1 `data_model/entities.yaml`
当存在以下情况时 **SHOULD** 启用：
- 多实体关系
- 主键/唯一键复杂
- 需要稳定生成 migration / ORM / mock
- 数据字段与 API 字段容易漂移

### 12.2 `architecture/system.yaml`
当存在以下情况时 **SHOULD** 启用：
- 多服务协作
- 异步任务或消息流
- 第三方系统较多
- 鉴权 / 审计 / SLA 明显复杂

### 12.3 `ui/pages.yaml`
当页面存在以下特征时 **SHOULD** 启用：
- 多状态切换
- 多角色视图差异
- 多动作流转
- 异常态、空态、部分加载态较多

### 12.4 `ui/components.yaml`
- 仅在设计系统、组件边界和复用约束已较稳定时 **SHOULD** 启用
- 在探索期或快速迭代阶段，**SHOULD NOT** 过早引入

---

## 13. 推荐执行顺序

原则：核心契约不能缺，但可以回填；不要机械瀑布式串行。

推荐顺序：
1. `glossary.yaml`
2. `prd/index.yaml`
3. `prd/features/*.yaml`
4. `qa/acceptance.yaml`
5. `api/openapi.yaml`
6. `delivery/stop_conditions.yaml`
7. `delivery/execution_policy.yaml`
8. `delivery/human_review_policy.yaml`
9. `delivery/result_schema.yaml`
10. `delivery/units/*.yaml`
11. AI 实现代码
12. 按复杂度补 `data_model / architecture / ui / cases / components`

说明：
- `acceptance` **SHOULD** 前置，因为它决定“什么叫做成了”
- `delivery_unit` **MUST** 在编码前补齐
- 页面状态机与组件契约不是所有项目都要第一天就上

---

## 14. 轻量模式（适合早期项目）

如果项目还在 0→1 或方向尚不稳定，**SHOULD** 只保留以下文件：

```text
docs/machine/
  glossary.yaml
  prd/index.yaml
  prd/features/*.yaml
  api/openapi.yaml
  qa/acceptance.yaml
  delivery/stop_conditions.yaml
  delivery/execution_policy.yaml
  delivery/result_schema.yaml
  delivery/units/*.yaml
```

此时可暂不建立：
- `architecture/system.yaml`
- `data_model/entities.yaml`
- `ui/pages.yaml`
- `ui/components.yaml`
- `qa/cases/*.yaml`
- `engineering/code_rules.yaml`

原则：
- 先保证 AI 不乱做
- 再追求全链路完备
- 不要一上来把仓库变成文档维护工程

---

## 15. 给 AI 的统一执行信封

```text
你是本仓库的严格执行代理。必须遵守：
1) 结构化真相源路径：docs/machine/ 下 YAML/OpenAPI，不得与之一矛盾。
2) 仅在当前 delivery unit / feature_id / operationId 范围内工作；禁止顺带重构无关模块。
3) 若存在 open_questions.blocks_automation = true，必须停止并输出 BLOCKED。
4) 若发现需要新增业务分支，但 PRD logic 未定义，必须停止并输出 GAP。
5) 优先检查 delivery unit 的 allowed_paths / forbidden_paths / done_definition / stop_if。
6) 若命中 human_review_policy，必须输出 BLOCKED_REVIEW_REQUIRED。
7) 输出必须包含：代码补丁、变更文件列表、测试结果、execution_result、change_impact、未解决风险。
8) 若涉及契约变更，同步更新 docs/machine/ 下对应 YAML；若无法同步，停止并说明原因。
```

若接入 RAG：

```text
以下检索结果仅供参考；若与 docs/machine/ 下结构化文件冲突，以结构化文件为准：
{{RAG_RESULTS}}
```

---

## 16. 最短闭环示例

本节给出一个从 feature → acceptance → delivery unit → execution result 的最小可运行链路。

### 16.1 `prd/features/F-01.yaml`

```yaml
schema_version: "2.1"
doc_version: 1
feature_id: F-01
title: 数据接入与主键标准化
status: scoped
priority: P0
depends_on: []
roles: [system, engineering]
automation_level: full
inputs:
  - name: sid
    type: string
  - name: asin
    type: string
  - name: seller_sku
    type: string
    required: false
  - name: local_sku
    type: string
    required: false
logic:
  - id: L1
    rule: 业务主键 = sid + asin + seller_sku；若 seller_sku 缺失则回退 sid + asin + local_sku
outputs:
  - name: canonical_sku_key
    type: string
edge_cases:
  - when: seller_sku 与 local_sku 均缺失
    behavior: 排除出自动判定队列并记录原因码 MISSING_STABLE_KEY
open_questions: []
acceptance_refs: [AC-01]
```

### 16.2 `qa/acceptance.yaml`

```yaml
schema_version: "2.1"
doc_version: 1
acceptance:
  - ac_id: AC-01
    description: 当 seller_sku 缺失但 local_sku 存在时，系统仍可生成稳定主键
    feature_ids: [F-01]
    priority: P0
```

### 16.3 `delivery/units/U-F01-01.yaml`

```yaml
schema_version: "2.1"
doc_version: 1
unit_id: U-F01-01
feature_id: F-01
goal: 建立主键标准化纯函数与单元测试
sequence_order: 10
depends_on_units: []
parallel_safe: true
preconditions:
  - feature_status = scoped
  - no_blocking_open_questions
allowed_paths:
  - src/domain/sku/**
  - tests/domain/sku/**
forbidden_paths:
  - src/ui/**
  - src/api/**
forbidden_actions:
  - 修改 API schema
  - 引入新依赖
related_operation_ids: []
related_acceptance_ids: [AC-01]
done_definition:
  - 纯函数已实现
  - 单元测试已通过
  - 类型检查已通过
stop_if:
  - exists_blocking_open_question
  - discovered_new_business_branch_without_prd_logic
handoff_output:
  - execution_result
```

### 16.4 `delivery/result_schema.yaml` 的一次实例输出

```yaml
execution_result:
  status: DONE
  unit_id: U-F01-01
  feature_id: F-01
  summary: 已完成主键标准化纯函数与对应单测
  changed_files:
    - src/domain/sku/index.ts
    - tests/domain/sku/index.test.ts
  tests:
    ran: true
    passed: true
    details: []
  change_impact:
    affects_feature_ids: [F-01]
    affects_api: false
    affects_db: false
    affects_ui: false
    requires_migration: false
    requires_regression_cases: [AC-01]
    touched_paths:
      - src/domain/sku/index.ts
      - tests/domain/sku/index.test.ts
  blockers: []
  risks: []
  next_actions:
    - 可进入下一个 delivery unit
```

这个最短闭环的目的不是展示文档有多完整，而是展示：

> **AI 每轮到底该依据什么开工、何时停机、怎样算交付完成。**

---

## 17. 相比传统“产品开发步骤”的关键升级

v2.1 相比传统全链路工程规范，核心升级是：

1. **引入 `delivery_unit`**：解决 AI 单轮改动过大、施工边界失控的问题
2. **引入 `stop_conditions`**：解决低监督场景下 AI 脑补施工的问题
3. **引入 `execution_policy`**：解决多模型、多 agent 的默认行为漂移问题
4. **引入 `human_review_policy`**：明确哪些场景必须人工介入，而不是继续自动推进
5. **引入统一 `execution_result`**：解决交付结果无法标准化汇总的问题
6. **强调“完成不等于写完”**：把测试、契约同步、影响声明纳入完成定义
7. **提供最短闭环示例**：让协议从“讲得通”变成“跑得通”

---

## 18. 一句话原则

> **不是把文档写给人看得舒服，而是把契约写到足以让顶尖模型在你不盯着的时候，也不容易做错。**

---

## 19. 下一步建议

若要把本协议真正投入使用，建议继续补三套模板：

1. `prd/features/F-xx.yaml` 模板
2. `delivery/units/U-Fxx-xx.yaml` 模板
3. `delivery/result_schema.yaml` 填写模板

然后拿一个真实 feature 试跑一次，验证：
- AI 是否真的更少跑偏
- 人工是否真的更少返工
- 哪些字段最值钱，哪些字段可以继续删减

协议只有经过真实 feature 的跑数，才算真的成熟。
