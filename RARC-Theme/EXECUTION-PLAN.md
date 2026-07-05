# RARC Theme Execution Plan

## Purpose

This document maps `IMPLEMENTATION-CHECKLIST.md` onto the current `RARC-Theme` codebase.

Use it as the practical order of operations for the next implementation pass.

The goal remains: the client should feel that `RARC-Theme` and the preferred reference theme share the same implementation fingerprints, even though the design language is different.

This also means the implementation should not stay committed to pure FSE or block-theme ideology if that conflicts with the preferred reference authoring model.

## Architecture Direction

Current decision:

- closer adherence to the preferred reference system and philosophy matters more than maintaining a pure full-site-editing direction
- backend authoring should be shaped around modular page sections, self-contained components, and guided editing
- if block-theme/FSE mechanics help achieve that, keep them
- if they get in the way, reduce or replace them

The architecture should follow the editing model, not the other way around.

## Current Theme Snapshot

Current strengths:

- `functions.php` already uses server-rendered custom blocks
- homepage and interior patterns already carry a modular section mindset
- `theme.json` already defines a consistent token base
- `assets/css/theme.css` already contains much of the intended visual system
- `assets/css/editor.css` already loads shared styling into the editor
- the theme now has a scripted ZIP workflow with automatic patch-version bumps
- page shells now support a true full-width interior page hero model

These strengths are still useful, but they should now be evaluated by one test: do they help the theme behave like the preferred reference implementation?

Current weaknesses to address first:

- sidebar-card editor preview still needs continued attention so it feels closer to the reference preview-card behavior
- pattern validation must be treated as an ongoing guardrail whenever new sections are added or split
- editor fidelity still needs to be verified in WordPress after any structural block change rather than assumed from CSS alone

## Critical Correction: No Mega-Pattern Authoring

One major implementation drift needs to be corrected explicitly:

- the source HTML layouts were not intended to become one giant homepage pattern or one giant interior pattern
- each major section in `index.html` and `interior-page.html` was intended to be its own independent page section
- editors should be able to mix, match, omit, duplicate, and reorder these sections freely
- backend authoring should preserve these sections as modular editorial units

This is directly aligned with the client's preferred reference implementation.

The current large pattern files should be treated as transitional scaffolding, not the final page-section architecture.

## Section Mapping From The HTML Files

Each major section in the raw HTML should be treated as analogous to a reusable backend page section.

Homepage section inventory from `index.html`:

- hero carousel section
- hobby-intro section: heading, supporting text, and three cards
- first-visit editorial section: eyebrow, heading, text, table-style rows, optional photo
- field-photos carousel section: eyebrow, heading, paragraph, carousel
- upcoming-events section
- recent-stories section
- membership CTA section
- directions/share utility section
- contact section

Interior section inventory from `interior-page.html`:

- interior hero section
- introductory prose/media section
- inline photo row section
- callout or status-note section
- info-list section
- action-row section
- story-module section
- sidebar utility-card stack section

These sections should be implemented so they are:

- independent
- reusable
- non-mutually-exclusive
- reorderable
- optionally repeatable where that makes sense
- maintainable as backend page-section units

## Priority Order

Implement in this order:

0. prefer the reference editing model over pure FSE adherence whenever they conflict
1. CTA system
2. Card family
3. Custom block editing UX and placeholders
4. Page-section decomposition and section architecture
5. Template and shell refinement
6. Archive-like and dynamic readiness
7. Final fingerprint review

## Stage Status

Current status of the plan:

- Stage 1: CTA system: complete — SVG icon system with semantic auto-selection, enhanced icon hover motion, icon_type parameter, all branded CTAs use show_icon
- Stage 2: Card family: complete — __header/__content/__image named regions, clickable header-link, __image--placeholder class, story-preview uses same anatomy
- Stage 3: Custom block editing UX and placeholders: complete — credit moved from canvas to inspector, hero and carousel slide counts visible in canvas, sidebar-card badge shows action type, story-preview CTA label editable in-canvas, all editor CTAs show icon preview
- Stage 4: Page-section decomposition and section architecture: complete — split section inventory, no homepage mega-patterns, templates compose via theme sections and patterns
- Stage 5: Template and shell refinement: complete — editorial paragraphs in home/archive, header/footer CTAs use inline SVG, `page.html` now owns the full-width interior hero instead of seeding it into page content
- Stage 6: Archive-like and dynamic readiness: complete — story-preview shares card anatomy, home/archive use rarc/story-preview in query loops
- Stage 7: Final fingerprint review: complete — all 7 questions answered affirmatively, CTAs show icon preview in editor, card family shares anatomy across static/dynamic contexts, no wp:button references, no mega-patterns

