# RARC Theme Agent Notes

## Purpose

This file captures the implementation philosophy that `RARC-Theme` should preserve and extend.

The target standard is strong: a client should be able to compare the client's preferred reference implementation and `RARC-Theme` and feel that they were built by the same developer or team, even though the visual design, brand, and content are different.

This file must remain useful even when the reference implementation is not present in the workspace. Future LLMs should be able to use this document alone as the implementation brief for preserving those fingerprints.

## Mandatory Release Workflow

For every completed `RARC-Theme` code, CSS, template, pattern, asset, or configuration change, do all of the following before reporting completion unless the user explicitly says not to:

1. Increment the theme header `Version:` in `RARC-Theme/style.css` by one patch version.
2. Inspect `git status --short`, `git diff`, and `git log --oneline -10`.
3. Commit only the intended tracked changes with a concise message.
4. Rebuild the WordPress upload ZIP at the workspace root as `RARC-Theme.zip`.
5. The ZIP must contain a single top-level folder named `rarc-theme` and must include `rarc-theme/style.css`, `rarc-theme/functions.php`, and `rarc-theme/theme.json` using forward-slash paths.
6. Verify those three ZIP entries before telling the user the package is ready.
7. Report the new version number, commit hash, and ZIP path in the final response.

Do not use PowerShell `Compress-Archive` directly for the final upload package because it can create archive paths that WordPress may not recognize as a normal theme directory. Use an explicit ZIP writer or another verified method that creates forward-slash entries.

## If The Reference Theme Is Missing

Do not block on re-finding or re-reading the reference theme.

Assume the essential philosophy is already captured here:

- guided in-canvas editing
- ghosted placeholder text for content slots
- self-contained CTA and button objects
- self-contained card objects with stable anatomy
- modular page sections as the primary authoring unit
- strong editor/front-end parity
- reusable component grammar across static and dynamic contexts
- implementation fingerprints that feel deliberate and repeatable

If the reference theme is unavailable, use this file as the source of truth and continue building `RARC-Theme` toward those characteristics.

## High-Level Conclusion

The reference implementation is not mainly impressive because it uses more block types. It is impressive because it gives editors a strongly guided page-building system with shared front-end/editor styling, opinionated default structures, and a small set of recurring content primitives.

An important decision follows from that: pure full-site-editing alignment is not the priority if it pulls `RARC-Theme` away from the client's preferred implementation model. The client wants closer adherence to the reference system and philosophy than to block-theme purity.

For `RARC-Theme`, success does not mean copying the look of the reference theme. Success means reproducing its implementation fingerprints:

- the same level of editorial guidance
- the same type of component ownership
- the same kind of reusable section modularity
- the same consistency in CTA/button construction
- the same disciplined card anatomy
- the same confidence that editor-facing structures are intentional rather than improvised

The strongest ideas to carry into `RARC-Theme` are:

- make the editor look as close to the front end as possible
- provide precomposed page sections instead of asking editors to assemble layouts from raw core blocks
- use a small set of recognizable content objects repeatedly: section, card, CTA link, image-led story module, sidebar utility block
- keep cards and buttons semantically consistent across templates so they feel like one system
- prefer predictable authored layouts over highly flexible but low-fidelity generic blocks
- make important UI objects self-contained so editors are editing content fields, not rebuilding component structure

## Reference Architecture Summary

The reference implementation that informed this note was a classic PHP theme with a modern asset pipeline and a partial full-site-editing experiment alongside it.

Important implication:

The editing fidelity the client likes is not coming from a pure block-theme architecture by itself. It comes from a design system and page-building discipline that survives across PHP templates, editor styles, custom blocks, and content conventions.

For future decisions, treat architecture as a means, not the goal. If a pure FSE approach conflicts with the reference editing philosophy, prefer the reference editing philosophy.

## What To Emulate And What Not To Emulate

Emulate from the reference implementation:

- strict component contracts
- shared editor/front-end visual language
- opinionated default section structure
- branded CTA and card systems reused everywhere
- markup that is stable enough to be styled consistently across templates, archives, menus, and utility areas

