\# Typography

\#\# Recommended bilingual set

\#\#\# Default open-source production set  
\- Persian UI/body: Vazirmatn Variable  
\- Persian display: Estedad Variable  
\- English UI/body: Manrope Variable  
\- English display/editorial: Fraunces Variable  
\- Handwritten English accent: Caveat Variable  
\- Persian keepsake accent: Noto Nastaliq Urdu, used only for short quotations or signatures

Vazirmatn is the safest primary Persian choice: highly readable, modern, variable, and suitable for interfaces. Estedad gives headings more character without becoming ornamental. Do not use Nastaliq for buttons, forms, navigation, dates, or paragraphs.

\#\# Font stacks  
Persian UI:  
Vazirmatn, IRANSansX, Tahoma, Arial, sans-serif

Persian display:  
Estedad, Vazirmatn, Tahoma, sans-serif

English UI:  
Manrope, Inter, system-ui, sans-serif

English display:  
Fraunces, Georgia, serif

\#\# Scale  
| Role | Mobile | Desktop | Weight | Line height |  
|---|---:|---:|---:|---:|  
| hero | 40px | 64px | 650 | 1.10 |  
| display | 32px | 48px | 650 | 1.18 |  
| h1 | 28px | 36px | 700 | 1.25 |  
| h2 | 23px | 28px | 650 | 1.32 |  
| h3 | 19px | 22px | 650 | 1.40 |  
| body-lg | 18px | 19px | 400 | 1.75 FA / 1.60 EN |  
| body | 16px | 17px | 400 | 1.80 FA / 1.65 EN |  
| small | 14px | 14px | 450 | 1.65 |  
| label | 13px | 13px | 600 | 1.45 |

\#\# RTL and bilingual rules  
\- Apply dir=rtl to Persian content containers, not blindly to the whole app.  
\- Use CSS logical properties: margin-inline, padding-inline, inset-inline.  
\- Numbers, phone strings, URLs, and mixed dates may need dir=ltr plus unicode-bidi: isolate.  
\- Persian paragraphs are right-aligned; never justify.  
\- Use Persian digits in narrative copy if the locale is fa-IR; preserve Latin digits in codes, URLs, prices, and technical metadata.  
\- Jalali calendar is primary in Persian mode; Gregorian is optionally shown as secondary.  
\- Do not letter-space Persian.  
\- Latin uppercase metadata may use 0.04em tracking.  
\- Limit text lines to about 48–68 characters.

\#\# Expressive type budget  
A screen may use UI \+ one expressive face. Never combine Fraunces, Caveat, Estedad, and Nastaliq on the same screen. Handwriting is for captions under 12 words, labels on visual artifacts, and personal signatures.  
