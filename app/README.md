# Spin Ebikes app

React + Vite build of the Claude Design handoff in `../project`, mainly `All Screens.dc.html`.

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
```

## Routes

| Route | Screen |
| --- | --- |
| `/onboarding` | User Flow 1: Welcome → Choose bike → Confirm → Accessories → Features → Cart → Done |
| `/` | Home (homepage option 1c) |
| `/help` | Help |
| `/issue` | "I've got an issue" flow (User Flow 2). `/issue?step=schedule` opens at scheduling |
| `/rides` | Rides tab and incentives (User Flow 3) |
| `/screens` | All 21 screens in fixed states, like the All Screens deck. Print to PDF for one page per screen |

On screens wider than 480px the app sits in a 390×844 phone frame, as in the designs. On a phone it fills the screen.

## Structure

- `src/styles.css`: design tokens (colours, fonts) and shared classes
- `src/components/ui.tsx`: phone frame, status bar, top bar, tab bar, back button + progress, CTA bar, rows, meters
- `src/components/RideTracker.tsx`: ride tracker card (Home and Rides)
- `src/screens/*`: one component per flow. Each accepts an optional `preset` for its starting state, which the `/screens` gallery uses
- `src/data/*`: mock content (bikes, accessories, issue options, rides, incentives)

## Placeholders carried over from the design

- "More info", "View more accessories", the Servicing rows, "Edit" (Your answers), notifications and "Add to calendar" don't do anything yet.
- All data is mock data, and dates are fixed to September 2026. The avatar loads from Unsplash.
- Fonts (Inter, Bricolage Grotesque, Material Symbols Rounded) load from Google Fonts.