Do not blindly emulate:

- the fact that it is a classic PHP theme
- every customizer/menu-walker implementation detail
- ad hoc inline styles or one-off front-page exceptions in templates
- the incomplete `fse/` prototype as the main model for production authoring

For `RARC-Theme`, the right translation is: adopt the same authoring discipline and component ownership first, then choose whatever WordPress implementation approach best preserves that behavior. Do not preserve pure FSE/block-theme ideals at the expense of the client's preferred editing model.

## Architecture Priority

Future LLMs should use this order of priorities:

1. match the client's preferred editing philosophy and implementation fingerprints
2. preserve modular page sections as reusable backend authoring units
3. preserve self-contained card and CTA systems
4. preserve editor/front-end parity
5. only then decide how much FSE or block-theme machinery is useful

This means `RARC-Theme` does not need to remain ideologically committed to full-site-editing if that makes the authoring model less recognizable.

## Client Priority Clarification

The client's idea of "high-fidelity editing" is not abstract. It includes three specific behaviors that the preferred implementation got right:

- ghosted placeholder text that clearly signals where headings, subheads, paragraph copy, and CTA copy belong
- self-contained CTA links and buttons that already look and behave like finished branded objects while editing
- modular page sections that let an editor insert a complex page segment as one coherent unit instead of assembling it from scratch

Future `RARC-Theme` work should treat these as core requirements, not optional polish.

It should also treat this as a fingerprint-matching exercise. The design system can differ, but the implementation habits should feel unmistakably related.

## Implementation Fingerprints To Match

When a future LLM updates `RARC-Theme`, it should aim to reproduce these recognizable working habits:

- components have stable, named internal regions
- repeated UI objects are rendered through owned markup contracts
- editor guidance is visible directly in the canvas
- major sections arrive precomposed instead of being manually assembled every time
- CTA links and buttons behave like a family across contexts
- cards are built as content models, not loose containers
- dynamic and static outputs share the same component grammar
- the theme reduces editorial decision fatigue through structure

If a change makes `RARC-Theme` more flexible but less recognizable in these ways, it is probably moving away from the client's goal.

## Core Philosophy Distilled

### 1. The editor is a guided authoring surface, not an empty canvas

The reference implementation used default page structure and modular page sections so new pages started with a known structural rhythm instead of a blank editor.

This is a major philosophy point for `RARC-Theme`:

- editors should start from patterns/page sections
- structural choices should be front-loaded by the theme
- the theme should reduce layout invention during authoring

Just as important: the empty states inside those structures should be legible. Editors should immediately understand what type of content belongs in each place.

### 2. Front-end CSS and editor CSS should stay visually aligned

The reference implementation loaded its compiled visual system into both the editor and the front end.

This gives editors a more trustworthy preview of spacing, type, CTA behavior, and component massing.

For `RARC-Theme`, this means:

- editor styles should not be a light approximation
- patterns should preview close to final output
- cards, CTA rows, sidebars, and section spacing need matching editor treatment

### 3. Reusable page sections matter more than isolated blocks

The reference implementation leaned on a `page-section` concept as the main composition unit, then filled those sections with recurring objects like cards, CTA links, media, and story content.

The lesson for `RARC-Theme` is to treat these as first-class section modules:

- hero section
- card grid section
- editorial text-plus-image section
- utility/map/share section
- interior story module with carousel
- sidebar utility stack

This matters because the reference implementation does not ask the editor to invent the section every time. The theme already knows what a landing-page band, archive teaser region, or utility section should be.

### 4. Components are branded objects, not neutral block wrappers

The reference implementation does not treat a button as “just a button” or a card as “just a container.”

Its CTA system had:

- a dedicated markup contract: `.rmc-cta`, `.rmc-cta__label`, `.rmc-cta__icon`
- icon behavior tied to destination type
- motion and sizing rules centralized in shared CTA styling

Its preview-card system also had a clear markup contract:

