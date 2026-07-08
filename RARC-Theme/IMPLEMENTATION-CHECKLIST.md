# RARC Theme Implementation Checklist

## Purpose

This checklist turns `AGENT.md` into build guidance for `RARC-Theme`.

Use it when revising blocks, patterns, templates, editor styles, and section architecture so the finished theme carries the same implementation fingerprints as the client's preferred reference theme.

The goal is not visual imitation.

The goal is that a client can compare the two themes and feel they were made by the same developer or team.

## Definition Of Success

`RARC-Theme` is successful when:

- the editor feels guided instead of blank
- complex page segments are inserted as modules instead of manually assembled
- cards, CTA links, and buttons feel self-owned and branded
- placeholders explain what goes where
- front-end and editor presentation feel closely related
- repeated UI objects share one grammar across contexts
- the theme reduces editorial uncertainty
- the implementation follows the preferred reference authoring model more closely than it follows pure FSE or block-theme ideology

## Architecture Rule

Do not treat full-site-editing purity as a success condition by itself.

Use whichever WordPress implementation approach best preserves:

- modular page sections
- self-contained cards and CTA objects
- guided in-canvas editing
- strong editor/front-end parity
- recognizable implementation fingerprints

## Non-Negotiable Fingerprints

Every major implementation decision should preserve these fingerprints:

- stable component anatomy
- self-contained rendered markup for branded UI objects
- modular page sections
- visible in-canvas authoring guidance
- CTA consistency across hero, cards, utility areas, and navigation-adjacent contexts
- card consistency across landing, story, archive-like, and utility contexts
- predictable variants instead of improvised one-offs
- editor parity with front-end spacing and scale

## Global Review Questions

Before shipping any major change, ask:

- does this feel like an owned system or a loose Gutenberg assembly?
- would a client recognize the same developer fingerprints here?
- does the editor understand the module without extra explanation?
- is the empty state informative?
- does the component preserve shape when optional fields are missing?
- is the same object reusable in more than one context?

## Phase 1: Editing Model

### 1. Page structure

- ensure core page experiences begin from patterns or structured defaults, not blank composition
- review whether `front-page`, interior pages, and field-guide-like layouts open with useful starter structures
- add or strengthen pattern locking where layout stability matters
- keep prose regions open where editorial freedom is appropriate
- do not seed recursive `post-content` patterns into new page content
- when homepage/interior hero systems need to stay editable, seed real block markup into page content rather than uneditable template-shell stand-ins
- enforce the homepage vs interior hero choice explicitly: front page gets `home-hero`, other pages get `interior-page-hero`

### 2. In-canvas guidance

- add meaningful placeholder text to all high-value custom blocks
- ensure placeholders reflect actual slot purpose, not generic filler
- make heading placeholders read like heading slots
- make supporting-copy placeholders read like supporting-copy slots
- make CTA placeholders read like action labels
- make media and optional metadata areas obvious in empty state

### 3. Editor parity

- audit editor CSS against front-end CSS for all custom blocks and major sections
- ensure cards preview at believable width, height, image ratio, and spacing
- ensure CTA buttons and links preview with realistic padding, casing, and hierarchy
- ensure section spacing in editor is close enough to support real page composition decisions
- avoid editor-only fallback visuals that materially misrepresent final output
- load frontend CSS into the editor explicitly; do not rely on a weak editor-only approximation
- ensure sidebar-card previews stay visually narrow like a sidebar stack instead of stretching to content width
- ensure hero previews use hero-specific structures in the editor, not generic image placeholders that change scale or alignment

## Phase 2: CTA System

### 4. Create one CTA family

- define a shared CTA grammar for `RARC-Theme`
- separate plain branded buttons from inline CTA links, but keep them visibly related
- standardize label/icon relationships where icons are used
- standardize variant naming across all CTA uses

Recommended family:

- primary pill CTA
- outline pill CTA
- inline directional CTA link
- utility CTA list item
- share CTA
- external CTA state

### 5. Own the markup

- avoid relying on `core/button` styling alone as the main CTA solution
- prefer a dedicated rendered CTA block, block variation family, or tightly controlled pattern contract
- ensure CTA markup can support shared label/icon behavior across contexts
- ensure hover, active, focus, and loading states belong to the component itself

### 6. Normalize CTA contexts

- audit hero actions
- audit card CTAs
- audit utility/share actions
- audit any footer or header utility actions
- audit sidebar button behavior

