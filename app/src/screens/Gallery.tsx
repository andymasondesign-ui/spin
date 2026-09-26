import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Home } from './Home';
import { Help } from './Help';
import { IssueFlow, type IssueState } from './IssueFlow';
import { Onboarding, type OnboardingState } from './Onboarding';
import { Rides } from './Rides';

// Fixed states for each slide, matching the presets in project/All Screens.dc.html
const sel = ['brakes'];
const sym = { brakes: 'not-working' };
const det = { brakes: 'unsure' };
const when = { day: 2, half: 'AM', time: '10:30' } as const;
const ob = { bike: 'haul', acc: ['lock', 'helmet'], feat: ['thirdparty'] };

const issue = (p: Partial<IssueState>) => <IssueFlow preset={p} />;
const onboarding = (p: Partial<OnboardingState>) => <Onboarding preset={p} />;

const SLIDES: [string, ReactNode][] = [
  ['01 Home', <Home />],
  ['02 Help', <Help />],
  ['03 Issue · Choose area', issue({ step: 'area' })],
  ['04 Issue · Area selected', issue({ step: 'area', sel })],
  ['05 Issue · Symptom', issue({ step: 'symptom', hist: ['area'], sel })],
  ['06 Issue · Detail', issue({ step: 'detail', hist: ['area', 'symptom'], sel, sym })],
  ['07 Issue · Schedule call', issue({ step: 'schedule', hist: ['area', 'symptom', 'detail'], sel, sym, det, ...when })],
  ['08 Issue · Confirm', issue({ step: 'confirm', hist: ['area', 'symptom', 'detail', 'schedule'], sel, sym, det, ...when })],
  ['09 Issue · Booked', issue({ step: 'booked', hist: ['area', 'symptom', 'detail', 'schedule', 'confirm'], sel, sym, det, ...when })],
  ['10 Onboarding · Welcome', onboarding({ step: 'welcome' })],
  ['11 Onboarding · Choose bike', onboarding({ step: 'bike', hist: ['welcome'] })],
  ['12 Onboarding · Accessories', onboarding({ step: 'acc', hist: ['welcome', 'bike'], ...ob })],
  ['13 Onboarding · Features', onboarding({ step: 'feat', hist: ['welcome', 'bike', 'acc'], ...ob })],
  ['14 Onboarding · Confirm', onboarding({ step: 'confirm', hist: ['welcome', 'bike', 'acc', 'feat'], ...ob })],
  ['15 Onboarding · Cart', onboarding({ step: 'cart', hist: ['welcome', 'bike', 'acc', 'feat', 'confirm'], ...ob })],
  ['16 Onboarding · Done', onboarding({ step: 'done', hist: ['welcome', 'bike', 'acc', 'feat', 'confirm', 'cart'], ...ob })],
  ['17 Rides · Tracker, no rewards', <Rides preset={{ view: 'tracker', mine: [] }} />],
  ['18 Rides · Find incentives', <Rides preset={{ view: 'choose', mine: [], pick: 'coffee' }} />],
  ['19 Rides · Incentive added', <Rides preset={{ view: 'added', mine: ['coffee'], last: 'coffee' }} />],
  ['20 Rides · My incentives', <Rides preset={{ view: 'tracker', mine: ['coffee', 'sticker'] }} />],
  ['21 Rides · Single incentive', <Rides preset={{ view: 'single', mine: ['coffee', 'sticker'], open: 'coffee' }} />],
];

const slug = (label: string) => 's' + label.slice(0, 2);

/** Every screen side by side as 560×1000 slides. Printing from a browser gives one page per screen. */
export function Gallery() {
  return (
    <div className="gallery">
      <div className="gallery__head">
        <div>
          <div className="gallery__title">All screens</div>
          <div className="gallery__hint">
            {SLIDES.length} screens, each shown in a fixed state. Every screen still responds to taps. · <Link to="/">Open the app</Link>
          </div>
        </div>
      </div>
      <div className="gallery__grid">
        {SLIDES.map(([label, screen]) => (
          <section key={label} className="slide" id={slug(label)} data-label={label}>
            <span className="slide__label">{label}</span>
            <div className="slide__canvas">{screen}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
