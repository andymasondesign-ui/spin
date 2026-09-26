import { useState, type CSSProperties } from 'react';
import { RIDE_DATA, type RideRange } from '../data/rides';

/** "Ride tracker" card shared by Home and the Rides tab. Week shows Mon–Sun; Month shows date ranges per week. */
export function RideTracker({ style, defaultRange = 'week' }: { style?: CSSProperties; defaultRange?: RideRange }) {
  const [range, setRange] = useState<RideRange>(defaultRange);
  const d = RIDE_DATA[range];
  const max = Math.max(...d.v.map(v => v ?? 0));

  return (
    <div className="card" style={{ padding: 18, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="section-title">Ride tracker</div>
          <div style={{ font: '12px var(--font-body)', color: 'var(--muted)', marginTop: 2 }}>{d.range}</div>
        </div>
        <div style={{ display: 'flex', background: 'var(--cream)', borderRadius: 16, padding: 3 }} role="group" aria-label="Range">
          {(['week', 'month'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              style={{ border: 'none', borderRadius: 13, padding: '6px 12px', font: '500 12px var(--font-body)', cursor: 'pointer', background: range === r ? 'var(--ink)' : 'transparent', color: range === r ? 'var(--cream)' : 'var(--text-2)' }}
            >
              {r === 'week' ? 'Week' : 'Month'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 18, marginTop: 14 }}>
        <div>
          <div style={{ font: '600 26px var(--font-display)' }}>{d.km}</div>
          <div style={{ font: '12px var(--font-body)', color: 'var(--muted)' }}>ridden</div>
        </div>
        <div>
          <div style={{ font: '600 26px var(--font-display)' }}>{d.trips}</div>
          <div style={{ font: '12px var(--font-body)', color: 'var(--muted)' }}>trips</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 124, marginTop: 16 }}>
        {d.v.map((v, i) => {
          const hi = i === d.hi;
          // null = hasn't happened yet: dashed empty outline at full height
          const future = v == null;
          const height = v == null ? '100%' : Math.max(6, Math.round((v / max) * 76)) + '%';
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, justifyContent: 'flex-end', height: '100%' }}>
              <div
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  borderRadius: 8,
                  height,
                  background: future ? 'transparent' : hi ? 'var(--ink)' : v ? 'var(--bar)' : 'var(--line)',
                  border: future ? '1.5px dashed var(--track)' : 'none',
                }}
              />
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', font: `${hi ? 600 : 400} 11px/1.3 var(--font-body)`, color: hi ? 'var(--ink)' : 'var(--muted)' }}>
                <span>{d.l[i]}</span>
                <span>{d.n[i]}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
