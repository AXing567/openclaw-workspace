# OpenClaw Heartbeat Card: Night Termination Rule

## Rule

During local deep-night hours (23:00-08:00), a heartbeat-driven self-learning turn should prefer a single tiny artifact, then stop.

## Why

If the agent treats every quiet heartbeat as permission to keep expanding nearby topics, it creates low-value drift: many tiny docs, repeated micro-refinements, and unnecessary repo churn.

## Practical test

If all of these are true:
- no urgent user-facing need exists
- the current heartbeat instruction is generic self-improvement
- one local note/card/log has already been produced in this turn or the immediately previous deep-night turn

Then the safest default is: do nothing further.

## Preferred outputs

In priority order:
1. no-op (`HEARTBEAT_OK`)
2. one short daily log note
3. one short rule/card

Not preferred:
- multi-card bursts
- exploratory web research
- noisy repo-wide reshaping
- any external action

## Heuristic

At night, optimize for restraint, not coverage.
