\# Components

Every component uses semantic tokens and supports RTL/LTR, keyboard operation, touch, loading, error, empty, disabled, and reduced-motion states.

\#\# Primitive families  
\#\#\# Actions  
Primary button, secondary button, quiet button, icon button, destructive button. One primary action per view. Buttons use 10px radius—not pills by default.

\#\#\# Inputs  
Text field, textarea, PIN input, segmented control, chips, sliders, photo picker, date/time picker, place search. Labels are always visible. Placeholder is not a label.

\#\#\# Navigation  
Mobile bottom bar: Today, Us, Explore, Our Days, Dreams. Desktop: compact top bar. Active state combines shape, icon, and text—not color alone.

\#\# Signature components  
\#\#\# Daily Question / Folded Note  
One prompt, private-answer status, reveal condition, answer action. Fold corner is decorative only. Locked state clearly says whose answer is missing.

\#\#\# Appreciation Slip  
Very small writing ritual. Looks like a clipped paper strip, not a full card.

\#\#\# Memory Polaroid  
Image, date, place, caption, author. Rotation variants: \-0.8°, 0°, 0.7°. Rotation disabled inside lists and forms.

\#\#\# Event Page  
Central artifact for date/moment/milestone/trip. Header, place, date, shared notes, each person's note, media strip, related question/dream. Calendar, map, and memory feed link here.

\#\#\# Our Days Calendar  
Normal readable calendar first; scrapbook markers second. Each day may show at most two markers plus overflow. Persian locale uses Jalali month layout. Selecting a day opens a bottom sheet on mobile.

\#\#\# Dream Postcard  
Front: title, image/motif, category, both-person interest. Back/detail: status, notes, cost, places, links. States: someday, planning, planned, done.

\#\#\# Decision Ballot  
Options remain private until rules permit reveal. Results emphasize overlap rather than winner/loser.

\#\#\# Date Roulette Ticket  
Shows suggestion, energy, budget, duration, distance, source, reroll, save. Personalized suggestions cite the saved place or dream that produced them.

\#\#\# Place Receipt  
Place name, neighborhood, tags, saved/visited/favorite status, related events. Use map metadata carefully; do not imitate a real financial receipt.

\#\#\# Identity Gate  
Six-digit passcode, neutral shared visual before identity is known, rate-limited errors, and a 600ms identity reveal after success.

\#\# Overlay rules  
Use dialogs for focused confirmation and bottom sheets for mobile creation. Avoid nesting overlays. Destructive actions require explicit wording.

\#\# Empty states  
Never say “No data.” Say what belongs here and offer one action:  
\- “اولین روزتان را اینجا نگه دارید.”  
\- “هنوز کافه‌ای برای رفتن ذخیره نکرده‌اید.”  
Use a small line illustration, not a giant generic icon.  