- `.wp-block-rmc-preview-card`
- `__header`
- `__content`
- `__image`
- horizontal/image variants

This is a critical model for `RARC-Theme`: define and preserve a stable component grammar.

### 5. High-fidelity editing comes from self-contained components

The best reference objects are self-contained. A CTA is not assembled from separate text, icon, spacing, and style blocks. A preview card is not improvised from image, heading, paragraph, and button blocks every time.

Instead, the theme owns the markup contract and lets editors change the meaningful content inside that contract.

For future `RARC-Theme` work, this is the most important implementation rule:

- if the client expects a component to always look and behave a certain way, that component should own its structure
- the editor should edit fields and variants, not reconstruct the component layout manually
- the more repeated and branded the object is, the less it should depend on freeform block composition

This is especially true for:

- CTA links
- image-led cards
- story teaser cards
- sidebar utility cards
- hero actions
- utility/share controls

### 6. Placeholder text is part of the editing system

The ghosted text approach the client called out is a real part of the authoring model.

It does several things well:

- tells the editor what kind of content belongs in a field
- preserves the intended hierarchy of the section before real copy exists
- reduces the need to inspect settings panels just to understand a block
- makes complex modules feel approachable because the content slots are obvious

For `RARC-Theme`, placeholders should not be treated as generic filler. They should act like in-canvas editorial guidance.

Good placeholder behavior means:

- headings look like heading slots
- supporting copy looks like supporting copy slots
- CTA labels read like CTA labels
- image areas and optional metadata areas are obvious before content is entered

This is especially important for custom cards, hero sections, CTA modules, and multi-part story sections.

## Editing Experience Model To Reproduce

The future LLM should think in these terms when building `RARC-Theme`:

- a page starts from a believable default pattern
- each section already has the right spacing and internal rhythm
- major components render close to final output in the editor
- common editorial tasks are content swaps, not layout assembly
- card and CTA variants are chosen intentionally from a small set of options
- placeholder text inside the section explains the intended content model without extra training

The goal is not maximum flexibility. The goal is high-confidence authoring.

## Current Architecture Decisions

The theme has now converged on several concrete implementation rules that future work should preserve unless there is a strong reason to change them:

- the homepage and interior-page hero systems must remain editable in page content, not hardcoded as uneditable template-shell markup
- the assigned front page uses the `home-hero` block markup as its first content block
- non-front pages use the `interior-page-hero` block markup as their first content block
- page featured images should feed the interior page hero background when a featured image exists
- the home hero carousel must render and preview as a full-width hero, not as a constrained image card
- carousel slide-management UX should stay consistent across carousel components: use the sidebar for slide fields/add/remove controls and keep the canvas focused on a faithful active-slide preview
- the main page/post content area should allow `alignfull` and `alignwide` sections to escape the prose column
- default page creation should not insert recursive `post-content` patterns into post content
- the bundled logo at `assets/images/rarc-logo.jpg` is the seed logo and should be installed as the default custom logo only when no custom logo is already set
- core and remote WordPress patterns are intentionally suppressed so editors see the RARC pattern system instead of unrelated unstyled patterns

These are not cosmetic details. They are part of the authoring model the client has asked for.

## Pattern Serialization Rules

One of the biggest practical lessons from implementation is that pattern validity depends on matching current WordPress block serialization exactly enough that the editor does not attempt recovery on insertion.

Future work should follow these rules:

- if a block comment declares `anchor`, the wrapper HTML must include the matching `id`
- if a `core/group` block declares a layout, the wrapper HTML must include the matching layout classes WordPress expects
- for current WordPress versions that means preserving classes such as `is-layout-constrained`, `is-layout-grid`, `is-layout-flow`, and the block-specific variants like `wp-block-group-is-layout-constrained`
- pattern markup must be structurally complete; one missing closing wrapper can invalidate the entire parent section
- avoid treating the recovery prompt as harmless; if WordPress offers recovery, the source pattern should usually be corrected

In practice, the most fragile patterns were the ones with nested `core/group` blocks and hand-authored wrapper HTML. Treat pattern validity as a first-class engineering concern.

