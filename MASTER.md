# manobae visual implementation contract

This file translates the binding documentation in `design system/manobae — Design System/` into a compact implementation contract. The design-system folder remains the final authority.

## Experience thesis

manobae is a private bilingual journal for Amir and Kimia. It should feel collected rather than generated: photographs, dates, imperfect notes, ordinary Tehran details, and two points of view make the visual world. The primary metaphor is a modern editorial scrapbook, never a dashboard.

## Identity DNA

- Night Letter: clipped and straight paper, cooler photo mats, fine ink borders, postage and star-chart marks, restrained ornament, Estedad display type, deliberate horizontal movement.
- Rose Garden: organic and scalloped paper, warm mats, tape, flowers and ribbon curves, denser layering, a rounder Estedad treatment on selected Persian headings, and buoyant unfolding movement. A distinct Nastaliq role remains reserved until a licensed local font file can be added without a network-dependent build.
- Between Us: overlapping sharp and soft papers, paired stars, linked map dots and stitched thread, balanced lavender/coral/gold, two-object meeting choreography.

Identity differences resolve through semantic CSS variables: `--surface-shape`, `--paper-shape`, `--display-theme-fa`, `--keepsake-theme-fa`, `--decor-density`, `--photo-mat`, `--photo-mat-inset`, `--paper-border-style`, `--object-rotation`, `--motion-shift`, and `--background-composition`.

## Composition and behavior

- One emotional focus and one primary action per screen.
- Use 4px spacing tokens, 16px mobile gutters, 1180px max width, and 680px prose width.
- Use a single narrative column on mobile, purposeful overlap on photographs and paper only, and no more than three equal cards in a row.
- Body type remains Vazirmatn (Persian) or Manrope (English). Expressive type is restricted to a display face plus a short keepsake accent.
- Motion expresses paper weight, reveal, ink, and connection. Routine motion is 80–320ms; signature arrivals can use 520–800ms. All spatial movement has a reduced-motion equivalent.
- Every interactive target is at least 44px, focus is visible, labels remain visible, photos carry useful alt text, and decorative motifs are hidden from assistive technology.

## Page contracts

- Today: greeting and days together → Kimia note → folded daily question → mood/appreciation → horizontal recent-memory filmstrip → on-this-day memory → plan/place/inside joke → quiet closing.
- Event: arrival → main photographic scene → shared account → Amir/Kimia perspectives → physical artifacts → linked place/dream → closing line.

## Rejection checks

Reject uniform rounded-card grids, pink SaaS styling, meaningless hearts or emoji, gradients used as decoration, centered long Persian copy, arbitrary values where a token exists, identity-specific hex values in components, inaccessible motion, and mobile layouts that merely shrink desktop.
