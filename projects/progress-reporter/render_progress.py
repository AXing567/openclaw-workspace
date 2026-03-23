#!/usr/bin/env python3
import json
from pathlib import Path
p = Path('/home/ax/.openclaw/workspace/state/current-task.json')
if not p.exists():
    print('当前没有活跃任务。')
    raise SystemExit(0)
obj = json.loads(p.read_text())
msg = []
msg.append(f"任务：{obj.get('task','未命名任务')}")
msg.append(f"状态：{obj.get('status','unknown')}")
msg.append(f"阶段：{obj.get('phase','未说明')}")
current = obj.get('current')
if current:
    msg.append(f"当前：{current}")
done = obj.get('done') or []
if done:
    msg.append("已完成：" + "；".join(done[-2:]))
blocked = obj.get('blocked')
if blocked:
    msg.append(f"阻塞：{blocked}")
print("\n".join(msg))