## Native Blocks Versus Raw HTML

Another important lesson: use raw `wp:html` blocks sparingly inside reusable patterns.

- raw HTML inside patterns is more likely to be reparsed or normalized differently by the editor
- when a layout can be expressed using native blocks such as `core/buttons`, `core/button`, `core/group`, `core/image`, or `core/shortcode`, prefer that route
- use raw HTML only when the markup contract genuinely cannot be expressed well with native blocks or owned rendered blocks

This matters especially for CTA rows, utility actions, and other repeated branded UI.

## Editor Fidelity Implementation Rule

Editor fidelity is not achieved by `add_editor_style()` alone.

The current rule is:

- load the real frontend visual system into block-editor content explicitly
- layer editor-only overrides on top for canvas affordances, badges, placeholders, and block outlines
- when the editor DOM differs from the frontend DOM, add targeted editor selectors rather than accepting a low-fidelity approximation

Future work should preserve this bias: if there is a mismatch between frontend and editor, fix the styling path rather than normalizing expectations downward.

This is especially important for heroes:

- the interior page hero must preview as a full-width hero when it is the first content block
- the home hero carousel must preview using hero-specific markup and sizing, not a generic image/card placeholder
- if the editor preview uses a simplified structure that changes scale, alignment, or text layering, it is the wrong structure

## CTA Editing Rule

CTA URLs are now edited with the native WordPress link picker instead of plain text URL fields.

That means future CTA-like fields should prefer native linking controls so editors can:

- search internal WordPress content
- paste external URLs
- use named links/anchors where appropriate

Do not regress back to plain URL text fields unless there is a specific technical constraint.

## Sidebar Card Preview Rule

Sidebar cards are not generic full-width cards.

In the editor, they should preview as a narrow sidebar stack rather than stretching across the full content width. This is part of the preview-card fingerprint the client expects from the reference implementation.

## Custom Container Block Rule

When WordPress core containers do not provide a strong enough editing affordance, it is acceptable to introduce a light custom container block instead of forcing editors to rely on subtle native inserters.

Current example:

- `rarc/card-grid` exists because the hobby-intro card area needed visible in-grid add-card tiles and more predictable editor behavior than a plain `core/group` grid provided

Future work should use this sparingly, but not avoid it when the editing model clearly benefits.

## Homepage Editing Rule

The homepage is not a static hardcoded template composition.

- `front-page.html` should render the assigned page's content
- the assigned front page should stay editable like any other page
- the difference is only the hero choice: homepage gets `home-hero`, other pages get `interior-page-hero`
- the first hero block should be synchronized to match that rule, but the block markup must stay editable in the page editor

## Build And Versioning Workflow

The ZIP build process is now part of the theme contract.

- use `build-theme.ps1` to produce `rarc-theme.zip`
- each build increments the patch version in `style.css`
- after each intentional build, make a matching git commit so the repo state, version number, and ZIP artifact history stay aligned
- the ZIP remains a build artifact and should not be committed
- documentation changes should keep this workflow accurate so future work does not drift back to ad hoc manual zipping

Cross-platform packaging rule:

- local development may happen on Windows while the real WordPress host is Linux-based
- the upload ZIP must contain `style.css`, `functions.php`, `theme.json`, and theme folders at the ZIP root
- ZIP entry names must use normalized forward-slash paths such as `assets/css/theme.css`, not Windows-style backslash entry paths
- if a package installs locally but fails remote upload with missing `style.css` or missing template errors, inspect the ZIP structure and entry naming first

## Modular Page Sections

One of the most transferable strengths from the reference implementation is modular section authoring.

The idea is:

- a page section is a reusable editorial module
- the module already contains the right internal structure
- the editor inserts the module, then replaces content, images, and links
- the section remains coherent even when authored by a non-technical user

This is highly compatible with `RARC-Theme`, because `RARC-Theme` already leans on section patterns and rendered blocks.

The future goal should be to make each major page segment feel like a page-section product, not just a pile of blocks.

