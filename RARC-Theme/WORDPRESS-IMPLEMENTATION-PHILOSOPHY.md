# RARC Theme WordPress Implementation Philosophy

## Purpose

This document is a practical handoff for future developers and future LLMs working on `RARC-Theme`.

It explains how the theme is meant to work inside WordPress, why certain architectural choices were made, and what editing behaviors are considered intentional rather than accidental.

This is not just a design note. It is meant to preserve implementation habits.

## Core Goal

`RARC-Theme` should behave like a guided publishing system.

The target is not "maximum Gutenberg flexibility."

The target is:

- editors can build pages from reliable section modules
- repeated branded objects own their markup and behavior
- the backend preview stays close to the frontend result
- important page structures are visible and editable without forcing editors to reverse-engineer layout

In short: high-confidence authoring beats abstract flexibility.

## WordPress Architecture Model

The theme uses a hybrid block-theme approach.

That means:

- templates still matter
- patterns still matter
- custom server-rendered blocks still matter
- editor CSS and frontend CSS both matter

The system is not trying to prove purity in one direction.

Instead, it uses whichever WordPress mechanism best preserves the intended editing model.

## Source Of Truth Hierarchy

When deciding where behavior should live, use this order of preference:

1. content blocks or patterns when editors need to directly edit the object in page content
2. template markup when the structure is truly shell-level and should not be per-page editable
3. server-rendered custom blocks when repeated branded objects need stable markup contracts
4. editor-specific CSS or JS only when the frontend structure already exists and the editor needs fidelity help

## Patterns And Blocks: How They Interplay

Patterns are the main section-level authoring units.

Blocks are the main component-level authoring units.

That means:

- patterns provide section composition
- blocks provide owned reusable objects inside those sections

Examples:

- a homepage section pattern may contain several `rarc/card` blocks
- a utility section pattern may contain `rarc/sidebar-card` blocks
- a hero pattern may contain a `rarc/hero-carousel` block
- an info-list section pattern may contain multiple `rarc/info-row` blocks

The pattern gives structure.
The block gives behavior and markup stability.

## When To Use A Pattern

Use a pattern when the editor should insert a coherent section in one action.

Good pattern use cases:

- homepage bands
- utility/map/share sections
- editorial text-plus-image sections
- interior story modules
- CTA bands
- reusable hero starters

Patterns should not be giant page-sized mega-layouts.

Each major section from the original flat HTML was meant to become its own editorial module.

## When To Use A Custom Block

Use a custom block when:

- the component is branded and repeated
- markup needs to stay stable across contexts
- optional states need deliberate handling
- editor fields should edit content, not reconstruct structure

Current custom blocks exist for exactly this reason:

- `rarc/hero-carousel`
- `rarc/card`
- `rarc/card-grid`
- `rarc/carousel`
- `rarc/info-row`
- `rarc/sidebar-card`
- `rarc/story-preview`

## Why `rarc/card-grid` Exists

`rarc/card-grid` is a good example of the overall philosophy.

Originally, a plain `core/group` grid was used for the hobby-intro card area.

That was not enough because editors needed:

- visible in-grid add-card affordances
- reliable append behavior
- empty-cell add tiles in partial rows
- grid behavior that stayed legible in the editor

So a light custom container block was introduced.

This is acceptable when the default WordPress container UX is too subtle for the intended editing model.

## Homepage Vs Interior Page Rule

This is one of the most important current rules.

- if a page is the assigned front page, its first hero must be the editable `home-hero`
- if a page is not the assigned front page, its first hero must be the editable `interior-page-hero`

Important details:

- these hero systems must be editable in page content
- they should not become static, hardcoded template-shell substitutes
- synchronization logic can enforce the first hero block, but the block markup must remain directly editable in the page editor

## Homepage Workflow

The homepage is not a fixed stack of hardcoded theme sections.

Instead:

- `front-page.html` renders the assigned page's post content
- the assigned front page stays editable like a normal page
- the homepage simply uses a different hero block at the top

This allows homepage editing to stay consistent with interior-page editing.

## Hero Implementation Philosophy

There are two distinct hero systems:

- interior hero: static background image behavior driven by the page featured image
- home hero: rotating carousel hero used on the homepage only

Both need to satisfy two goals at the same time:

- render correctly on the frontend
- remain visible and editable in the backend editor

Future work should not accept a tradeoff where one of those works but the other does not.

## Full-Width Content Breakout Rule

WordPress often nests block content inside constrained wrappers.

This means an `alignfull` block is not automatically full-width in practice unless the theme supplies the right breakout behavior.

The theme therefore includes explicit breakout rules for:

- full-width hero sections inside post content
- full-width homepage hero blocks inside post content
- other alignfull content that needs to escape the prose column

If a future section looks centered or narrow when it should be full-width, assume a breakout/layout rule is missing before assuming the block itself is wrong.