The stages still govern the work. They have not been abandoned. Some coding passes crossed stage boundaries because preserving the intended backend model required CTA, card, section, and shell changes to move together.

## Additional Current Rules

The implementation has learned several practical rules that future passes should follow immediately:

- do not reintroduce default page-content seeding that inserts `interior-post-content` or other recursive content blocks into new page bodies
- prefer native blocks over raw `wp:html` inside reusable patterns where possible
- when a pattern declares `anchor`, include the matching wrapper `id`
- when a `core/group` pattern declares a layout, include the expected `is-layout-*` and `wp-block-group-is-layout-*` classes in the wrapper HTML
- use native WordPress link pickers for CTA destinations in custom block editors
- keep core/remote pattern sources suppressed so the RARC pattern system remains the main authoring surface
- after each intentional ZIP build, commit the source state that produced it so version numbers and repository history remain synchronized

## Workstream 1: CTA System

### Goal

Replace the current mostly-styled-button approach with a real CTA family that owns its structure and behavior.

### Why this is first

- hero actions use button markup directly
- card buttons use button markup directly
- share actions are adjacent to, but not fully part of, the same action family
- the reference implementation's fingerprints are most obvious in CTA construction

### Current files to change

- `functions.php`
- `assets/js/blocks.js`
- `assets/css/theme.css`
- `assets/css/editor.css`
- section pattern files under `patterns/`
- `parts/header.html`
- `parts/footer.html`

### Current issues

In `functions.php`:

- `rarc_theme_button_wrapper_class()` still frames CTA behavior as a wrapper around `wp-block-button`
- `rarc_theme_render_card_block()` renders card actions as button links, not as a distinct CTA object
- `rarc_theme_render_hero_block()` renders primary and secondary actions with plain button markup
- `rarc_theme_render_sidebar_card_block()` renders either a plain linked button or a share button, but not as part of one clear CTA family

In `assets/css/theme.css`:

- CTA styling is shared through selectors targeting `.wp-block-button__link`
- the theme is styling output shape rather than owning a CTA grammar

### Implementation tasks

1. Define the `RARC-Theme` CTA grammar.
2. Decide whether to implement as:
   - a dedicated rendered CTA block
   - a reusable render helper in `functions.php`
   - or both
3. Create stable CTA internal regions, likely including:
   - wrapper
   - label
   - optional icon
   - optional semantic variant class
4. Refactor hero actions to use the same CTA grammar.
5. Refactor card actions to use the same CTA grammar.
6. Refactor sidebar/share actions to use the same CTA grammar.
7. Decide whether header/footer utility actions should also use that grammar now or in a follow-up.
8. Add editor styling so CTA objects preview as authored objects, not plain buttons.

### Definition of done

- no important branded action relies on plain `core/button` markup alone
- primary, outline, inline, and share actions feel like one family
- CTA placeholders are visible and intentional in editing contexts
- CTA hover/focus behavior is owned by the family

## Workstream 2: Card Family

### Goal

Expand `rarc/card` from a single useful block into a more explicit card system with stronger anatomy and clearer variants.

### Why this is second

- the client specifically called out cards
- CTA construction inside cards depends on the CTA system being settled first
- page sections are only as strong as the card ingredients inside them

### Current files to change

- `functions.php`
- `assets/js/blocks.js`
- `assets/css/theme.css`
- `assets/css/editor.css`
- section pattern files under `patterns/`
- possibly `templates/home.html` in a later archive-like pass

### Current issues

In `functions.php`:

- `rarc_theme_render_card_block()` is mostly an image card
- it does not yet model richer preview-card anatomy
- it lacks stronger optional-state logic and variant identity

In `assets/js/blocks.js`:

- card editing is functional, but still centered on a single card type
- the editor experience does not yet strongly communicate a card family

In `assets/css/theme.css`:

- visual styling is strong enough for one card mode
- there is not yet a fuller architecture for story teaser or archive-like variants

### Implementation tasks

