\# Motion

Motion communicates identity, reveal, continuity, and cause. It is not constant decoration.

\#\# Runtime
\- Use `framer-motion` as the single React animation runtime. Do not mix it with the standalone `motion` package.
\- Page, reveal, gesture, layout, SVG drawing, and identity-transition motion all go through the shared motion system.
\- CSS transitions remain appropriate for simple color, border, focus, and pressed-state feedback.

\#\# Durations  
| Token | Duration | Use |  
|---|---:|---|  
| instant | 80ms | pressed state |  
| micro | 140ms | icon/check/chip |  
| quick | 220ms | dropdown, sheet feedback |  
| normal | 320ms | page/content transition |  
| identity | 600ms | passcode theme reveal |  
| keepsake | 800ms | milestone or answer reveal |

\#\# Easing  
\- enter: cubic-bezier(.16,1,.3,1)  
\- exit: cubic-bezier(.4,0,1,1)  
\- move: cubic-bezier(.65,0,.35,1)  
\- gentle spring: stiffness 260, damping 28, mass .8

\#\# Signature moments  
\- Identity reveal: paper background warms/cools, accent washes across once, motifs crossfade, greeting rises 8px.  
\- Dual-answer reveal: folded note opens or two sheets slide apart; no confetti.  
\- New memory: photo settles with 0.6° rotation and small shadow.  
\- Dream completed: gold line traces once, then becomes static.  
\- Calendar-to-event: selected day expands spatially into the event header when supported.

\#\# Interaction rules  
\- Hover displacement max 2px.  
\- Press scale 0.98 for buttons, never for large layouts.  
\- Stagger max 40ms between items and max six items.  
\- Route transition max 320ms.  
\- Do not animate height for long unknown content; use opacity plus transform or layout animation carefully.  
\- Photo parallax max 6px and desktop pointer devices only.  
\- Never autoplay sound.

\#\# Reduced motion  
With prefers-reduced-motion: reduce, remove parallax, rotations-in-motion, stagger, spatial route morphs, and drawing effects. Preserve state communication with short opacity transitions under 120ms. Identity and answer reveals must still be understandable without motion.

\#\# Performance  
Animate transform and opacity. Avoid large blurred layers and infinite particles. Decorative ambient animation is limited to one region, pauses offscreen, and is disabled on low-power/reduced-motion settings.  

\#\# Phase 6 motion vocabulary
\- Signature easing: cubic-bezier(.22,1,.36,1) for paper and photograph arrivals.  
\- Quick: 220ms for overlays and control feedback. Standard: 320ms for content changes. Slow: 520ms for photo settling. Dramatic: 760ms for a stamp, folded answer, or shared reveal.  
\- Page entrance: the dominant artifact moves 12–18px toward rest while its border or attached motif resolves; supporting objects follow within 40ms.  
\- Photo settle: translate 22px, scale .97 to 1, and resolve to the theme rotation. The mat shadow responds after the photograph lands.  
\- Folded note: the note moves toward the reader and the two answers separate into readable sheets. On mobile the reveal may occupy most of the viewport.  
\- Theme transition: palette changes over 600ms without changing geometry; identity motifs switch once the surface color is stable.  
\- Identity background: each theme owns one recognizable static pattern field plus a one-time entrance. Night Letter uses stationery grids, constellation routes, and postage; Rose Garden uses botanical repeats, paper dots, ribbons, and scalloped labels; Between Us uses paired notes, linked dots, and threads. Background fields never loop continuously.
\- Night Letter: controlled horizontal or downward travel, clipped reveals, and ink-line drawing. No bounce.  
\- Rose Garden: small upward float, soft unfolding, and one secondary flower/ribbon response. Overshoot remains subtle.  
\- Between Us: two objects enter from opposing inline directions and meet at a connector, then settle together.  
\- Reduced motion: remove parallax, stagger, drawing, scale, and rotation. Render the final layout immediately; use an optional opacity change under 120ms only when it clarifies state.  
