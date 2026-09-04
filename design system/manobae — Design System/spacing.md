\# Spacing and Layout

Base unit: 4px.

\#\# Tokens  
| Token | Value |  
|---|---:|  
| 0 | 0 |  
| 1 | 4px |  
| 2 | 8px |  
| 3 | 12px |  
| 4 | 16px |  
| 5 | 20px |  
| 6 | 24px |  
| 8 | 32px |  
| 10 | 40px |  
| 12 | 48px |  
| 16 | 64px |  
| 20 | 80px |  
| 24 | 96px |

\#\# Density  
\- Controls: 12px block / 16px inline padding.  
\- Compact controls: 8px / 12px; never below 40px height.  
\- Cards/surfaces: 16px mobile, 20–24px desktop.  
\- Section gaps: 40–56px mobile, 64–96px desktop.  
\- Related text: 4–8px.  
\- Label to field: 8px.  
\- Field to help/error: 6px.  
\- Photo stack overlap: 16–28px only when content remains discoverable.

\#\# Grid  
\- 360–767px: 4 columns, 16px gutter, 16px margin.  
\- 768–1023px: 8 columns, 20px gutter, 24px margin.  
\- 1024px+: 12 columns, 24px gutter, 32px margin.  
\- Max app width: 1180px.  
\- Max reading width: 680px.  
\- Dialog width: 480px normal, 680px media-rich.

\#\# Safe areas  
Bottom navigation includes env(safe-area-inset-bottom). Sticky actions must not cover form controls. On mobile, photo pickers and calendar sheets use full-width bottom sheets.

\#\# Composition rhythm  
Alternate dense personal artifacts with breathing room. Do not place more than three equal cards in a row. If several objects share equal importance, use a list, timeline, carousel, calendar, or layered scrapbook composition instead of a dashboard grid.

\#\# RTL  
Spacing must use logical properties. Icon and text gaps remain visually consistent when direction changes. Directional icons mirror; universal icons such as play, heart, camera, and plus do not.  
