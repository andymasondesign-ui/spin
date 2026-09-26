export type Area = { id: string; label: string; icon: string; desc: string; x?: number; y?: number };
/** [id, label, hint, icon] */
export type Option = [string, string, string, string];

// x/y are percentages of the bike photo frame (tap points). "Other" is a chip only, with no tap point.
export const AREAS: Area[] = [
  { id: 'brakes', label: 'Brakes', icon: 'front_hand', desc: 'Levers, pads and discs', x: 60, y: 12 },
  { id: 'seat', label: 'Seat', icon: 'chair', desc: 'Saddle and seat post', x: 36, y: 18 },
  { id: 'battery', label: 'Battery', icon: 'battery_charging_full', desc: 'Battery, charger and power button', x: 52, y: 46 },
  { id: 'motor', label: 'Motor & Pedals', icon: 'electric_bolt', desc: 'Pedal assist, cranks and pedals', x: 48, y: 72 },
  { id: 'gears', label: 'Chain & Gears', icon: 'settings', desc: 'Chain, cassette and shifter', x: 22, y: 70 },
  { id: 'wheels', label: 'Wheels & Tyres', icon: 'tire_repair', desc: 'Tyres, spokes and hubs', x: 80, y: 72 },
  { id: 'other', label: 'Other', icon: 'more_horiz', desc: 'Something not listed here' },
];

export const SYMPTOMS: Record<string, Option[]> = {
  other: [],
  brakes: [['not-working', 'Brakes not working', 'Bike is slow to stop, or won’t stop', 'warning'], ['squeak', 'Brakes squeaking', 'Noise when you brake', 'volume_up'], ['lever', 'Lever pulls to the bar', 'Lever goes further than it should', 'back_hand']],
  seat: [['slip', 'Seat keeps slipping', 'It drops down while riding', 'arrow_downward'], ['stuck', 'Won’t adjust', 'Can’t move it up or down', 'height'], ['loose', 'Loose or wobbly', 'It moves side to side', 'vibration']],
  battery: [['charge', 'Won’t charge', 'Charger light doesn’t come on', 'battery_alert'], ['drain', 'Drains too fast', 'Range is much lower than usual', 'battery_2_bar'], ['off', 'Won’t turn on', 'Nothing happens when you press power', 'power_settings_new']],
  motor: [['assist', 'No assist when pedalling', 'Feels like a normal bike', 'electric_bolt'], ['noise', 'Strange noise', 'Grinding or whirring from the motor', 'volume_up'], ['cut', 'Assist cuts out', 'Power comes and goes', 'power_off']],
  gears: [['slip', 'Chain slipping', 'Pedals jump or skip', 'link_off'], ['shift', 'Gears won’t change', 'Shifter feels stuck', 'settings'], ['noise', 'Clicking or grinding', 'Noise while pedalling', 'volume_up']],
  wheels: [['flat', 'Flat or losing air', 'Tyre feels soft', 'tire_repair'], ['wobble', 'Wheel wobbles', 'Wheel isn’t running straight', 'sync_problem'], ['noise', 'Rubbing or ticking', 'Noise as the wheel turns', 'volume_up']],
};

// Only brakes have specific follow-ups; other areas fall back to GENERIC.
export const DETAILS: Record<string, Option[]> = {
  'brakes/not-working': [['lever', 'Lever not doing anything', 'Squeezing it has no effect', 'do_not_touch'], ['fluid', 'Fluid leaking', 'Oily marks near the brake', 'water_drop']],
  'brakes/squeak': [['wet', 'Only when it’s wet', 'Quiet on dry days', 'rainy'], ['always', 'Every time I brake', 'Loud squeal each stop', 'campaign']],
  'brakes/lever': [['bar', 'Lever touches the bar', 'No resistance left', 'back_hand'], ['spongy', 'Feels spongy', 'Soft and squishy to pull', 'touch_app']],
};
export const GENERIC: Option[] = [['always', 'It happens all the time', 'Every ride, every time', 'repeat'], ['sometimes', 'It comes and goes', 'Only on some rides', 'shuffle']];
export const UNSURE: Option = ['unsure', 'I’m not sure', 'A technician can help you figure it out', 'help'];
export const OTHER: Option = ['other', 'Other', 'Describe it in your own words', 'edit_note'];

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DOW_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Next 7 days from Wed 23 September 2026
export const DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(2026, 8, 23 + i);
  return { i, dow: DOW[d.getDay()], num: d.getDate(), full: `${DOW_FULL[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}` };
});
export const CALENDAR_MONTH = 'September 2026';

export type Half = 'AM' | 'PM';
export const SLOTS: Record<Half, string[]> = {
  AM: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30'],
  PM: ['12:30', '1:00', '1:30', '2:00', '3:00', '4:00', '5:00', '6:00'],
};
/** Deterministic mock availability. */
export const isTaken = (day: number, half: Half, t: string) => (day * 7 + t.length * 3 + (half === 'PM' ? 5 : 0) + parseInt(t)) % 5 === 0;