1. Decide whether to:
   - extend `rarc/card` with explicit variants
   - or split into a small card family
2. Define stable card regions:
   - wrapper
   - eyebrow or kicker
   - headline
   - optional subheadline
   - optional supporting copy
   - media region
   - CTA region
   - optional metadata region
3. Add explicit card variant support.
4. Add missing-image and no-CTA states intentionally.
5. Improve placeholders to guide editors in-canvas.
6. Ensure cards can later support archive-like use, even if the archive template is upgraded later.
7. Ensure card styling in editor matches front-end rhythm closely.

### Target variants

- image-led preview card
- text-first information card
- utility/sidebar card
- story teaser card
- horizontal preview card

### Definition of done

- cards feel like a family rather than one block doing everything
- optional states do not break shape
- card editing feels slot-based, not assembly-based
- card CTA behavior matches the new CTA family

## Workstream 3: Custom Block Editing UX

### Goal

Make block editing feel more like the target reference editing model: visible, guided, high-confidence, and modular.

### Current files to change

- `assets/js/blocks.js`
- `assets/css/editor.css`
- `assets/css/theme.css`

### Current issues by block

`rarc/hero-carousel`:

- strong content model already exists
- CTA labels and URLs are still entered as `TextControl` fields rather than feeling like in-canvas authored actions

`rarc/card`:

- placeholders exist, but the component still feels more like editable fields than a finished object

`rarc/carousel`:

- slide management is functional
- editor preview is still simplified compared with a higher-fidelity module feel

`rarc/info-row`:

- already close to the right model
- may only need placeholder and styling polish

`rarc/sidebar-card`:

- action logic is hidden partly in inspector controls
- the share vs link distinction is useful, but could be more visibly represented in the canvas

### Implementation tasks

1. Audit every custom block for placeholder quality.
2. Move more primary authoring into visible block content where practical.
3. Keep inspector panels for variants, toggles, and secondary settings.
4. Make editor empty states visually informative.
5. Add clearer editor-only frame styles only where they aid understanding without misrepresenting final output.
6. Ensure every custom block's first impression is understandable without opening the sidebar.

### Definition of done

- custom blocks read clearly in the canvas
- ghosted text acts like editorial guidance
- the block sidebar is a support tool, not the primary authoring surface

## Workstream 4: Page-Section Decomposition And Section Architecture

### Goal

Replace mega-pattern composition with true section-based authoring built from independent reusable page sections.

This workstream is also where any unnecessary FSE assumptions should be removed. The backend structure should be whatever best supports independent page sections.

### Current files to change

- `patterns/homepage-layout.php`
- `patterns/interior-field-guide.php`
- `templates/front-page.html`
- `templates/template-field-guide.html`
- `functions.php`
- new or reorganized section files under `patterns/`

### Current strengths

- both pattern files already have strong modular page thinking
- section rhythm is already better than the generic templates
- the homepage already contains intentional section types

### Current issues

- sections currently depend on the weaker CTA system
- some areas still rely on generic button markup
- section identity is stronger than underlying reusable object identity
- too many source HTML sections are bundled together into single pattern insertions
- editors cannot naturally treat each original section as a standalone backend module

### Implementation tasks

1. Break any remaining composite homepage structures into discrete section-level units.
2. Break any remaining composite interior structures into discrete section-level units.
3. Create one reusable backend section per major source HTML section.
4. Replace all branded action instances in those sections with the new CTA family.
5. Replace all card instances in those sections with the refined card family or variants.
6. Review placeholder hierarchy for each section unit.
7. Add or adjust locking where needed to protect internal section structure without preventing page-level reordering or omission.
8. Ensure every section can stand alone cleanly.
9. Ensure sections do not assume neighboring sections are present.
10. Reassess whether the current template/pattern/FSE mechanics are the best vehicle for these sections, or whether a closer reference-style backend structure is needed.

### Required decomposition outcome

The following should become independent homepage section units:

- hero carousel
- hobby-intro three-card section
- first-visit editorial/table/photo section
- field-photos carousel section
- events-and-stories section
- membership CTA section
- directions/share utility section
- contact section

The following should become independent interior section units:

- interior hero
- prose/media intro section
- inline-photo section
- callout/status section
- info-list section
- action-row section
- story-module section
- sidebar utility section

### Definition of done

