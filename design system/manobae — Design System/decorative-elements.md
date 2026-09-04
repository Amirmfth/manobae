`\# Decorative Elements

Decoration is a system, not a pile of cute assets.

\#\# Core asset kit  
Create these as original SVGs with 1.5–2px imperfect-but-clean strokes:  
1\. sparkle-4.svg  
2\. sparkle-pair.svg  
3\. heart-stamp.svg  
4\. flower-5.svg  
5\. ribbon-curve.svg  
6\. pencil-underline.svg  
7\. tape-short.svg  
8\. paperclip.svg  
9\. postage-lines.svg  
10\. map-dots.svg  
11\. fold-corner.svg  
12\. paired-thread.svg

Each SVG uses currentColor, has a tight viewBox, no embedded text, no raster filters, and supports decorative aria-hidden usage. Provide outline and filled variants only when a real state needs them.

\#\# Theme allocation  
\- Night Letter: sparkles, postage lines, pencil underline, paperclip.  
\- Rose Garden: flower, ribbon, heart stamp, tape.  
\- Between Us: paired thread, map dots, sparkle pair, overlapping-paper shapes.

\#\# Usage budget  
\- Standard screen: 0–3 decorative assets.  
\- Empty state: 1 illustration \+ 1 tiny motif.  
\- Milestone: up to 5, with one dominant composition.  
\- Form: none inside input content; one motif may sit outside the form.  
\- Navigation: custom icons are functional, not decoration.  
Never scatter identical sparkles across every card.

\#\# Photographic assets  
Use your own photos as the main imagery. Optional generated/illustrated images are appropriate for:  
\- empty-state line illustrations  
\- a neutral passcode-gate scene  
\- dream-category postcard backs  
\- yearly recap covers  
\- seasonal/anniversary background plates

Do not generate fake couple photos. Do not use generic stock couples. Keep illustrations person-neutral unless based on approved character references.

\#\# Texture  
Use one subtle paper-grain PNG/WebP at 1–2% opacity, under 120KB, tiled or sized carefully. It must not reduce text sharpness. Avoid noise overlays on photos and controls.

\#\# SVG visual specification  
\- Stroke caps: round  
\- Stroke joins: round  
\- Default icon box: 24×24  
\- Decorative motif box: 48×48 or 96×96  
\- Stroke color: motif token at 60–85%  
\- Filled accents: accent-soft  
\- Rotation: selected per instance, max ±4° for isolated motifs  
\- Minimum distance from readable text: 12px

\#\# Scrapbook object rules  
Tape may anchor photos but never cover faces. Paperclips appear only on note/photo objects. Fold corners appear only on question/letter surfaces. Receipt perforation appears only on place/date tickets. A metaphor must remain consistent; decorative assets are not interchangeable.

\#\# Image loading  
Use responsive sizes, WebP/AVIF where suitable, blur placeholders for photos, explicit aspect ratios, and object-position chosen by the user. Preserve original uploads in storage while serving optimized derivatives.  