For each context, verify:

- spacing matches the family
- typography matches the family
- variants behave consistently
- icon behavior is not bespoke unless intentionally different

### 7. CTA empty states and editing UI

- in custom blocks, expose CTA labels and URLs in a way that is easy to edit without hunting through panels
- prefer visible in-canvas editing where possible
- keep inspector controls for variants and secondary options, not as the only place basic authoring happens
- if a CTA can be optional, ensure the layout still reads correctly when omitted
- prefer the native WordPress link picker over plain URL text inputs for CTA destinations

## Phase 3: Card System

### 8. Replace the idea of one generic card with a card family

- treat cards as a system, not a single block with too many jobs
- identify which cards are primary editorial objects in `RARC-Theme`
- define which variants deserve first-class support

Recommended card family:

- image-led preview card
- text-first info card
- utility/sidebar card
- story teaser card
- horizontal preview card for archive-like layouts

### 9. Standardize anatomy

Every card type should have a stable internal anatomy where applicable:

- wrapper
- optional eyebrow or kicker
- headline region
- optional subheadline region
- optional excerpt or supporting-copy region
- media region
- CTA region
- optional metadata region

The exact regions can vary by card type, but the system should be deliberate and named.

### 10. Handle optional states intentionally

- define missing-image behavior
- define no-CTA behavior
- define no-subheadline behavior
- define metadata-present behavior
- define metadata-absent behavior
- ensure each card still looks resolved in those states

### 11. Make cards editor-friendly

- add in-canvas placeholders for each major content slot
- keep image selection simple
- expose variant selection cleanly
- avoid requiring nested arbitrary blocks to complete a card
- avoid requiring editors to manually rebuild card rhythm
- if a repeated grid needs clearer add-item behavior than core containers provide, use a light custom container block such as `rarc/card-grid`

### 12. Support reuse across contexts

- ensure card markup and styling can support homepage use
- ensure it can support interior/story use
- ensure it can support archive-like listing use when needed
- ensure any dynamic rendering can reuse the same grammar as static pattern usage

## Phase 4: Page Sections

### 13. Treat sections as products

- each major page section should feel like a coherent editorial module
- each section should have a clear purpose, internal rhythm, and insertion value
- avoid sections that are only wrappers around unrelated generic blocks

### 14. Build or refine the main section inventory

Review and strengthen these section types:

- hero section
- card grid section
- editorial text plus image section
- event teaser section
- recent stories section
- carousel story module section
- utility section for map/share/contact/directions
- interior content section with sidebar stack
- slim CTA band

For each section, verify:

- it has a clear section-level placeholder hierarchy
- it uses self-contained cards or CTAs where appropriate
- it previews credibly in editor
- it does not depend on manual spacer cleanup

### 15. Lock what should stay stable

- lock section composition where the structure is part of the theme's identity
- leave text and image content editable
- only allow freeform inner blocks where open editorial composition is actually desired
- if a section repeatedly triggers WordPress recovery on insertion, treat that as a serialization bug and fix the pattern source rather than tolerating it

### 16. Prevent section drift

- do not create many near-duplicate sections with minor styling differences
- prefer strong reusable sections with small variant controls
- preserve a recognizable page rhythm across homepage and interior modules

## Phase 5: Templates And Shell

### 17. Header and footer

- review whether header and footer feel too generic compared with the target fingerprints
- strengthen utility action treatment if needed
- ensure branded CTA language can appear here without becoming bespoke
- preserve simplicity, but make the shell feel intentionally authored

### 18. Template defaults

- review `front-page.html`, `page.html`, `single.html`, and any field-guide templates
- ensure defaults support the modular section philosophy
- avoid templates that dump editors into low-structure layouts unless that is deliberate
- the front page should render editable page content, not a fixed stack of hardcoded theme sections

### 19. Interior content strategy

- keep post body prose comparatively open
- keep repeated storytelling modules bounded and reusable
- use section-level support around content rather than forcing every page through one generic content shell

## Phase 6: Block Implementation Standards

### 20. When to use a custom rendered block

Use a rendered block when:

- markup needs to stay exact
- the component is highly branded
- optional states need tight control
- the component repeats across contexts

### 21. Pattern serialization sanity checks