- homepage and interior content are no longer trapped inside mega-patterns
- each major source HTML section exists as an independent backend page section or equivalent reusable unit
- action UI and cards inside them feel like part of one system
- editors can mix, match, omit, duplicate, and reorder sections without re-solving layout
- backend authoring now reflects the intended modularity of the original design
- the section architecture is chosen because it serves the editing model best, not because it preserves FSE purity

## Workstream 5: Templates And Shell

### Goal

Reduce the generic feeling in templates and shell parts so the whole theme feels authored with the same discipline as the target model.

### Current files to change

- `parts/header.html`
- `parts/footer.html`
- `templates/page.html`
- `templates/single.html`
- `templates/home.html`
- `templates/archive.html`
- `templates/index.html`

### Current issues

`parts/header.html`:

- structurally clean, but generic
- no strong utility action fingerprint yet

`parts/footer.html`:

- minimal and serviceable, but not yet a strong authored shell

`templates/page.html` and `templates/single.html`:

- mostly generic post shells
- less guided than the modular field-guide pattern approach

`templates/home.html`:

- generic query loop markup
- does not yet align with a stronger story teaser or preview-card system

### Implementation tasks

1. Decide how much shell complexity is appropriate without over-copying the reference layout.
2. Strengthen header/footer so they feel deliberately authored.
3. Ensure shell actions, if any, use the CTA family.
4. Review whether generic page/single templates should gain more modular support structures.
5. Plan a later pass for `home.html` to use preview-story card logic if posts become important.

### Definition of done

- shell parts feel intentionally designed at the implementation level
- templates do not fall back to generic Gutenberg feeling where a stronger authored structure is expected

## Workstream 6: Dynamic And Archive-Like Readiness

### Goal

Prepare `RARC-Theme` so its static patterns and future dynamic outputs can share one component grammar.

### Current files to change

- `templates/home.html`
- `templates/archive.html`
- `templates/index.html`
- `functions.php`
- possibly future query loop or block render helpers

### Current issues

- archive-like rendering currently uses generic query loop markup
- there is not yet a preview/story card layer for dynamic outputs

### Implementation tasks

1. Define how story teaser cards should work for dynamic content.
2. Decide whether dynamic card rendering should be handled through:
   - a custom block
   - query loop styling
   - or a future render helper pattern
3. Align dynamic story card structure with the card family built earlier.

### Definition of done

- archive-like and static story modules no longer feel like different systems

## Workstream 7: Final Fingerprint Review

### Goal

Confirm that `RARC-Theme` now feels like it came from the same developer mindset as the target reference implementation.

### Files to review together

- `functions.php`
- `assets/js/blocks.js`
- `assets/css/theme.css`
- `assets/css/editor.css`
- section pattern files under `patterns/`
- `parts/header.html`
- `parts/footer.html`
- `templates/*.html`
- `theme.json`

### Final review questions

- do cards feel like one reusable family?
- do CTAs feel like one reusable family?
- do page sections feel modular and pre-authored?
- does the editor teach the layout through placeholders and structure?
- do static and future dynamic contexts feel compatible?
- does the theme feel deliberate rather than generic?
- would the client plausibly feel the same developer fingerprints across both themes?

## Recommended First Implementation Pass

If implementation begins immediately, start with this exact sequence:

0. reject pure FSE preservation as a goal if it conflicts with the intended authoring model
1. create CTA render helper and CTA class contract in `functions.php`
2. update CTA styles in `assets/css/theme.css`
3. update CTA-related editor styles in `assets/css/editor.css`
4. refactor hero, card, and sidebar-card outputs to use the CTA helper
5. improve CTA editing UI in `assets/js/blocks.js`
6. refactor `rarc/card` toward stronger variant support
7. decompose homepage and interior mega-patterns into section-level backend units
8. update those section units to use the new card/CTA system
9. review header/footer and generic templates for shell consistency
10. review `home.html` for future story-card alignment
11. run a fingerprint review against `AGENT.md`

## Anti-Drift Warnings

While implementing, avoid these likely mistakes:

- improving visuals without improving authoring structure
- keeping giant composite patterns when the intended design was independent reusable sections
- preserving FSE/block-theme purity when it weakens the editing model
- adding variants without defining shared anatomy
- keeping plain button markup because it is faster
- solving archive-like needs with totally separate markup from static modules
- making placeholders generic instead of instructional
- overcomplicating templates before CTA and card systems are stable
