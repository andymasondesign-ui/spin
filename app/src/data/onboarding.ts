import haulSt from '../assets/bikes/haul-st.webp';
import vadoSl from '../assets/bikes/vado-sl.webp';
import turboComo from '../assets/bikes/turbo-como.webp';
import helmet from '../assets/bike-helmet.svg';

/** [icon, text] */
type IconText = [string, string];

export type Bike = { id: string; photo: string; type: string; name: string; price: number; suggested?: boolean; chips: IconText[]; blurb: string; specs: IconText[] };

export const BIKES: Bike[] = [
  {
    id: 'haul', photo: haulSt, type: 'Cargo ebike', name: 'Specialized Haul ST', price: 129, suggested: true,
    chips: [['inventory_2', 'Carries heavy loads'], ['accessibility_new', 'Step-through'], ['battery_charging_full', 'Long range']],
    blurb: 'A step-through cargo bike for school runs, groceries and anything else you need to carry.',
    specs: [['inventory_2', 'Front and rear racks for heavy loads'], ['battery_charging_full', 'Long-range battery'], ['accessibility_new', 'Low step-through frame'], ['light_mode', 'Integrated front and rear lights']],
  },
  {
    id: 'vado', photo: vadoSl, type: 'Commuter ebike', name: 'Specialized Turbo Vado SL', price: 99,
    chips: [['speed', 'Lightweight'], ['commute', 'Built for commuting'], ['water_drop', 'Built-in mudguards']],
    blurb: 'Light and quick, built for daily commutes and weekend rides around the city.',
    specs: [['speed', 'Lightweight, nimble frame'], ['battery_charging_full', 'All-day commuting range'], ['settings', 'Low-maintenance drivetrain'], ['light_mode', 'Integrated lights']],
  },
  {
    id: 'como', photo: turboComo, type: 'Comfort ebike', name: 'Specialized Turbo Como', price: 109,
    chips: [['airline_seat_recline_normal', 'Upright ride'], ['accessibility_new', 'Step-through'], ['shopping_basket', 'Basket mount']],
    blurb: 'An upright, relaxed ride with a comfy saddle for easy cruising.',
    specs: [['airline_seat_recline_normal', 'Upright riding position'], ['battery_charging_full', 'Plenty of range for errands'], ['accessibility_new', 'Step-through frame'], ['shopping_basket', 'Front basket mount']],
  },
];

export type Extra = { id: string; icon: string; img?: string; title: string; desc: string; price: number; included?: boolean; free?: boolean; suggested?: boolean; points?: string[] };

// Accessories are paid off over 12 months. The lock is always included.
export const ACCESSORIES: Extra[] = [
  { id: 'lock', icon: 'lock', title: 'Bike lock', desc: 'A heavy-duty D-lock and cable for locking up anywhere.', price: 0, included: true },
  { id: 'helmet', icon: 'sports_motorsports', img: helmet, title: 'Helmet', desc: 'Lightweight, with a rear light built in.', price: 6, suggested: true },
  { id: 'panniers', icon: 'work', title: 'Pannier bags', desc: 'Two waterproof bags that clip onto the rack.', price: 5, suggested: true },
  { id: 'child', icon: 'child_care', title: 'Child seat', desc: 'Rear-mounted seat for kids up to 22 kg.', price: 9 },
  { id: 'mount', icon: 'smartphone', title: 'Phone mount', desc: 'Keep maps in view on the handlebar.', price: 3 },
  { id: 'rain', icon: 'rainy', title: 'Rain cover', desc: 'Keeps your bike dry when it’s parked outside.', price: 4 },
];

// Third-party protection is always included.
export const FEATURES: Extra[] = [
  { id: 'thirdparty', icon: 'shield_person', title: 'Third-party protection', desc: 'If you’re in an accident, we cover damage or injury to the other party.', price: 0, included: true, points: ['Covers other people and their property', 'Legal help if a claim is made'] },
  { id: 'assist', icon: 'support_agent', title: 'Onboarding assist', desc: 'A Spin expert helps you set up and ride with confidence.', price: 0, free: true, suggested: true, points: ['Delivery and fitting at home', 'First-ride session with an expert'] },
  { id: 'range', icon: 'battery_plus', title: 'Extended range', desc: 'A larger battery so you can ride further.', price: 15, points: ['Ride further on a single charge', 'Fitted in place of your standard battery'] },
  { id: 'health', icon: 'health_and_safety', title: 'Health insurance for you', desc: 'Cover for you while you ride, not just the bike.', price: 8, points: ['Personal accident cover', 'Physio after a crash'] },
];

export const LOCKED = ['lock', 'thirdparty'];

export const INCLUDED_IN_PLAN: IconText[] = [
  ['build', 'Servicing & repairs'],
  ['gpp_good', 'Theft cover'],
  ['shield_person', 'Third-party protection'],
  ['lock', 'Bike lock'],
  ['videocam', 'Technician video calls'],
  ['swap_horiz', 'Swap or cancel any time'],
];

// Placeholder onboarding answers
export const ANSWERS: [string, string, string][] = [
  ['location_on', 'Location', 'London, UK'],
  ['directions_bike', 'Mostly riding for', 'School runs and groceries'],
  ['route', 'Typical day', 'About 12 km, some hills'],
  ['height', 'Your height', '168 cm, medium frame'],
  ['home', 'Storage', 'Ground-floor flat, no garage'],
];

export const money = (n: number) => '$' + n;
