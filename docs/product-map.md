# manobae product map

This document records the intended frontend route structure. Only `/enter`,
`/today`, and `/days/events/[id]` are implemented in the first prototype.

## Route inventory

```text
/
├── /enter
├── /onboarding
├── /today
├── /us
│   ├── /questions
│   ├── /questions/[id]
│   └── /appreciations
├── /explore
│   ├── /decisions
│   ├── /decisions/[id]
│   ├── /date-roulette
│   └── /places
├── /days
│   ├── /calendar
│   ├── /events/new
│   └── /events/[id]
├── /dreams
│   ├── /new
│   └── /[id]
└── /settings
```

Events are the central object connecting calendar days, memories, places,
photos, questions, and completed dreams. Themes change presentation tokens,
not route structure or component behavior.

## Primary flows

### Identity entry

`Passcode → identity detected → 600ms theme reveal → Today`

The prototype uses obvious development-only passcodes and temporary in-memory
state. Production authentication is intentionally out of scope.

### Daily question

`Today → answer privately → waiting for partner → both answered → reveal`

Each answer stays private until the reveal rule is met. The prototype exposes
the three states so the interaction can be reviewed without a backend.

### Create a memory

`Calendar → select day → add event → photos and notes → event detail`

The first prototype starts at event detail. Calendar selection, creation, and
uploads are planned routes and are not simulated as production persistence.

### Shared decision

`Create decision → both vote privately → reveal overlap → save result`

Results emphasize shared overlap rather than a winner and loser.

### Shared dream

`Add dream → partner reacts → planning → completed → convert to event`

A completed dream becomes an event so it can appear in the calendar, memory
feed, and related place history.
