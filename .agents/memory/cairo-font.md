---
name: Cairo font for Kurdish Sorani
description: Font configuration for Kurdish (Sorani) / Arabic / English trilingual sites
---

**Rule:** Use Cairo (Google Fonts) as the primary font for Kurdish Sorani and Arabic. It has better glyph coverage and weight range than Noto Sans Arabic for Sorani.

**Why:** Cairo supports full Kurdish Sorani character set with weights 300-900, renders beautifully at large display display sizes. Noto Sans Arabic is a good fallback.

**How to apply:**
- Google Fonts URL: `family=Cairo:wght@300;400;500;600;700;800;900`
- CSS stack: `'Cairo', 'Noto Sans Arabic', system-ui, sans-serif`
- Always define BOTH `[lang="ku"]` / `[data-lang="ku"]` selectors AND `.font-ku` / `.font-ar` utility classes — LanguageContext applies both approaches.
- Always also define `.font-en` pointing to Inter, otherwise English users get Cairo too.
