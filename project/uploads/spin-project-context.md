# Project Context: Spin Ebikes — Subscription Ebike Platform

*Reference document summarizing the project so far. Independent UX case study for portfolio.*

## Overview
**Spin Ebikes** (previously named "Loop"/"Loops") is a subscription-based ebike platform — "ebike as a service" rather than ownership. Users pay a recurring fee for access to an ebike, with maintenance, insurance, servicing, and upgrades bundled in.

**Why this problem:** Buying an ebike is a high-stakes, high-friction decision — high upfront cost, no easy way to try before buying, and full ownership burden (maintenance, storage, theft, depreciation) falling on the buyer from day one. Subscription is a genuine, underexplored way to lower that barrier and shift more people from cars to ebikes for everyday trips.

## Problem Statements (mapped to the three core flows)
1. **Subscription, Bike & Accessory Choice** — First-time and price-sensitive users don't know enough about ebikes to confidently choose the right plan, bike, or accessories, and are wary of committing to a recurring cost for something they haven't tried.
2. **Maintenance** — Users default to self-diagnosing (friends/YouTube) rather than trusting the subscription's support, because they don't know if a problem is serious, expect shop-style costs, and lack confidence help will be fast or easy to access.
3. **Data Tracking & Rewards** — Users have no ongoing way to see whether the ebike is actually working for them (time/money saved, car trips replaced), making the habit hard to reinforce once initial novelty fades.

## Competitor Set
Ridepanda, Friiway, Dance, Swapfiets — see full USP/advantage/disadvantage breakdown in prior research docs. Key takeaway: Friiway/Dance split on partnership vs. vertical integration; Swapfiets differentiates on service guarantee rather than the bike itself.

## Personas
- **The Convertible Commuter (Drives)** — grounded in Toby, Jonny, Laura. Weighs an ebike against a car they already trust; convenience/time comparisons matter most. Motivated by low-risk trial; frustrated by cost perception gaps, inconsistent infrastructure, and lock-in fears.
- **The Reluctant Independent (Doesn't Drive)** — grounded in Caitlin. No car-based mental model to compare against; hesitation rooted in safety, control, and unfamiliarity rather than cost. Sees subscription as reducing responsibility, not gaining independence.

## Project Goals
- **User:** low-commitment trial, trip-fit clarity before signing up, safety/confidence (not just cost), fast help without assuming self-repair, storage/theft handled, flexible pause/swap without penalty
- **Business:** convert hesitant non-owners, reduce churn via genuinely reliable flexibility, build trust with familiar signals, incremental accessory revenue, long-term car-dependency-reduction narrative, predictable fleet/service costs
- **Technical:** billing supporting pause/resume + mid-cycle swaps, fleet/inventory tracking for consistent swaps, in-app guided diagnostics, service scheduling/logistics, storage/security guidance, self-serve plan management
- **Intersecting (strongest for case study):** low-commitment starter plan; reliable pause/resume; consistent fleet on swap; guided self-diagnosis before support; transparent/familiar trust signals

## Feature Set (Must-Have / Nice-to-Have / Delightful / Later)
Full breakdown exists in `feature-set-ebike-subscription.md`. Highlights:
- **Must-have:** transparent plan tiers, bike/accessory selection with real specs, starter plan, in-app maintenance request, service scheduling, basic ride log
- **Nice-to-have:** trip-comparison tool, bundled vs. à la carte accessories, self-serve pause/resume, guided self-diagnosis, savings dashboard
- **Delightful:** confidence-check onboarding for nervous riders, live inventory view before swap arrives, video-call technician triage, proactive maintenance nudges, personal CO2/car-trip milestones
- **Later:** cargo/family bikes, cross-city bike transfer, B2B/employer channel, partner repair network, community/social features

## Sitemap
Seven top-level areas: Onboarding, Home (Dashboard), Subscription/Bike/Accessory Choice (Flow 1), My Subscription (account management), Maintenance (Flow 2), Data Tracking & Rewards (Flow 3), Account & Settings. Full hierarchy in `sitemap-ebike-subscription.md`.

## Research Highlights (4 interviews: Laura, Jonny, Caitlin, Toby)
- Cost is a barrier but often a *perceived* one, not confirmed
- Subscription fatigue is real — "not another monthly fee" objection independent of price
- Theft/storage concerns are universal but solution differs by living situation
- Subscription's strongest pull is "try before you own," not permanent ownership replacement
- Pausing is wanted but participants doubt it's operationally realistic
- Accessories split: some want control/à la carte, others expect bundled tiers
- Non-driver (Caitlin) has a distinct mental model — subscription = reduced responsibility, not new independence
- Safety/speed anxiety is a first-order barrier for some, separate from cost or theft
- Trust in the company comes from conventional signals: reviews, professional site, word of mouth
- Car replacement is partial and trip-specific, not total, for every participant

## Usability Testing Findings (lo-fi, 3 participants: Laura, Rachael, Caitlin)
**What worked:** confirmation checkpoints ("is this what you want?") landed well across all three; task sequences were logically clear; self-diagnosis concept validated when explained.
**Needs addressing:**
- No clear "add to cart" affordance in selection flow
- No skip option for accessories/onboarding assistance — forced-choice friction
- Ambiguous labels ("Save", "Track") caused confusion
- Users don't know bike part names/locations — need a visual/clickable diagram, not text-based part selection
- Reward/incentive mechanic needs built-in explanation (progress states, what a "sticker" is) rather than assuming understanding
- Navigation between Home and Track/Rewards needs clearer labeling

## Brand
- **Name:** Spin Ebikes (previously "Loop"/"Loops")
- **Brand values:** Approachable, Low-risk, Transparent, Reliable (Purposeful as an optional 5th, mission-driven but less directly evidenced)
- **Typography:** Bricolage Grotesque (headings), Inter (body) — both confirmed available natively in Figma via Google Fonts
- **Color palette (confirmed direction — lime/moodboard-inspired):**
  | Role | Hex |
  |---|---|
  | Primary (near-black) | `#1A1A1A` |
  | Primary accent (electric lime) | `#D4FF3D` |
  | Secondary (muted olive/sage) | `#8A9A6B` |
  | Neutral light (warm off-white) | `#F5F3ED` |
  | Neutral mid (warm grey) | `#8C8C88` |
  | Support (soft cream-yellow) | `#F0E6C8` |
  - The earlier teal/coral direction was explored first but not adopted — lime/near-black is the confirmed direction, matching a bolder, more tech-forward feel than the original brand-values-first palette.

## Status / Next Steps
Research, personas, goals, feature set, sitemap, and brand foundations are complete. Next: task flows for the three core flows, wireframes, and higher-fidelity design incorporating usability testing fixes.