Each page section should ideally provide:

- a clear visual frame in the editor
- placeholder content that shows the intended hierarchy
- locked or semi-locked structural regions when layout stability matters
- self-contained cards, CTAs, or utility objects inside the section
- minimal need for manual spacing corrections

## Cards: What To Emulate

The client specifically called out cards. The main qualities worth copying are structural, not ornamental.

### Preview-card principles from the reference implementation

- cards have a consistent internal anatomy
- image, header, and content regions are explicitly named
- variants are handled with modifier classes, not ad hoc markup rewrites
- cards work in both vertical and horizontal contexts
- cards are content-forward and link-forward, not decorative shells
- cards allow optional data without losing shape: kicker, subheadline, excerpt, image placeholder, taxonomy labels
- cards are used across archives and dynamic loading because their contract is stable enough to rebuild in JS and PHP the same way

### Anatomy of the reference card system

Common recurring parts visible in `example-theme`:

- wrapper: `.wp-block-rmc-preview-card`
- variant: `--image`, `--horizontal`
- header region: `.wp-block-rmc-preview-card__header`
- image region: `.wp-block-rmc-preview-card__image`
- content region: `.wp-block-rmc-preview-card__content`
- metadata helpers: `.kicker`, `.subheadline`, optional keyword/status text

This is a better model than a generic card block because:

- hierarchy is explicit
- styling can target stable regions
- optional fields do not break the layout
- the same object works for static rendering and dynamic injection

### Editing implication for cards

Future `RARC-Theme` cards should be edited as bounded content models.

Prefer this:

- title
- eyebrow or kicker
- optional subheadline
- optional excerpt/body
- image
- link label or destination when needed
- card variant selector

Avoid this:

- asking editors to add arbitrary nested blocks inside a blank card shell
- asking editors to manually recreate card spacing or image/text order
- requiring separate adjacent blocks to complete one card

Card placeholders should also guide the editor in-canvas, for example:

- kicker or eyebrow slot
- headline slot
- optional supporting text slot
- CTA label slot
- media area with obvious empty state

### Translation for `RARC-Theme`

Our current `rarc/card` block is directionally correct but still too narrow and isolated compared with a fuller preview-card family. To better match the example philosophy, future card work should aim for:

- stricter card anatomy with predictable regions
- clear variants rather than one generic card trying to do everything
- stronger editor preview of final spacing and image treatment
- CTA treatment inside cards that feels like the same CTA system used elsewhere
- support for cards as section ingredients, not just standalone inserts

Recommended future card set for `RARC-Theme`:

- image card
- plain info card
- utility/sidebar card
- story/preview card for post or event summaries
- horizontal preview card for archive-like use

### Fidelity requirement for cards

The client's request for high-fidelity cards should be interpreted literally:

- cards should preview with realistic image ratio, spacing, and vertical rhythm in the editor
- optional states should be intentional, including missing-image behavior
- variant changes should preserve structure
- the published markup should not depend on how carefully an editor arranged child blocks

## Buttons and CTA Links: What To Emulate

This is the clearest reusable pattern in the reference implementation.

### What the reference implementation does well

- CTA markup is consistent across menus, archives, and footer contexts
- icon and label are separate elements, which makes motion and icon swapping easy
- hover motion is subtle and directional, not just color change
- link destination semantics can affect icon choice
- CTAs read like a branded language system, not generic buttons
- the same CTA language appears in multiple delivery mechanisms: menu walkers, template markup, dynamic archive actions, and footer menus
- CTA behavior is centralized enough that changing typography, icon motion, or spacing updates the whole family

### Anatomy of the reference CTA system

Common recurring parts:

- wrapper link or CTA container
- `.rmc-cta__label`
- `.rmc-cta__icon`
- optional icon selection based on destination semantics
- optional list wrappers such as `.wp-block-rmc-cta-link-list`

Why it works:

- the CTA owns its own iconography
- label and icon spacing are built into the contract
- hover and loading states can be applied without changing content structure
- the object is portable across nav, footer, archive, and utility contexts

