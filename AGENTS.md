<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# manobae product and design rules

The source of truth for UI work is `design system/manobae — Design System/`.
Before implementing or substantially changing a screen, read the relevant files in
this order:

1. `foundations.md`
2. `colors.md`
3. `typography.md`
4. `spacing.md`
5. `themes.md`
6. `components.md`
7. `motion.md`
8. `decorative-elements.md`
9. `vibe-coding-brief.md`

Treat those files as binding constraints. When they conflict with generic UI
conventions, follow the design-system files.

## Product character

- Build a private two-person relationship space: digital scrapbook, modern
  editorial design, and playful intimacy.
- The product should feel warm, calm, tactile, nostalgic, witty, and collected
  over time. Content—photos, writing, dates, places, and observations—is the
  primary decoration.
- Avoid corporate SaaS/dashboard patterns, childish Valentine's styling, neon
  gradients, generic rounded-card grids, random emoji, excessive hearts,
  glassmorphism, decorative clutter, and invented metrics or features.
- Give each screen one emotional focus and one obvious primary action. Keep
  secondary actions quiet.

## Internationalization and accessibility

- Persian RTL and English LTR are first-class and must use the same component
  tree. Do not treat RTL as a final visual flip.
- Apply direction to the relevant content container and use CSS logical
  properties. Isolate numbers, codes, URLs, prices, and mixed dates when needed.
- Persian narrative copy uses Persian digits and the Jalali calendar; preserve
  Latin digits for codes, URLs, prices, and technical metadata.
- Never letter-space or justify Persian text. Long Persian paragraphs are
  right-aligned.
- Body text is at least 16px, touch targets are at least 44x44px, keyboard focus
  is visible, and state is never communicated by color alone.
- Meaningful photos require useful alt text; decorative SVGs use empty alt or
  `aria-hidden`. Every meaningful interaction must retain parity under
  `prefers-reduced-motion`.

## Tokens, themes, and typography

- Components consume semantic tokens only. Identity-specific hex values belong
  in theme definitions, never inside components.
- Support Night Letter (Amir), Rose Garden (Kimia), and Between Us (shared).
  Shared events, answers, decisions, and dreams always use Between Us; neither
  identity should dominate shared content.
- Theme changes may adjust palette, display face, motifs, and narrowly scoped
  radius offsets, but must not duplicate components, alter information
  architecture, or cause layout shift.
- Use the documented bilingual type stacks: Vazirmatn/Estedad for Persian and
  Manrope/Fraunces for English. Use at most one expressive face per screen.
  Nastaliq and handwriting are only for very short keepsake accents, never UI.
- Use the 4px spacing scale, documented type scale, radius family, borders, and
  shadows. Do not reach for arbitrary values when a token exists.

## Layout and component behavior

- Design mobile-first from 360px upward. Verify the intended states at 360px,
  768px, and 1280px. Use 16px mobile gutters and a centered 1180px desktop max
  width; prose is capped at 680px.
- Mobile uses a single narrative column and bottom navigation; desktop uses a
  compact top bar. Use asymmetry for memories and photos, not forms or data
  entry.
- Do not place more than three equal cards in a row. Prefer a list, timeline,
  carousel, calendar, or layered scrapbook composition when items have equal
  importance.
- Reuse the metaphors defined by the system consistently: question = folded
  note, memory = photo/paper, dream = postcard/ticket, place = map label/receipt,
  milestone = framed keepsake. Decorative objects are not interchangeable.
- Inputs always have visible labels. Active navigation combines shape, icon, and
  text rather than color alone. Destructive actions use the danger token and
  explicit wording.
- Components must account for default, hover, focus, pressed, disabled, loading,
  empty, error, and locked states when applicable. Empty states explain what
  belongs there and offer one useful action; never use “No data.”

## Decoration and motion

- Use no more than one dominant scrapbook metaphor per section and normally no
  more than three decorative assets per screen. Decoration may not cover text,
  controls, or faces.
- Original decorative SVGs use `currentColor`, tight viewBoxes, round caps and
  joins, and clean 1.5–2px strokes. Do not use generic stock couples or generate
  fake couple photography.
- Keep rotations between -1.2deg and 1.2deg and reserve them for scrapbook
  objects. Prefer thin borders and paper layers over heavy shadows.
- Motion communicates identity, reveal, continuity, or cause; it is not ambient
  decoration. Use the documented duration and easing tokens, keep hover travel
  to 2px, button press scale to 0.98, and route transitions at or below 320ms.
- Strong delight is reserved for identity entry, answer reveals, anniversaries,
  completed dreams, and milestones. Do not add confetti, autoplay sound, large
  blurred layers, or infinite particles.

## Workflow for UI tasks

Before coding a screen, state its purpose, primary action, information hierarchy,
reused/new components, mobile RTL behavior, required empty/loading/error/locked
states, and decorative asset budget.

After coding, verify:

- no horizontal overflow at 360px;
- correct Persian punctuation, mixed numerals, direction, and dates;
- visible and logical keyboard focus;
- no layout shift during theme changes;
- reduced motion preserves meaning;
- correct image and decorative-SVG accessibility;
- one obvious primary action; and
- no repeated generic rounded-card grid.
