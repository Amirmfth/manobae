\# Vibe-Coding Brief

Paste this file into every UI implementation request together with the relevant design-system files.

\#\# Instruction  
Build this screen for “manobae,” a private two-person relationship website. Follow foundations.md, colors.md, typography.md, spacing.md, themes.md, components.md, motion.md, and decorative-elements.md as binding constraints.

The UI must feel like a digital scrapbook combined with modern editorial design. It must not resemble a SaaS dashboard or a generic AI-generated couples app.

\#\# Required implementation behavior  
\- Implement Persian RTL and English LTR from the same component tree.  
\- Use logical CSS properties.  
\- Use semantic theme tokens; no identity hex values inside components.  
\- Support Night Letter, Rose Garden, and Between Us.  
\- Use Vazirmatn/Estedad for Persian and Manrope/Fraunces for English.  
\- Keep body text at least 16px and touch targets at least 44px.  
\- Create responsive states for 360px, 768px, and 1280px.  
\- Include default, hover, focus, pressed, disabled, loading, empty, error, locked, and reduced-motion states where applicable.  
\- Use real product copy, including natural Persian—not lorem ipsum.  
\- Use at most one dominant scrapbook metaphor per section.  
\- Keep rotations subtle and limited to photos/notes.  
\- Prefer borders and paper layers over heavy shadows.  
\- Do not add gradients unless explicitly requested for a meaningful transition.  
\- Do not invent extra dashboard metrics or features.

\#\# Before coding  
Return:  
1\. screen purpose  
2\. primary user action  
3\. information hierarchy  
4\. components reused/created  
5\. mobile RTL behavior  
6\. empty/loading/error/locked states  
7\. decorative asset budget

\#\# After coding  
Verify:  
\- No horizontal overflow at 360px.  
\- Persian punctuation, mixed numerals, and dates render correctly.  
\- Keyboard focus is visible and logical.  
\- Theme change does not shift layout.  
\- Reduced motion retains meaning.  
\- Decorative SVGs are aria-hidden.  
\- Photos have useful alt text or empty alt when decorative.  
\- The screen contains one obvious primary action.  
\- No repeated rounded-card grid has appeared.

\#\# Strong rejection criteria  
Reject and redo if the result looks like a pink SaaS template, applies rounded-xl to everything, uses random emoji as the icon system, centers long Persian paragraphs, makes every section a card, hides labels in placeholders, uses more than two expressive fonts, or treats RTL as a final transform.  