- if a block comment declares `anchor`, ensure the wrapper HTML contains the matching `id`
- if a `core/group` block declares a layout, ensure the wrapper HTML contains the expected layout classes including block-specific variants such as `wp-block-group-is-layout-*`
- prefer native blocks over raw `wp:html` in reusable patterns when the structure can be expressed natively
- verify that every opened wrapper closes correctly; one missing closing wrapper can invalidate the whole section
- treat WordPress recovery prompts as a defect in source markup, not a normal editing step

### 22. Build discipline

- use `build-theme.ps1` when creating the upload ZIP
- let the build script increment the patch version in `style.css`
- after an intentional build, create a normal git commit for the source changes that produced that build
- keep documentation aligned with the actual build workflow and current versioning policy
- verify that the ZIP contains a top-level `RARC-Theme/` directory and normalized forward-slash entry paths before assuming a remote install failure is a theme-code issue
- the editor should edit fields instead of nested structure

This likely applies to:

- CTA objects
- cards
- carousel story modules
- utility cards
- hero actions

### 21. When to use patterns instead

Use patterns when:

- the structure is mostly fixed
- the authoring need is section composition, not field-level object behavior
- the section combines multiple known objects into a coherent module

This likely applies to:

- homepage section assembly
- interior page assembly
- CTA bands
- editorial text-plus-image bands

### 22. Inspector vs canvas authoring

- keep foundational copy editing in canvas where possible
- keep variant choices and secondary settings in inspector panels
- do not bury primary authoring behind inspector-only controls if an in-canvas editing model is possible

## Phase 7: Styling Standards

### 23. Shared design tokens

- ensure card and CTA families rely on shared theme tokens
- avoid one-off hard-coded values when a tokenized pattern should exist
- preserve section rhythm across components

### 24. Motion and interaction

- define shared hover behavior for CTA family
- define focus states consistently
- define subtle interaction patterns for cards if needed
- keep motion purposeful and reusable, not decorative noise

### 25. Responsive behavior

- ensure card layouts remain intentional on tablet and mobile
- ensure CTA groups wrap or stack in a systematized way
- ensure section patterns preserve hierarchy on smaller viewports
- ensure horizontal card variants degrade gracefully

## Phase 8: Dynamic And Static Consistency

### 26. Shared grammar

- if a component exists in both static patterns and dynamic output, keep the same naming and structure
- avoid a static card language and a separate dynamic card language
- avoid a static CTA pattern and a separate dynamic CTA pattern

### 27. Future-proof archive-like needs

- if `RARC-Theme` later gains posts, events, or custom listings, the card family should already have a preview/story variant ready
- keep archive-like card needs in mind when defining variants now

## Phase 9: Quality Control Passes

### 28. Block-by-block review

For every custom block, check:

- clear purpose
- stable anatomy
- good placeholders
- good empty state
- editor parity
- variant clarity
- no dependence on manual layout rescue by the editor

### 29. Pattern-by-pattern review

For every pattern or page section, check:

- section purpose is obvious
- hierarchy is obvious before real content is entered
- cards and CTAs inside the pattern feel like part of the same family
- spacing is resolved
- structure is stable enough for non-technical editing

### 30. Theme-level review

At the end of implementation, review whether:

- homepage, interior pages, and utility modules feel like one authored system
- cards look related everywhere they appear
- CTA objects look related everywhere they appear
- templates, parts, blocks, and patterns all carry the same implementation taste
- the theme looks like it came from the same hands as the client's preferred reference implementation

## Recommended Implementation Order

Follow this order unless the user directs otherwise:

1. finalize CTA system grammar
2. expand card family and card anatomy
3. update editor placeholders and empty states
4. strengthen section patterns/page sections
5. improve template defaults and shell consistency
6. polish responsive/editor parity issues
7. run block, pattern, and theme-level fingerprint review

## Anti-Patterns To Avoid

- solving every new need with a new standalone custom block
- using generic core buttons as the final branded CTA solution
- letting editors manually build branded cards from unrelated primitives
- creating many near-duplicate patterns with slightly different spacing
- hiding core authoring tasks inside inspector-only settings
- letting dynamic modules drift into different markup than static modules
- optimizing for freedom when the client is asking for recognizable implementation discipline

## Final Check

Before considering the theme aligned with the target philosophy, confirm:

- the page editor feels guided
- the key modules feel self-contained
- ghosted placeholders teach the layout
- CTA links and buttons have one coherent family
- cards have a clear reusable family
- modular sections are the main authoring unit
- the implementation fingerprints feel deliberate, repeatable, and recognizable
