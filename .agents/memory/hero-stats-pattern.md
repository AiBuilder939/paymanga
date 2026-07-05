---
name: Hero stats overlap pattern
description: How to safely overlap stat cards at the bottom of a hero section without clipping
---

The pattern of using `translate-y-1/2` on cards inside a section with `overflow-hidden` clips the cards.

**Rule:** Put the stats in a sibling `<div>` *after* the hero `<section>`, using `-mt-14 relative z-20` for the visual overlap effect. Give the following section `pt-28 md:pt-36` to compensate.

**Why:** `overflow-hidden` is needed on the hero section to contain decorative background elements. Using translate-y inside it guarantees clipping. A sibling element stacks above the hero in normal flow, no clipping possible.

**How to apply:** Any time a hero section needs floating cards that overlap the bottom edge.
