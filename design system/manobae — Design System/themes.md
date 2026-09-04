\# Themes

Theme means a coordinated token palette plus controlled personality accents. It does not duplicate components or change information architecture.

\#\# Theme layers  
1\. Base: spacing, component structure, accessibility, interaction.  
2\. Locale: RTL/LTR, calendar system, digits, type stack.  
3\. Identity: palette, radius offset, display face, motif set, emoji treatment.  
4\. Context: shared content, milestone, seasonal or anniversary state.

Priority: accessibility \> context \> identity \> locale decoration.

\#\# Amir / Night Letter  
\- Palette: cool blue, midnight ink, restrained plum.  
\- Radius offset: \-1px on large decorative surfaces only.  
\- Display: Fraunces in English; Estedad in Persian.  
\- Motifs: tiny four-point stars, crescent-like arc, postage lines, blue pencil underline.  
\- Emoji: monochrome line icon first; native emoji only in user content.  
\- Photo treatment: cooler paper mat, square corners.  
\- Tone: thoughtful, quiet, slightly cinematic.

\#\# Kimia / Rose Garden  
\- Palette: dusty rose, berry, blush paper, peach.  
\- Radius offset: \+2px on soft decorative surfaces only.  
\- Display: Fraunces or Estedad; optional short Nastaliq keepsake.  
\- Motifs: five-petal flower, ribbon curve, tiny heart stamp, rose pencil underline.  
\- Emoji: warm custom sticker set, used sparingly.  
\- Photo treatment: soft cream mat, small scallop detail on special memories.  
\- Tone: warm, expressive, sweet without becoming childish.

\#\# Shared / Between Us  
Used for events, mutual answers, matched decisions, and shared dreams.  
\- Palette: lavender, coral, cream, muted gold.  
\- Radius: base values.  
\- Motifs: two crossing lines, paired stars, overlapping paper, linked map dots.  
\- No person's avatar or color dominates.

\#\# Theme switching  
The passcode resolves identity server-side, creates a secure session, then sets data-identity on the root element. Do not store raw passcodes. Use CSS custom properties. Content authored by one person may use a tiny author accent, but shared screens remain coherent.

\#\# Seasonal overlays  
Optional and rare. A seasonal layer can replace background motif and one accent but may not alter text contrast, layout, component behavior, or core palette. Anniversary mode lasts one session/day and uses gold sparingly.

\#\# Token contract  
Components may consume:  
\--bg, \--surface, \--surface-subtle, \--text, \--text-secondary, \--muted, \--border, \--accent, \--accent-strong, \--accent-soft, \--focus, \--radius-control, \--radius-surface, \--shadow-lift.  
Components must never contain identity-specific hex values.  
