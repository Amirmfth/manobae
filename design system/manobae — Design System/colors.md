\# Colors

Use semantic tokens in components. Raw palette values belong only in theme definitions.

\#\# Shared paper palette  
| Token | Value | Use |  
|---|---|---|  
| paper-0 | \#FFFDF8 | raised paper |  
| paper-1 | \#FAF6ED | page background |  
| paper-2 | \#F1E9DC | subtle section |  
| ink-900 | \#2D2729 | primary text |  
| ink-700 | \#574E52 | secondary text |  
| ink-500 | \#7A7074 | muted text |  
| line | \#D8CEC2 | borders |  
| lavender | \#9A86B8 | shared accent |  
| coral | \#D77E76 | warm shared accent |  
| gold | \#C99A4A | milestone only |  
| success | \#3F7A5A | positive state |  
| danger | \#B24F59 | destructive/error |

\#\# Semantic tokens  
\- background: paper-1  
\- surface: paper-0  
\- surface-subtle: paper-2  
\- text: ink-900  
\- text-secondary: ink-700  
\- text-muted: ink-500  
\- border: line  
\- accent: theme-specific  
\- accent-strong: theme-specific  
\- accent-soft: theme-specific  
\- focus: accent-strong  
\- selection: accent-soft

\#\# Amir / Night Letter  
| Token | Value |  
|---|---|  
| accent | \#536B9B |  
| accent-strong | \#31466F |  
| accent-soft | \#DCE5F4 |  
| motif | \#7886B7 |  
| deep | \#242C42 |  
| secondary | \#8E779D |

Mood: midnight ink, old letters, cloudy blue, restrained plum.

\#\# Kimia / Rose Garden  
| Token | Value |  
|---|---|  
| accent | \#C2667A |  
| accent-strong | \#8F3F58 |  
| accent-soft | \#F5DDE3 |  
| motif | \#D58A9B |  
| deep | \#512F3B |  
| secondary | \#D49A79 |

Mood: dusty rose, berry ink, blush paper, soft peach—not candy pink.

\#\# Shared / Between Us  
| Token | Value |  
|---|---|  
| accent | \#8B72A6 |  
| accent-strong | \#5E4776 |  
| accent-soft | \#E9E0F0 |  
| motif | \#CC7C73 |  
| deep | \#3E3345 |  
| secondary | \#C59A55 |

\#\# Rules  
\- 70% paper neutrals, 20% identity tint, 10% accent/decorative color.  
\- Gold is rare: anniversaries, completed dreams, meaningful milestones.  
\- Never place small white text on light accent.  
\- Destructive controls always use danger, regardless of theme.  
\- Photos keep natural color; do not tint the entire image library.  
\- If dark mode is added later, design it as Night Archive, not automatic color inversion.  