## Pattern Serialization Rules

Pattern validity is fragile and must be treated seriously.

The editor should not require recovery after pattern insertion.

Current rules:

- if a block declares `anchor`, the wrapper HTML must contain the matching `id`
- if a `core/group` block declares a layout, the wrapper HTML must carry the matching `is-layout-*` and `wp-block-group-is-layout-*` classes
- pattern wrappers must close correctly; one missing closing wrapper can invalidate the whole section
- avoid stale wrapper assumptions like removed `wp-block-group__inner-container` markup

If WordPress offers recovery on insert, the pattern source should usually be considered wrong.

## Native Blocks Versus Raw HTML

Prefer native blocks inside patterns whenever possible.

Why:

- native blocks are more stable in the editor
- they expose editing controls naturally
- they are less likely to be reparsed unexpectedly

Use raw `wp:html` only when necessary.

This lesson came up repeatedly with CTA rows and utility sections.

Where native buttons or groups can be used, they usually should be.

## CTA Philosophy

CTAs are a family, not isolated one-offs.

Current behavior expectations:

- semantic icon treatment belongs to the CTA family
- variants should be deliberate, not ad hoc
- native link picker should be used for destinations in editor UI
- editors should be able to add or remove repeated CTAs in places like cards and the home hero

Current implementation examples:

- cards support repeatable CTA stacks
- hero carousel supports repeatable CTA actions
- sidebar cards support either a linked action or share action
- some section patterns still use native `core/button` blocks when that produces a better editing experience than raw HTML

## Card Philosophy

Cards are content models, not generic visual wrappers.

Current card expectations:

- stable anatomy
- consistent region names
- optional images handled intentionally
- repeatable CTA stacks when needed
- visible variant differences in the editor

The card variants must feel like one system even when used in different contexts.

## Sidebar Utility Philosophy

Sidebar utility stacks are a distinct editorial object.

They are not full-width cards.

They should:

- preview as narrow vertical stacks in the editor
- support ad-hoc add/remove behavior
- be reusable in interior pages and in homepage utility layouts where appropriate

This is why the directions/share right rail was moved toward the same sidebar-card system.

## Editor Fidelity Strategy

The editor is expected to show something close to the final output.

The strategy is:

- load frontend CSS into block-editor content explicitly
- layer editor-specific adjustments on top
- correct DOM differences with targeted editor rules
- make placeholders, appender tiles, badges, and helper states visible in the canvas

Do not settle for generic editor placeholders if the published design has a strong component identity.

## Sidebar Metadata Vs Canvas Editing

The theme intentionally splits editing responsibilities between the sidebar and the canvas.

General rule:

- edit actual content slots in the canvas when possible
- keep structural or secondary metadata in the sidebar when it would clutter the canvas

Examples:

- headings, labels, supporting copy, and CTA labels are usually edited in-canvas
- link destinations, slide management, image credit, action variants, and repeatable control structure often live in the sidebar

This is not arbitrary. It is meant to keep the editing surface readable while still giving access to the necessary metadata.

## Add / Remove Affordance Philosophy

Where repeated items exist, editors should not have to hunt for hidden inserters.

Current expectations:

- card grids show visible add-card tiles
- repeated CTA lists expose add/remove controls in the inspector and preview in the canvas
- hero slides expose add/remove controls in the sidebar
- button groups should use native button-group editing where WordPress already provides good affordances
- sidebar stacks should have visible vertical add-item affordances when feasible

The rule is simple: repeated editorial objects need obvious add/remove pathways.

## Patterns Menu Philosophy

The pattern categories exist as browse aids, not as behavior switches.

They currently separate patterns into:

- home sections
- interior sections
- utility sections
- all RARC patterns

These categories do not change rendering.
They only organize pattern discovery.

Future simplification is acceptable if the current grouping feels redundant, but the intent is to support page-type and function-based browsing.

## Build And Commit Workflow

The build workflow is part of the implementation contract.

Rules:

- build with `build-theme.ps1`
- each build increments the patch version in `style.css`
- the ZIP is a build artifact and should not be committed
- after each intentional build, commit the matching source state so repo history and version numbers stay aligned

## What Future LLMs Should Preserve

If you are a future LLM working in this repo, preserve these behaviors unless the user explicitly wants to change them:

- homepage editable as page content, not a hardcoded static front-page template composition
- front page gets editable `home-hero`, other pages get editable `interior-page-hero`
- full-width heroes really break out of constrained content wrappers
- patterns insert valid block serialization without recovery prompts
- custom blocks own repeated branded markup contracts
- card grids and sidebar stacks expose visible add/remove affordances
- editor fidelity is treated as a product requirement, not a nice-to-have
- link destinations use native WordPress linking controls in custom block inspectors

These are the most important implementation fingerprints currently established in `RARC-Theme`.