### Editing implication for CTAs and buttons

Future `RARC-Theme` CTAs should be treated as a dedicated authored object, not as plain `core/button` plus theme styling.

Prefer:

- a CTA block, block variation, or render callback that outputs stable label/icon markup
- small variant choices such as primary, outline, inline-arrow, external, share, utility
- semantics handled by the component itself

Avoid:

- requiring editors to pair text with a separate icon block
- relying on plain `core/button` styling as the main branded call-to-action solution
- building a CTA row out of unrelated core blocks with fragile spacing rules

CTA placeholders should make the authored object obvious. A future editor should see, in context, that they are editing:

- a primary action label
- a secondary action label
- an inline CTA label
- a share action

They should not have to infer the intended role from generic button markup alone.

### Translation for `RARC-Theme`

Current `RARC-Theme` buttons rely mostly on `core/button` styling plus a few rendered button wrappers. That is usable, but it is not yet a branded CTA system in the same way.

Future direction:

- introduce a dedicated CTA pattern, block style, or block that has stable label/icon markup
- separate “button” use from “text CTA with directional icon” use
- give cards, utility sections, and nav CTAs the same visual language
- keep primary/outline variants, but add shared icon behavior so CTAs feel authored rather than default Gutenberg buttons
- allow loading, sharing, and external-link states without inventing separate bespoke markup each time

### Fidelity requirement for CTAs

The client's request for high-fidelity buttons and CTA links means:

- exact padding, letterspacing, casing, icon placement, and hover motion should be owned by the component
- the editor should see a close visual approximation of the final CTA object
- the CTA should remain visually coherent in cards, hero actions, sidebars, and utility lists
- a future LLM should not treat core button styling alone as sufficient unless the design explicitly calls for a plain button

## Editing Fidelity: Why The Reference Theme Feels Better

The likely reason the client prefers editing in the reference theme is not just visuals. It is the combination of:

- default page structure
- shared front-end/editor styling
- repeated section conventions
- custom block expectations baked into templates
- reduced need for editors to improvise layout decisions

In other words: fidelity is editorial confidence.

Another way to say it: the theme decides what the component is, and the editor decides what the component says.

For `RARC-Theme`, high fidelity should mean:

- page patterns already look like publishable sections
- cards preview at realistic scale in the editor
- buttons and CTA rows look finished during editing
- interior pages already contain a believable content rhythm
- editors can swap content without redesigning structure

## What `RARC-Theme` Currently Does Well

Current strengths already present in `RARC-Theme`:

- block theme foundation with `theme.json`
- custom rendered blocks for hero, carousel, cards, info rows, and sidebar cards
- homepage and interior patterns already derived from the raw HTML files
- shared front-end/editor CSS via `assets/css/theme.css` and `assets/css/editor.css`
- server-rendered custom blocks already exist for hero, cards, carousel, info rows, and sidebar cards, which is the right direction for stable markup

This means the theme is not starting over. It already has the right broad ingredients.

The remaining work is mostly about making those ingredients feel authored with the same discipline and taste as the preferred reference implementation.

## Where `RARC-Theme` Currently Diverges From The Target Philosophy

### 1. It is more custom-block-centric than section-centric

Current custom blocks are useful, but the most important authoring unit should become the section/pattern, not the isolated block.

### 2. CTA language is weaker than the target model

Buttons work, but they do not yet form a memorable branded CTA system with a consistent icon/label contract.

Current state in `RARC-Theme`:

- most action UI is still rendered as `core/button`-style markup
- there is no single dedicated CTA grammar equivalent to `.rmc-cta`, `.rmc-cta__label`, `.rmc-cta__icon`
- share actions and hero actions are close visually, but they are not yet one reusable CTA family

### 3. Card composition is still narrower than the target model

The current card block is mainly an image card. The target philosophy suggests a broader family of reusable preview-like components.

Current state in `RARC-Theme`:

- `rarc/card` is useful but not yet a full preview-card system
- archive-like or story-teaser card variants are not yet first-class
- card anatomy is simpler than the example contract, with fewer controlled subregions

