export type RideRange = 'week' | 'month';

// Today is Friday 25 September 2026. null = the day/week hasn't happened yet.
export const RIDE_DATA: Record<RideRange, { v: (number | null)[]; l: string[]; n: (string | number)[]; hi: number; km: string; trips: string; range: string }> = {
  week: { v: [6, 12, 0, 9, 14, null, null], l: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], n: [21, 22, 23, 24, 25, 26, 27], hi: 4, km: '41 km', trips: '5', range: 'Mon 21 – Sun 27 Sep' },
  month: { v: [22, 52, 50, 41, null], l: ['1–6', '7–13', '14–20', '21–27', '28–30'], n: ['Sep', 'Sep', 'Sep', 'Sep', 'Sep'], hi: 3, km: '165 km', trips: '21', range: 'September 2026' },
};

export type Incentive = { id: string; icon: string; title: string; desc: string; goal: string; unit: 'km' | 'trips'; target: number; done: number };

export const INCENTIVES: Incentive[] = [
  { id: 'sticker', icon: 'sell', title: 'Spin sticker pack', desc: 'Five weatherproof stickers for your bike or helmet.', goal: 'Ride 50 km', unit: 'km', target: 50, done: 0 },
  { id: 'coffee', icon: 'local_cafe', title: 'Free coffee', desc: 'A drink on us at any partner café.', goal: 'Take 10 trips', unit: 'trips', target: 10, done: 0 },
  { id: 'light', icon: 'flashlight_on', title: 'Bike light upgrade', desc: 'Swap your standard light for a brighter one.', goal: 'Ride 150 km', unit: 'km', target: 150, done: 0 },
  { id: 'discount', icon: 'percent', title: '10% off next month', desc: 'Taken off your next subscription payment.', goal: 'Ride 300 km', unit: 'km', target: 300, done: 0 },
];

/** Users can work towards this many incentives at once. */
export const MAX_INCENTIVES = 2;
