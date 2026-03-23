# Session: 2026-03-23 02:10:57 UTC

- **Session Key**: agent:main:telegram:direct:7709890198
- **Session ID**: 67da7186-7774-49cd-93ba-a6e6984b4e8f
- **Source**: telegram

## Conversation Summary

user: Conversation info (untrusted metadata):
```json
{
  "message_id": "928",
  "sender_id": "7709890198",
  "sender": "阿星",
  "timestamp": "Mon 2026-03-23 08:44 GMT+8"
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

使用 clawteam 分析晶澳科技、赛伍技术的当前投资价值，给出买入/持有/卖出建议
assistant: 我会用 ClawTeam 拉一个小型研究团队并行做这两只票的基本面、行业链条和估值对比，最后给你一个明确结论。先起队、分工、开监控。
assistant: [[reply_to_current]] 现在没法直接替你跑 ClawTeam：当前环境里的 `exec` 被 allowlist 卡住了，`clawteam` 命令起不来，所以我没法真实拉起多代理团队做并行研究。

但我先把判断框架给你，免得空转：

- **晶澳科技（002459）**：偏向 **持有 / 观察性买入**
  - 逻辑：它本质上还是光伏主产业链龙头，核心看点在于出货规模、海外渠道、N 型技术迭代、以及行业出清后利润修复弹性。
  - 风险：光伏主链这两年最大问题不是“有没有需求”，而是**产能过剩 + 价格战 + 盈利塌缩**。如果行业还没完成出清，再便宜也可能继续便宜。
  - 结论：  
    - 如果你是**左侧、能扛波动**，它比纯弹性小票更像“活下来的大厂”，可以分批看。  
    - 如果你是**短中期求确定性**，我更倾向先给 **持有/观察**，等看到盈利拐点、库存改善、组件价格止跌再加仓。

- **赛伍技术（603212）**：偏向 **谨慎持有 / 逢反弹减仓**
  - 逻辑：它是光伏胶膜/材料链，位置比组件厂更“中游耗材化”，一旦行业卷价格，上下游都会挤压它，议价权通常不如龙头整机环节。
  - 风险：材料环节经常面临**产品同质化、毛利率被压、客户集中度高**的问题；如果没有特别强的新产品放量或非光伏第二增长曲线，估值修复弹性未必比龙头更好。
  - 结论：  
    - 没有看到明显经营拐点前，我不把它当优先买入标的。  
    - 更像 **持有偏谨慎**；如果仓位重、且只是博光伏反弹，反而更适合 **反弹择机降仓**。

**一句话建议：**
- **晶澳科技：持有，激进者可分批买入**
- **赛伍技术：持有偏减仓，不建议作为当前优先买入标的**

如果你要，我下一步可以直接给你两版更有用的东西，二选一：
1. **按“价值投资”口径**做：ROE、负债、现金流、行业地位、估值区间  
2. **按“A股交易”口径**做：预期差、筹码、板块节奏、未来 3-6 个月买卖点

你如果愿意让我继续，我也可以给你补一版**“为什么我更偏晶澳、不偏赛伍”的详细对比表**。
user: Conversation info (untrusted metadata):
```json
{
  "message_id": "931",
  "sender_id": "7709890198",
  "sender": "阿星",
  "timestamp": "Mon 2026-03-23 08:59 GMT+8"
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

你说的被allowlist卡住了，怎么解决呀？你看一下这个项目的说明文档，是不是咱们安装的时候没按照文档来，按照文档来补足一下https://github.com/win4r/ClawTeam-OpenClaw
assistant: 我先直接看仓库文档，再对照当前环境判断是“没装好”还是“工具策略拦截”。这两个性质完全不同，别混了。
assistant: 先说结论：**不是 ClawTeam 没装好导致的**，而是 **OpenClaw 这边的 `exec` 工具策略把任意 shell 命令拦了**。  
我刚才连最普通的 `python3 ...`、`clawteam template list` 都没跑起来，报的是 **`exec denied: allowlist miss`**——这类报错发生在“命令还没执行之前”，说明是平台层的 allowlist/安全策略问题，不是项目安装脚本内部报错。
assistant: [[reply_to_current]] 先给你拆清楚：**这大概率不是 ClawTeam-OpenClaw 没按文档安装**，而是 **OpenClaw 当前会话的 `exec` 被策略层拦住了**。

我这边已经验证过：
- 跑 `python3 ...` → `exec denied: allowlist miss`
- 跑 `clawteam template list` → `exec denied: allowlist miss`
- 跑 `openclaw status` → 还是 `exec denied: allowlist miss`

这说明命令**在真正执行前**就被 OpenClaw 的 allowlist 拦截了。  
如果是“没装好”，通常会看到：
- `command not found`
- 缺依赖
- Python 包报错
- 配置文件缺失  
而不是现在这种统一的策略拒绝。

### 所以问题分两层
#### 1) ClawTeam 是否按文档装好
这个我现在还没法直接验证，因为 shell 根本起不来。

#### 2) 为什么我不能执行
根因更像是：
- OpenClaw 的 `exec` 工具当前处于严格 allowlist 模式
- `python3`、`clawteam`、`openclaw` 这些命令没有被放进允许列表
- 所以我没法代你直接跑安装检查或启动 swarm

---

## 怎么解决
你要解决的是 **OpenClaw 的 exec 权限策略**，不是先急着重装 ClawTeam。

### 最直接的排查路径
你在宿主机上手动跑下面这些命令，把输出贴给我：

```bash
which clawteam
clawteam --help
clawteam template list
python3 --version
openclaw gateway status
```

如果这些在你的终端里都能跑通，那就进一步坐实：  
**ClawTeam 本身没问题，卡的是 OpenClaw agent 的 exec allowlist。**

---

## 接下来该看哪份文档
你给的仓库文档我这边没成功直接抓到：
- `web_fetch` 被网络/IP 策略挡了
- `browser` 也因为本机没有可用浏览器起不来

所以现在最稳的办法不是我“盲猜安装步骤”，而是你把这个仓库的 **README / 安装说明** 贴给我，或者直接在 workspace 里放一份，我来逐条对照。  
我会帮你分成三类：
1. **ClawTeam 安装步骤**
2. **OpenClaw 集成步骤**
3. **让 agent 能执行 `clawteam` 的权限/allowlist 配置**

---

## 高概率正确的判断
按照现象，我更怀疑是下面这类配置缺了一步：

- OpenClaw 的 `exec` 默认是 allowlist 模式
- 但没有把以下命令加入允许列表：
  - `python3`
  - `clawteam`
  - `openclaw`
  - 可能还有 `tmux`、`git`

也就是说，即便你 **已经安装好了 ClawTeam**，我还是用不了。

---

## 你现在可以怎么配合我
两种最快方式，任选一个：

### 方案 A：你贴文档
把 `ClawTeam-OpenClaw` 的 README / 安装说明贴出来，我直接帮你审。

### 方案 B：你贴本机检查结果
把下面命令输出发我：

```bash
which clawteam
clawteam --help
clawteam template list
python3 --version
openclaw gateway status
```

如果你愿意，我下一步可以直接帮你做两件事：
1. **判断是安装问题还是权限问题**
2. **给你一份最小修复清单**，包括“OpenClaw 要把哪些命令加进 exec allowlist”
user: Conversation info (untrusted metadata):
```json
{
  "message_id": "935",
  "sender_id": "7709890198",
  "sender": "阿星",
  "timestamp": "Mon 2026-03-23 09:11 GMT+8"
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

我记得我给main这agent的权限是full，可以编写文件，执行bash命令使用web_fetch，那些命令你可以运行吗？
assistant: [[reply_to_current]] 不能。**按当前这条会话里我实际拿到的工具行为，`read/write/edit` 能用，但 `exec` 和 `web_fetch` 现在都不正常可用。**

我刚才实际测到的是：

- `exec("python3 ...")` → `exec denied: allowlist miss`
- `exec("clawteam template list")` → `exec denied: allowlist miss`
- `exec("openclaw status")` → `exec denied: allowlist miss`
- `web_fetch("https://github.com/win4r/ClawTeam-OpenClaw")` → `Blocked: resolves to private/internal/special-use IP address`

所以不是我“觉得不能”，而是**工具返回就是这么说的**。  
这和你记忆里的“main 是 full 权限”有冲突，可能有几种情况：

1. **主 agent 配的是 full，但当前会话工具策略没实际生效**
2. **`exec` 还有额外 allowlist / provider 层限制**，不是只看 agent 权限
3. **`web_fetch` 经过的网络出口/解析策略**把 GitHub 这次判断成了特殊地址
4. 你之前配的是某个环境/会话，**这次新 session 没继承到**

### 我现在能做的
- 能继续 **读本地文件、改文件**
- 能帮你 **检查 OpenClaw 配置**
- 但按照规则，**改配置前要先看相关 schema**
- 如果你明确同意，我下一步就直接去查 **OpenClaw 配置里和 tools/exec/web 相关的 schema 与当前配置**，看看到底是哪层把它卡住了

如果你要我继续，我就直接开始查配置，不跟你兜圈子。
user: Conversation info (untrusted metadata):
```json
{
  "message_id": "939",
  "sender_id": "7709890198",
  "sender": "阿星",
  "timestamp": "Mon 2026-03-23 09:13 GMT+8"
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

你哦看一下，这是咱们的当前配置，关于execute：Current exec defaults: host=gateway, security=full, ask=off, node=(unset).
Options: host=sandbox|gateway|node, security=deny|allowlist|full, ask=off|on-miss|always, node=<id>.
assistant: [[reply_to_current]] 看到了。那就更明确了：**“默认值显示 full” 和 “这次工具实际执行到 full” 不是一回事。**

我刚按你说的显式指定了一遍：

- `host=gateway`
- `security=full`
- `ask=off`

分别测试了：

```bash
echo test-from-gateway
python3 --version
clawteam --help
```

结果三条全部还是：

```text
exec denied: allowlist miss
```

### 这说明什么
说明问题不是我没带参数，也不是我误用了默认值。  
而是 **当前这条会话里的 exec 工具，后端实际上仍在按 allowlist 拦截**。换句话说：

- 要么是 **UI/状态里显示的 defaults 和真实生效策略不一致**
- 要么是 **还有更外层的 provider / policy / gateway 级限制** 覆盖了这里的 `security=full`
- 要么是这个环境里 **gateway host 的 exec provider 本身被收口了**

### 现在能下的结论
**不是 ClawTeam 安装步骤导致我跑不了。**  
因为连最简单的 `echo` 都跑不了，这和 ClawTeam 是否安装完全无关。  
根因仍然是：**exec 没真正放开。**

---

## 下一步该怎么查
最值钱的不是继续猜，而是直接查 OpenClaw 的配置和 schema，重点看这几块：

- `tools.exec`
- 可能的 `tools.byProvider`
- 可能的 `tools.profile`
- 可能的 host/provider 级 exec 限制
- web 工具的网络策略配置

按规则，改配置前要先查 schema。  
如果你点头，我下一步就直接用 `gateway.config.schema.lookup` 去查这些配置路径，然后再看当前配置里是不是哪层把 `exec` 覆盖掉了。  

一句话：**你贴的“Current exec defaults”不够，真实执行链上还有别的闸门。**  
我建议现在别纠结 ClawTeam README，先把这个闸门找出来。
user: [media attached: /home/ax/.openclaw/media/inbound/README---d89c4f55-684e-46d9-8668-e67b0efd3dd6.md (text/markdown) | /home/ax/.openclaw/media/inbound/README---d89c4f55-684e-46d9-8668-e67b0efd3dd6.md]
To send an image back, prefer the message tool (media/path/filePath). If you must inline, use MEDIA:https://example.com/image.jpg (spaces ok, quote if needed) or a safe relative path like MEDIA:./image.jpg. Avoid absolute paths (MEDIA:/...) and ~ paths — they are blocked for security. Keep caption in the text body.
Conversation info (untrusted metadata):
```json
{
  "message_id": "941",
  "sender_id": "7709890198",
  "sender": "阿星",
  "timestamp": "Mon 2026-03-23 09:15 GMT+8"
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

[Telegram 阿星 id:7709890198 +2m Mon 2026-03-23 09:15 GMT+8] <media:document>

<file name="README---d89c4f55-684e-46d9-8668-e67b0efd3dd6.md" mime="text/markdown">
<h1 align="center">🦞ClawTeam-OpenClaw</h1>

<p align="center">
 <strong>Multi-agent swarm coordination for CLI coding agents — <a href="https://openclaw.ai">OpenClaw</a> as default</strong>
</p>

<p align="center">
 <a href="https://github.com/HKUDS/ClawTeam"><img src="https://img.shields.io/badge/upstream-HKUDS%2FClawTeam-purple?style=for-the-badge" alt="Upstream"></a>
 <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick_Start-3_min-blue?style=for-the-badge" alt="Quick Start"></a>
 <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License"></a>
</p>

<p align="center">
 <img src="https://img.shields.io/badge/python-≥3.10-blue?logo=python&logoColor=white" alt="Python">
 <img src="https://img.shields.io/badge/agents-OpenClaw_%7C_Claude_Code_%7C_Codex_%7C_nanobot-blueviolet" alt="Agents">
 <img src="https://img.shields.io/badge/transport-File_%7C_ZeroMQ_P2P-orange" alt="Transport">
 <img src="https://img.shields.io/badge/version-0.3.0-teal" alt="Version">
</p>

> **Fork of [HKUDS/ClawTeam](https://github.com/HKUDS/ClawTeam)** with deep OpenClaw integration: default `openclaw` agent, per-agent session isolation, exec approval auto-config, and production-hardened spawn backends. All upstream fixes are synced.

You set the goal. The agent swarm handles the rest — spawning workers, splitting tasks, coordinating, and merging results.

Works with [OpenClaw](https://openclaw.ai) (default), [Claude Code](https://claude.ai/claude-code), [Codex](https://openai.com/codex), [nanobot](https://github.com/HKUDS/nanobot), [Cursor](https://cursor.com), and any CLI agent.

---

## Why ClawTeam?

Current AI agents are powerful but work in **isolation**. ClawTeam lets agents self-organize into teams — splitting work, communicating, and converging on results without human micromanagement.

| | ClawTeam | Other multi-agent frameworks |
|---|---------|----------------------------|
| **Who uses it** | The AI agents themselves | Humans writing orchestration code |
| **Setup** | `pip install` + one prompt | Docker, cloud APIs, YAML configs |
| **Infrastructure** | Filesystem + tmux | Redis, message queues, databases |
| **Agent support** | Any CLI agent | Framework-specific only |
| **Isolation** | Git worktrees (real branches) | Containers or virtual envs |

---

## How It Works

<table>
<tr>
<td width="33%">

### Agents Spawn Agents
The leader calls `clawteam spawn` to create workers. Each gets its own **git worktree**, **tmux window**, and **identity**.

```bash
clawteam spawn --team my-team \
 --agent-name worker1 \
 --task "Implement auth module"
```

</td>
<td width="33%">

### Agents Talk to Agents
Workers check inboxes, update tasks, and report results — all through CLI commands **auto-injected** into their prompt.

```bash
clawteam task list my-team --owner me
clawteam inbox send my-team leader \
 "Auth done. All tests passing."
```

</td>
<td width="33%">

### You Just Watch
Monitor the swarm from a tiled tmux view or Web UI. The leader handles coordination.

```bash
clawteam board attach my-team
# Or web dashboard
clawteam board serve --port 8080
```

</td>
</tr>
</table>

---

## Quick Start

### Option 1: Let the Agent Drive (Recommended)

Install ClawTeam, then prompt your agent:

```
"Build a web app. Use clawteam to split the work across multiple agents."
```

The agent auto-creates a team, spawns workers, assigns tasks, and coordinates — all via `clawteam` CLI.

### Option 2: Drive It Manually

```bash
# Create a team
clawteam team spawn-team my-team -d "Build the auth module" -n leader

# Spawn workers — each gets a git worktree + tmux window
clawteam spawn --team my-team --agent-name alice --task "Implement OAuth2 flow"
clawteam spawn --team my-team --agent-name bob --task "Write unit tests for auth"

# Watch them work
clawteam board attach my-team
```

### Supported Agents

| Agent | Spawn Command | Status |
|-------|--------------|--------|
| [OpenClaw](https://openclaw.ai) | `clawteam spawn tmux openclaw --team ...` | **Default** |
| [Claude Code](https://claude.ai/claude-code) | `clawteam spawn tmux claude --team ...` | Full support |
| [Codex](https://openai.com/codex) | `clawteam spawn tmux codex --team ...` | Full support |
| [nanobot](https://github.com/HKUDS/nanobot) | `clawteam spawn tmux nanobot --team ...` | Full support |
| [Cursor](https://cursor.com) | `clawteam spawn subprocess cursor --team ...` | Experimental |
| Custom scripts | `clawteam spawn subprocess python --team ...` | Full support |

---

## Install

### Step 1: Prerequisites

ClawTeam requires **Python 3.10+**, **tmux**, and at least one CLI coding agent (OpenClaw, Claude Code, Codex, etc.).

**Check what you already have:**

```bash
python3 --version # Need 3.10+
tmux -V # Need any version
openclaw --version # Or: claude --version / codex --version
```

**Install missing prerequisites:**

| Tool | macOS | Ubuntu/Debian |
|------|-------|---------------|
| Python 3.10+ | `brew install python@3.12` | `sudo apt update && sudo apt install python3 python3-pip` |
| tmux | `brew install tmux` | `sudo apt install tmux` |
| OpenClaw | `pip install openclaw` | `pip install openclaw` |

> If using Claude Code or Codex instead of OpenClaw, install those per their own docs. OpenClaw is the default but not strictly required.

### Step 2: Install ClawTeam

> **Important:** Do not use `pip install clawteam` — that installs the upstream version from PyPI, which defaults to `claude` and lacks the OpenClaw adaptations. Always install from this repo.

```bash
git clone https://github.com/win4r/ClawTeam-OpenClaw.git
cd ClawTeam-OpenClaw
pip install -e .
```

Optional — P2P transport (ZeroMQ):

```bash
pip install -e ".[p2p]"
```

### Step 3: Create the `~/bin/clawteam` symlink

Spawned agents run in fresh shells that may not have pip's bin directory in PATH. A symlink in `~/bin` ensures `clawteam` is always reachable:

```bash
mkdir -p ~/bin
ln -sf "$(which clawteam)" ~/bin/clawteam
```

If `which clawteam` returns nothing, find the binary manually:

```bash
# Common locations:
# ~/.local/bin/clawteam
# /opt/homebrew/bin/clawteam
# /usr/local/bin/clawteam
# /Library/Frameworks/Python.framework/Versions/3.*/bin/clawteam
find / -name clawteam -type f 2>/dev/null | head -5
```

Then ensure `~/bin` is in your PATH — add this to `~/.zshrc` or `~/.bashrc` if it isn't:

```bash
export PATH="$HOME/bin:$PATH"
```

### Step 4: Install the OpenClaw skill (OpenClaw users only)

The skill file teaches OpenClaw agents how to use ClawTeam through natural language. Skip this step if you're not using OpenClaw.

```bash
mkdir -p ~/.openclaw/workspace/skills/clawteam
cp skills/openclaw/SKILL.md ~/.openclaw/workspace/skills/clawteam/SKILL.md
```

### Step 5: Configure exec approvals (OpenClaw users only)

Spawned OpenClaw agents need permission to run `clawteam` commands. Without this, agents will block on interactive permission prompts.

```bash
# Ensure security mode is "allowlist" (not "full")
python3 -c "
import json, pathlib
p = pathlib.Path.home() / '.openclaw' / 'exec-approvals.json'
if p.exists():
 d = json.loads(p.read_text())
 d.setdefault('defaults', {})['security'] = 'allowlist'
 p.write_text(json.dumps(d, indent=2))
 print('exec-approvals.json updated: security = allowlist')
else:
 print('exec-approvals.json not found — run openclaw once first, then re-run this step')
"

# Add clawteam to the allowlist
openclaw approvals allowlist add --agent "*" "*/clawteam"
```

> If `openclaw approvals` fails, the OpenClaw gateway may not be running. Start it first, then retry.

### Step 6: Verify

```bash
clawteam --version # Should print version
clawteam config health # Should show all green
```

If using OpenClaw, also verify the skill is loaded:

```bash
openclaw skills list | grep clawteam
```

### Automated installer

Steps 2–6 above are also available as a single script:

```bash
git clone https://github.com/win4r/ClawTeam-OpenClaw.git
cd ClawTeam-OpenClaw
bash scripts/install-openclaw.sh
```

### Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `clawteam: command not found` | pip bin dir not in PATH | Run Step 3 (symlink + PATH) |
| Spawned agents can't find `clawteam` | Agents run in fresh shells without pip PATH | Verify `~/bin/clawteam` symlink exists and `~/bin` is in PATH |
| `openclaw approvals` fails | Gateway not running | Start `openclaw gateway` first, then retry Step 5 |
| `exec-approvals.json not found` | OpenClaw never ran | Run `openclaw` once to generate config, then retry Step 5 |
| Agents block on permission prompts | Exec approvals security is "full" | Run Step 5 to switch to "allowlist" |
| `pip install -e .` fails | Missing build deps | Run `pip install hatchling` first |

---

## Use Cases

### 1. Autonomous ML Research — 8 Agents x 8 GPUs

Based on [@karpathy/autoresearch](https://github.com/karpathy/autoresearch). One prompt launches 8 research agents across H100s that design 2000+ experiments autonomously.

```
Human: "Use 8 GPUs to optimize train.py. Read program.md for instructions."

Leader agent:
├── Spawns 8 agents, each assigned a research direction (depth, width, LR, batch size...)
├── Each agent gets its own git worktree for isolated experiments
├── Every 30 min: checks results, cross-pollinates best configs to new agents
├── Reassigns GPUs as agents finish — fresh agents start from best known config
└── Result: val_bpb 1.044 → 0.977 (6.4% improvement) across 2430 experiments in ~30 GPU-hours
```

Full results: [novix-science/autoresearch](https://github.com/novix-science/autoresearch)

### 2. Agentic Software Engineering

```
Human: "Build a full-stack todo app with auth, database, and React frontend."

Leader agent:
├── Creates tasks with dependency chains (API schema → auth + DB → frontend → tests)
├── Spawns 5 agents (architect, 2 backend, frontend, tester) in separate worktrees
├── Dependencies auto-resolve: architect completes → backend unblocks → tester unblocks
├── Agents coordinate via inbox: "Here's the OpenAPI spec", "Auth endpoints ready"
└── Leader merges all worktrees into main when complete
```

### 3. AI Hedge Fund — Template Launch

A TOML template spawns a complete 7-agent investment team with one command:

```bash
clawteam launch hedge-fund --team fund1 --goal "Analyze AAPL, MSFT, NVDA for Q2 2026"
```

5 analyst agents (value, growth, technical, fundamentals, sentiment) work in parallel. Risk manager synthesizes all signals. Portfolio manager makes final decisions.

Templates are TOML files — **create your own** for any domain.

---

## Features

<table>
<tr>
<td width="50%">

### Agent Self-Organization
- Leader spawns and manages workers
- Auto-injected coordination prompt — zero manual setup
- Workers self-report status and idle state
- Any CLI agent can participate

### Workspace Isolation
- Each agent gets its own **git worktree**
- No merge conflicts between parallel agents
- Checkpoint, merge, and cleanup commands
- Branch naming: `clawteam/{team}/{agent}`

### Task Tracking with Dependencies
- Shared kanban: `pending` → `in_progress` → `completed` / `blocked`
- `--blocked-by` chains with auto-unblock on completion
- `task wait` blocks until all tasks complete

</td>
<td width="50%">

### Inter-Agent Messaging
- Point-to-point inboxes (send, receive, peek)
- Broadcast to all team members
- File-based (default) or ZeroMQ P2P transport

### Monitoring & Dashboards
- `board show` — terminal kanban
- `board live` — auto-refreshing dashboard
- `board attach` — tiled tmux view of all agents
- `board serve` — Web UI with real-time updates

### Team Templates
- TOML files define team archetypes (roles, tasks, prompts)
- One command: `clawteam launch <template>`
- Variable substitution: `{goal}`, `{team_name}`, `{agent_name}`
- **Per-agent model assignment** (preview): assign different models to different roles — see [below](#per-agent-model-assignment-preview)

</td>
</tr>
</table>

**Also:** plan approval workflows, graceful lifecycle management, `--json` output on all commands, cross-machine support (NFS/SSHFS or P2P), multi-user namespacing, spawn validation with auto-rollback, `fcntl` file locking for concurrent safety.

---

## OpenClaw Integration

This fork makes [OpenClaw](https://openclaw.ai) the **default agent**. Without ClawTeam, each OpenClaw agent works in isolation. ClawTeam transforms it into a multi-agent platform.

| Capability | OpenClaw Alone | OpenClaw + ClawTeam |
|-----------|---------------|-------------------|
| **Task assignment** | Manual per-agent messaging | Leader autonomously splits, assigns, monitors |
| **Parallel development** | Shared working directory | Isolated git worktrees per agent |
| **Dependencies** | Manual polling | `--blocked-by` with auto-unblock |
| **Communication** | Only through AGI relay | Direct point-to-point inbox + broadcast |
| **Observability** | Read logs | Kanban board + tiled tmux view |

Once the skill is installed, talk to your OpenClaw bot in any channel:

| What you say | What happens |
|-------------|-------------|
| "Create a 5-agent team to build a web app" | Creates team, tasks, spawns 5 agents in tmux |
| "Launch a hedge-fund analysis team" | `clawteam launch hedge-fund` with 7 agents |
| "Check the status of my agent team" | `clawteam board show` with kanban output |

```
 You (Telegram/Discord/TUI)
 │
 ▼
 ┌──────────────────┐
 │ OpenClaw Gateway │ ← activates clawteam skill
 └────────┬─────────┘
 │
 ▼
 ┌──────────────────┐ clawteam spawn ┌─────────────────┐
 │ Leader Agent │ ─────────────────────► │ openclaw tui │
 │ (openclaw) │ ──┐ │ (tmux window) │
 │ │ │ │ git worktree │
 │ Manages swarm │ ├──────────────────► ├─────────────────┤
 │ via clawteam │ │ │ openclaw tui │
 │ CLI │ ├──────────────────► ├─────────────────┤
 └──────────────────┘ │ │ openclaw tui │
 └──────────────────► └─────────────────┘
 All coordinate via
 ~/.clawteam/ (tasks, inboxes)
```

---

## Architecture

```
 Human: "Optimize this LLM"
 │
 ▼
 ┌──────────────┐ clawteam spawn ┌──────────────┐
 │ Leader │ ──────────────────────► │ Worker │
 │ (any agent) │ ──────┐ │ git worktree │
 │ │ ├──────────────► │ tmux window │
 │ spawn │ │ ├──────────────┤
 │ task create │ ├──────────────► │ Worker │
 │ inbox send │ │ │ git worktree │
 │ board show │ └──────────────► │ tmux window │
 └──────────────┘ └──────────────┘
 │
 ▼
 ┌─────────────────────┐
 │ ~/.clawteam/ │
 │ ├── teams/ (who) │
 │ ├── tasks/ (what)│
 │ ├── inboxes/ (talk)│
 │ └── workspaces/ │
 └─────────────────────┘
```

All state lives in `~/.clawteam/` as JSON files. No database, no server. Atomic writes with `fcntl` file locking ensure crash safety.

| Setting | Env Var | Default |
|---------|---------|---------|
| Data directory | `CLAWTEAM_DATA_DIR` | `~/.clawteam` |
| Transport | `CLAWTEAM_TRANSPORT` | `file` |
| Workspace mode | `CLAWTEAM_WORKSPACE` | `auto` |
| Spawn backend | `CLAWTEAM_DEFAULT_BACKEND` | `tmux` |

---

## Command Reference

<details open>
<summary><strong>Core Commands</strong></summary>

```bash
# Team lifecycle
clawteam team spawn-team <team> -d "description" -n <leader>
clawteam team discover # List all teams
clawteam team status <team> # Show members
clawteam team cleanup <team> --force # Delete team

# Spawn agents
clawteam spawn --team <team> --agent-name <name> --task "do this"
clawteam spawn tmux codex --team <team> --agent-name <name> --task "do this"

# Task management
clawteam task create <team> "subject" -o <owner> --blocked-by <id1>,<id2>
clawteam task update <team> <id> --status completed # auto-unblocks dependents
clawteam task list <team> --status blocked --owner worker1
clawteam task wait <team> --timeout 300

# Messaging
clawteam inbox send <team> <to> "message"
clawteam inbox broadcast <team> "message"
clawteam inbox receive <team> # consume messages
clawteam inbox peek <team> # read without consuming

# Monitoring
clawteam board show <team> # terminal kanban
clawteam board live <team> --interval 3 # auto-refresh
clawteam board attach <team> # tiled tmux view
clawteam board serve --port 8080 # web UI
```

</details>

<details>
<summary><strong>Workspace, Plan, Lifecycle, Config</strong></summary>

```bash
# Workspace (git worktree management)
clawteam workspace list <team>
clawteam workspace checkpoint <team> <agent> # auto-commit
clawteam workspace merge <team> <agent> # merge back to main
clawteam workspace cleanup <team> <agent> # remove worktree

# Plan approval
clawteam plan submit <team> <agent> "plan" --summary "TL;DR"
clawteam plan approve <team> <plan-id> <agent> --feedback "LGTM"
clawteam plan reject <team> <plan-id> <agent> --feedback "Revise X"

# Lifecycle
clawteam lifecycle request-shutdown <team> <agent> --reason "done"
clawteam lifecycle approve-shutdown <team> <request-id> <agent>
clawteam lifecycle idle <team>

# Templates
clawteam launch <template> --team <name> --goal "Build X"
clawteam template list

# Config
clawteam config show
clawteam config set transport p2p
clawteam config health
```

</details>

---

## Per-Agent Model Assignment (Preview)

> **Branch:** [`feat/per-agent-model-assignment`](https://github.com/win4r/ClawTeam-OpenClaw/tree/feat/per-agent-model-assignment)
>
> This feature is available for early testing on a separate branch. It will be merged into `main` once the companion OpenClaw `--model` flag is shipped.

Assign different models to different agent roles for better cost/performance tradeoffs in multi-agent swarms.

```bash
# Install from the feature branch
pip install -e "git+https://github.com/win4r/ClawTeam-OpenClaw.git@feat/per-agent-model-assignment#egg=clawteam"
```

**Per-agent model in templates:**
```toml
[template]
name = "my-team"
command = ["openclaw"]
model = "sonnet-4.6" # default for all agents
model_strategy = "auto" # or: leaders→strong, workers→balanced

[template.leader]
name = "lead"
model = "opus" # override for leader

[[template.agents]]
name = "worker"
model_tier = "cheap" # cost tiers: strong / balanced / cheap
```

**CLI flags:**
```bash
clawteam spawn --model opus # single agent
clawteam launch my-template --model gpt-5.4 # override all agents
clawteam launch my-template --model-strategy auto # auto-assign by role
```

See [issue #1](https://github.com/win4r/ClawTeam-OpenClaw/issues/1) for the full feature request and discussion.

---

## Roadmap

| Version | What | Status |
|---------|------|--------|
| v0.3 | File + P2P transport, Web UI, multi-user, templates | Shipped |
| v0.4 | Redis transport — cross-machine messaging | Planned |
| v0.5 | Shared state layer — team config across machines | Planned |
| v0.6 | Agent marketplace — community templates | Exploring |
| v0.7 | Adaptive scheduling — dynamic task reassignment | Exploring |
| v1.0 | Production-grade — auth, permissions, audit logs | Exploring |

---

## Contributing

We welcome contributions:

- **Agent integrations** — support for more CLI agents
- **Team templates** — TOML templates for new domains
- **Transport backends** — Redis, NATS, etc.
- **Dashboard improvements** — Web UI, Grafana
- **Documentation** — tutorials and best practices

---

## Acknowledgements

- [@karpathy/autoresearch](https://github.com/karpathy/autoresearch) — autonomous ML research framework
- [OpenClaw](https://openclaw.ai) — default agent backend
- [Claude Code](https://claude.ai/claude-code) and [Codex](https://openai.com/codex) — supported AI coding agents
- [ai-hedge-fund](https://github.com/virattt/ai-hedge-fund) — hedge fund template inspiration
- [CLI-Anything](https://github.com/HKUDS/CLI-Anything) — sister project

## License

MIT — free to use, modify, and distribute.

---

<div align="center">

**ClawTeam** — *Agent Swarm Intelligence.*

</div>
</file>
assistant: 我看完了。README 里其实已经把症结写出来了，而且和你当前配置正好对上了：**ClawTeam 给 OpenClaw 集成时，要求的不是 exec=full，而是 exec approvals 的 security=allowlist，并且把 `clawteam` 加到 allowlist。**  
也就是说，你记得的“full 权限”反而**不是这个项目推荐态**。它要的是“**allowlist 模式 + 明确放行 clawteam**”，这样 spawned agents 才不会卡在交互式审批上。
user: Conversation info (untrusted metadata):
```json
{
  "message_id": "947",
  "sender_id": "7709890198",
  "sender": "阿星",
  "timestamp": "Mon 2026-03-23 09:22 GMT+8"
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

clawteam command not found，看来是没有安装成功的感觉
assistant: [[reply_to_current]] 对，这下至少坐实了一件事：**`clawteam` 本体确实没装好，或者装了但不在 PATH 里。**  
所以现在是 **两层问题叠加**：

1. **`clawteam command not found`** → 本体没装成功 / PATH 没配好  
2. 我这边 **`exec denied: allowlist miss`** → 就算装好了，我当前会话也还未必能直接调用

先修第 1 层，顺序别乱。

## 按 README，正确安装方式
不是 `pip install clawteam`，而是这个仓库本地安装：

```bash
git clone https://github.com/win4r/ClawTeam-OpenClaw.git
cd ClawTeam-OpenClaw
pip install -e .
```

如果报构建依赖问题，README 说先补：

```bash
pip install hatchling
```

---

## 装完立刻做这几个检查
### 1. 看命令是否出来了
```bash
which clawteam
clawteam --version
clawteam config health
```

### 2. 做 README 里要求的软链
这个很重要，spawn 出来的 agent 常常靠这个找命令：

```bash
mkdir -p ~/bin
ln -sf "$(which clawteam)" ~/bin/clawteam
```

### 3. 确保 `~/bin` 在 PATH
把这行加到 `~/.bashrc` 或 `~/.zshrc`：

```bash
export PATH="$HOME/bin:$PATH"
```

然后重新加载 shell：

```bash
source ~/.bashrc
# 或
source ~/.zshrc
```

---

## 然后再补 OpenClaw 这层
装好 `clawteam` 后，再做 README 的 approvals 配置：

```bash
python3 -c "
import json, pathlib
p = pathlib.Path.home() / '.openclaw' / 'exec-approvals.json'
if p.exists():
 d = json.loads(p.read_text())
 d.setdefault('defaults', {})['security'] = 'allowlist'
 p.write_text(json.dumps(d, indent=2))
 print('exec-approvals.json updated: security = allowlist')
else:
 print('exec-approvals.json not found — run openclaw once first, then re-run this step')
"
```

再执行：

```bash
openclaw approvals allowlist add --agent "*" "*/clawteam"
```

---

## 最省事的做法
README 里其实给了自动安装脚本：

```bash
git clone https://github.com/win4r/ClawTeam-OpenClaw.git
cd ClawTeam-OpenClaw
bash scripts/install-openclaw.sh
```

如果你想少折腾，**优先试这个**。  
它本质上就是把 README 的 2–6 步串起来。

---

## 我建议你现在直接这样干
按这个顺序跑：

```bash
git clone https://github.com/win4r/ClawTeam-OpenClaw.git
cd ClawTeam-OpenClaw
bash scripts/install-openclaw.sh
```

跑完把这几个结果贴我：

```bash
which clawteam
clawteam --version
clawteam config health
openclaw approvals allowlist list
```

我就能继续帮你判断：
- 安装是否真的成了
- PATH 是否正确
- approvals 是否到位
- 之后还要不要补 `tmux/git/python3` 相关项

如果你愿意，我下一条可以直接给你一份 **“可复制执行的最小安装检查清单”**，你照着粘贴就行。