### 4. Page defaults are less opinionated

The example theme starts editors inside a stronger structural frame. `RARC-Theme` should do more of that with patterns, template locking, and section-level defaults.

### 5. Header and footer authoring are simpler than the target system

Current `RARC-Theme` header/footer parts are serviceable, but they are still relatively generic compared with the stronger CTA-rich branded shell the client prefers.

That does not mean they should copy the example theme's exact layout. It means they should eventually participate in the same system of:

- branded CTA treatment
- stable utility areas
- consistent editing affordances

## Specific Guidance For A Future LLM

When revising `RARC-Theme`, assume these priorities unless the user says otherwise:

- first preserve the ease of editing
- second preserve the HTML concept layouts from the raw RARC source files
- third translate those layouts into stable section patterns and self-contained content objects
- fourth avoid making editors assemble branded components from low-level Gutenberg primitives
- fifth ask whether the result would feel like it came from the same implementation mindset as the client's preferred reference theme

Before finalizing any major block, pattern, or page-section change, apply this check:

- would a client recognize the same developer fingerprints here?
- does the component feel owned, guided, and modular?
- does the editor experience feel deliberate rather than generic?
- do the card and CTA structures feel like part of a larger system?

When deciding between a freeform nested-block solution and a bounded custom/rendered solution:

- choose the bounded solution for CTAs, cards, utility cards, and repeated story modules
- choose the freer solution for article body prose and simple editorial text bands

When designing empty states:

- use ghosted placeholder text generously inside custom editorial modules
- make the placeholder language reflect the real purpose of the slot, not generic lorem ipsum
- ensure the placeholder hierarchy matches the published hierarchy

When deciding whether to create many blocks or few:

- prefer fewer, stronger section and component models
- prefer variants over near-duplicate blocks

When deciding how much visual freedom to give the editor:

- give freedom at the section-sequence and content-value level
- restrict freedom at the branded component-structure level

## Recommended Development Rules For Future RARC Work

When updating `RARC-Theme`, follow these rules:

- favor patterns and prebuilt sections over adding many new standalone blocks
- only add a new custom block when a repeating content object truly needs its own editing UI
- keep card markup consistent across homepage, archive-like layouts, sidebars, and interior stories
- create a dedicated CTA language with icon plus label markup
- use modifier classes for variants instead of separate one-off blocks whenever possible
- keep editor styling close to front-end styling, especially for spacing, card height, and CTA treatment
- lock or guide structural sections when the layout should remain stable
- prefer a smaller system of well-resolved sections over a larger library of generic blocks
- let repeated components own their full markup contract
- make optional states explicit in the component model: no image, external link, share action, secondary CTA, metadata present or absent
- ensure dynamic and static contexts can use the same component grammar

## Recommended Technical Translation Into `RARC-Theme`

The most faithful way to translate the reference implementation's expertise into this block theme is:

- keep using server-rendered custom blocks where exact markup matters
- add stronger pattern locking and starter page structures
- build CTA and card variants around stable wrapper and child class contracts
- use editor styles to preview those contracts at near-final scale
- avoid scattering branded behavior across unrelated core blocks
- give each important authored slot meaningful in-canvas placeholder text

In practice, that means a future LLM should strongly consider:

- a dedicated CTA block or CTA block variation family
- a richer preview-card family instead of one generic card block
- section patterns that insert these objects in already-resolved compositions
- archive or story modules whose markup can be reused both in static patterns and dynamic outputs
- edit UIs that privilege direct in-canvas authoring over hidden inspector-only workflows where possible

## Suggested Section Inventory For `RARC-Theme`

These should likely become the main reusable page sections going forward:

- site hero section
- three-up or two-up card grid section
- editorial text plus media section
- event/story teaser section
- carousel story module section
- utility section for map, directions, contact, or share
- interior content section with optional sidebar stack
- slim CTA band

## Suggested CTA Inventory For `RARC-Theme`

