---
name: amazon-seller-research
description: Find, prioritize, and prepare semi-automated user research with Amazon sellers. Use when the user wants to identify Amazon sellers by size, business model, category, marketplace, region, or brand style; build a lead list from public sources; design outreach and interview questions; screen candidates; and synthesize seller feedback into usable insights. NOT for autonomous bulk outreach, spam, private-data scraping, or pretending external contact already happened.
---

# Amazon Seller Research

Run a semi-automated research workflow for finding and interviewing Amazon sellers.

## Principles

- Optimize for real signal, not list size.
- Prefer public, attributable sources.
- Separate assumptions from observed facts.
- Do not claim outreach, interviews, or replies happened unless they actually happened.
- Do not invent seller attributes that were not found.
- Keep external-contact actions behind explicit user approval.

## Inputs to collect

Collect only what is needed to start. If details are missing, make the smallest reasonable assumptions and label them.

Use this intake structure:

- Research objective
- Seller profile to target
- Exclusion criteria
- Geography / marketplace
- Language
- Desired sample size
- Contact channels allowed
- Whether the user wants only a list, a research kit, or both
- Output format preference

Translate vague requests into an operational target segment.

Examples:

- “Find small Amazon sellers” → revenue proxy, review-count proxy, catalog size proxy, marketplace, and category.
- “Find brand sellers” → seller owns brand site, branded storefront, off-Amazon presence, or trademark cues.
- “Find铺货卖家” → large catalog, weak brand identity, many adjacent SKUs, repeated generic listing patterns.

## Standard workflow

### 1) Define the sample

Turn the request into a screenable spec.

Include:

- Core segment definition
- Nice-to-have traits
- Hard exclusions
- Evidence signals to look for
- Confidence rules: high / medium / low confidence

When user criteria are fuzzy, produce a short “working definition” first and proceed with it.

### 2) Build a source map

Use public-source categories such as:

- Amazon storefronts and listings
- Brand websites
- LinkedIn company pages
- Public business directories
- Founder interviews, podcasts, press, newsletters
- Communities or public profiles where sellers discuss operations

For each source type, note:

- What signal it can provide
- What it cannot prove
- How to use it without overclaiming

### 3) Build the lead list

Create a lead table with one row per candidate.

Minimum columns:

- seller_name
- brand_name
- amazon_marketplace
- category
- seller_type_hypothesis
- size_hypothesis
- evidence
- source_urls
- public_contact_route
- fit_score
- confidence
- notes

Scoring guidance:

- 5 = excellent fit, strong evidence, reachable
- 4 = likely fit, enough evidence to test
- 3 = possible fit, needs manual review
- 2 = weak fit
- 1 = keep only if sample is too small

### 4) Prepare the research kit

Always prepare both of these unless the user says otherwise:

#### A. Outreach kit

Generate:

- One short initial outreach message
- One slightly warmer variant
- One follow-up message
- One screener message for qualifying fit quickly

Keep messages:

- short
- specific
- respectful
- non-spammy
- easy to ignore or answer

Do not promise incentives unless the user explicitly approved one.

#### B. Interview kit

Generate:

- Research hypothesis list
- 6–10 interview questions
- 3–5 follow-up probes
- Red-flag questions to avoid
- What evidence would confirm / disconfirm the hypothesis

Prefer open questions about:

- current workflow
- pain points
- workarounds
- buying triggers
- distrust / objections
- economics and tradeoffs

Avoid leading questions that smuggle in the answer.

### 5) Synthesize findings

When the user provides replies or interview notes, convert them into a structured synthesis.

Output sections:

- Top pain points
- Jobs-to-be-done language
- Current alternatives
- Buying blockers
- Willingness-to-pay clues
- Segment differences
- Recommended next test
- Verbatim quotes

Distinguish:

- direct quote
- inferred interpretation
- analyst recommendation

## Operating modes

### Mode A: List only

Deliver:

- target definition
- lead table
- short comments on source quality

### Mode B: Research kit only

Deliver:

- target definition
- outreach kit
- screener
- interview guide
- note-taking template

### Mode C: Full semi-automated package

Deliver:

- target definition
- prioritized lead table
- outreach kit
- interview guide
- synthesis template
- next-step checklist

## Output templates

If no user format is specified, use compact markdown with bullets and simple tables.

### Research brief template

Use this structure:

1. Objective
2. Target seller definition
3. Inclusion / exclusion criteria
4. Search strategy
5. Candidate leads
6. Outreach copy
7. Interview guide
8. Risks / assumptions
9. Recommended next action

### Lead note format

For each strong lead, summarize in 3–5 bullets:

- Why this seller appears to fit
- What evidence supports the classification
- What is uncertain
- Best public contact route

## Quality bar

Before finishing, check:

- Is each seller matched to the requested segment for a stated reason?
- Are evidence and uncertainty both visible?
- Are outreach messages short enough to send?
- Are interview questions non-leading?
- Is anything phrased as fact when it is only a hypothesis?

## Safety and boundaries

- Do not do autonomous mass outreach.
- Do not scrape private data or evade platform limits.
- Do not fabricate interview results.
- Do not impersonate the user without explicit approval.
- Ask before any external action that leaves the machine.

## Optional reference

Read `references/templates.md` when you need ready-made intake forms, lead-table schema, outreach templates, interview guides, or synthesis formats.