- primary pill button
- outline pill button
- inline CTA link with directional icon
- utility CTA row or CTA list
- share CTA treatment

All of these should feel like one family.

## Suggested Card Inventory For `RARC-Theme`

- image-led preview card
- text-first information card
- sidebar utility card
- story teaser card
- optional horizontal card variant for news/event/archive contexts

## Practical Next-Step Strategy

When we start the actual theme revision, the best order is:

1. strengthen the CTA system first
2. reshape cards into a more explicit reusable family
3. convert homepage and interior content into stronger section patterns/page sections
4. improve editor parity for those sections
5. only then add any missing custom editing controls

This order matters because the example theme’s quality comes from systemic consistency, not from isolated block complexity.

## Important Caveat

This note was originally distilled from a separate reference theme, and some of that theme's underlying implementation may not be available in future workspaces. That does not block the work. The goal is to reproduce the editing experience, component discipline, and section-building philosophy inside `RARC-Theme`.

## Bottom Line

Use the target philosophy described here as the model for:

- guided page assembly
- strong section patterns
- branded CTA behavior
- repeatable card anatomy
- editor/front-end parity

Do not use it as a reason to add block sprawl.

The next version of `RARC-Theme` should feel more like a curated publishing system and less like a collection of independently authored custom blocks.

If the original reference theme is absent, the same conclusion still holds.

## RARC-Theme CTA Icon Contract

The example-theme used SVG `<use>` references with semantic icon selection based on link destination (internal → arrows, external → external-link, locked → lock). RARC-Theme matches this fingerprint with:

- `rarc_theme_get_cta_icon_svg()` — returns inline SVG markup for icon types: `arrow`, `external`, `lock`, `share`
- `rarc_theme_get_cta_icon_type()` — auto-detects icon type from URL by checking host patterns
- `rarc_theme_render_cta()` `icon_type` parameter — accepts `'auto'` (default), `'arrow'`, `'external'`, `'lock'`, `'share'`, or `'none'`
- SVG icons use `stroke="currentColor"` so they inherit CTA text color
- Icons render inside `<span class="rarc-cta__icon" aria-hidden="true">`
- Hover: icon slides right via `translateX(6px)` with cubic-bezier easing, matching example-theme's motion signature

All branded CTAs (hero, card, sidebar, story-preview) use `show_icon => true, icon_type => 'auto'` to get semantic icons. Template-part CTAs (header, footer) and pattern CTAs use inline SVG directly.

## RARC-Theme Card Anatomy Contract

The example-theme used `wp-block-rmc-preview-card` with `__header`, `__content`, `__image` named regions and a clickable header link. RARC-Theme matches this fingerprint with:

- `rarc-card` base wrapper with `rarc-card--{variant}` modifier (`image`, `story`, `info`, `horizontal`)
- `rarc-card__image` — media region with `rarc-card__image--placeholder` for empty state
- `rarc-card__content` — content region containing header + body text + CTA
- `rarc-card__header-link` — clickable `<a>` wrapping eyebrow + meta + title + subheadline (when `linkUrl` is set)
- `rarc-card-meta` — metadata region (date, category, etc.)
- `rarc-card-subheadline` — optional subheadline
- `rarc-card-credit` — image credit overlay
- `rarc-card-cta` — CTA within card body

The story-preview (`rarc/story-preview`) follows the same anatomy: `rarc-card__image` → `rarc-card__content` → `rarc-card__header-link` (meta + title) → excerpt → CTA.

## Build Artifacts

When producing a ZIP for WordPress theme upload (`rarc-theme.zip`), include only the files required by a WordPress theme at the ZIP root:

- `assets/`
- `parts/`
- `patterns/`
- `templates/`
- `functions.php`
- `screenshot.png`
- `style.css`
- `theme.json`

Exclude all non-theme files: documentation (`AGENT.md`, `EXECUTION-PLAN.md`, `IMPLEMENTATION-CHECKLIST.md`), reference implementations (`example-theme/`), source assets, and any other files outside `RARC-Theme/`. The ZIP is a build artifact and should not be committed to the repository.
