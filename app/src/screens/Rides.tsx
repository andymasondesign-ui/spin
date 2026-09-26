import { useState } from 'react';
import { BackButton, CheckDot, CtaBar, Icon, Meter, Phone, Stat, StatusBar, SuccessHero, TabBar, TopBar } from '../components/ui';
import { RideTracker } from '../components/RideTracker';
import { INCENTIVES, MAX_INCENTIVES, type Incentive } from '../data/rides';

export type RidesView = 'tracker' | 'choose' | 'added' | 'single';

export type RidesState = { view: RidesView; from: RidesView; mine: string[]; pick: string | null; open: string | null; last?: string };

const INITIAL: RidesState = { view: 'tracker', from: 'tracker', mine: [], pick: null, open: null };

const fmt = (n: number, u: string) => (u === 'km' ? Math.round(n * 10) / 10 + ' km' : n + ' ' + u);
const progress = (i: Incentive) => {
  const left = +(i.target - i.done).toFixed(1);
  return { ...i, pct: Math.round((i.done / i.target) * 100) + '%', left: fmt(left, i.unit) + ' to go', doneLabel: fmt(i.done, i.unit), togo: fmt(left, i.unit) };
};
const byId = (id: string) => INCENTIVES.find(i => i.id === id)!;

/** Rides tab (User Flow 3): ride tracker plus up to 2 incentives. */
export function Rides({ preset }: { preset?: Partial<RidesState> }) {
  const [s, setS] = useState<RidesState>(() => ({ ...INITIAL, ...preset }));
  const go = (view: RidesView, extra: Partial<RidesState> = {}) => setS(st => ({ ...st, ...extra, view, from: st.view }));

  const mine = s.mine.map(byId).map(progress);
  const avail = INCENTIVES.filter(i => !s.mine.includes(i.id));
  const canAdd = mine.length < MAX_INCENTIVES;
  const one = progress(byId(s.open ?? INCENTIVES[0].id));
  const added = progress(byId(s.last ?? 'sticker'));
  const toChoose = () => go('choose', { pick: null });
  const back = () => go(s.view === 'choose' && s.from === 'single' ? 'single' : 'tracker');
  const confirm = () => {
    if (!s.pick) return;
    setS(st => ({ ...st, mine: [...st.mine, st.pick!], last: st.pick!, pick: null, view: 'added', from: st.view }));
  };

  const overlay =
    s.view === 'choose' ? <CtaBar label="Confirm" onClick={confirm} disabled={!s.pick} /> : s.view === 'added' ? null : <TabBar active="rides" />;

  return (
    <Phone label="Rides" padBottom={120} scrollKey={s.view} overlay={overlay}>
      <StatusBar background={s.view === 'tracker' || s.view === 'choose' ? 'var(--lime)' : undefined} />

      {s.view === 'tracker' && (
        <>
          <div className="lime-header" style={{ paddingBottom: 84 }}>
            <TopBar />
            <h1 className="hero-title">Your rides</h1>
            <p className="hero-sub">Keep it up, you're on track for your best week yet.</p>
          </div>

          <RideTracker style={{ margin: '-64px 16px 0', boxShadow: 'var(--card-shadow)' }} />

          {mine.length === 0 ? (
            <div style={{ margin: '12px 16px 0', background: 'var(--lime)', borderRadius: 28, padding: 20 }}>
              <span className="tile ms" style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--ink)', color: 'var(--lime)', fontSize: 24 }}>redeem</span>
              <div style={{ marginTop: 14, font: '600 24px/1.1 var(--font-display)', letterSpacing: '-.02em' }}>You have no rewards yet</div>
              <div style={{ marginTop: 6, font: '14px/1.45 var(--font-body)', textWrap: 'pretty' }}>Pick a reward and every ride you take counts towards it.</div>
              <button className="pill btn-dark" onClick={toChoose} style={{ marginTop: 16, width: '100%', height: 52, font: '600 15px var(--font-body)', gap: 8 }}>
                Choose one
                <Icon name="arrow_forward" size={20} style={{ color: 'var(--lime)' }} />
              </button>
            </div>
          ) : (
            <div className="card" style={{ margin: '12px 16px 0', padding: '18px 18px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="section-title">My incentives</div>
                {canAdd ? (
                  <button className="pill btn-outline" onClick={toChoose} style={{ height: 34, padding: '0 12px', font: '500 13px var(--font-body)', gap: 4 }}>
                    <Icon name="add" size={18} />
                    Add
                  </button>
                ) : (
                  <span style={{ height: 30, padding: '0 10px', borderRadius: 999, background: 'var(--cream)', display: 'flex', alignItems: 'center', font: '500 12px var(--font-body)' }}>
                    {mine.length} of {MAX_INCENTIVES} in use
                  </span>
                )}
              </div>
              {mine.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => go('single', { open: m.id })}
                  style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', padding: '14px 0 12px', borderBottom: `1px solid ${i === mine.length - 1 ? 'transparent' : 'var(--line)'}`, cursor: 'pointer', display: 'block' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="tile ms" style={{ width: 40, height: 40, borderRadius: 14, fontSize: 20 }}>{m.icon}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', font: '600 15px var(--font-body)' }}>{m.title}</span>
                      <span style={{ display: 'block', font: '12px var(--font-body)', color: 'var(--muted)', marginTop: 2 }}>{m.left}</span>
                    </span>
                    <Icon name="chevron_right" size={22} style={{ color: 'var(--muted)' }} />
                  </span>
                  <span style={{ display: 'block', marginTop: 12 }}>
                    <Meter pct={m.pct} height={30} minWidth={52} padLeft={12} fontSize={13} />
                  </span>
                  <span className="meter-scale" style={{ marginTop: 5 }}><span>0%</span><span>100%</span></span>
                </button>
              ))}
              {!canAdd && (
                <div style={{ display: 'flex', gap: 8, margin: '4px 0 10px', padding: '10px 12px', borderRadius: 16, background: 'var(--cream)', font: '12px/1.45 var(--font-body)', color: 'var(--text-2)' }}>
                  <Icon name="info" size={18} style={{ color: 'var(--ink)' }} />
                  You can work towards 2 incentives at a time. Earn one to unlock a new slot.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {s.view === 'choose' && (
        <>
          <div className="lime-header" style={{ padding: '6px 20px 28px' }}>
            <BackButton onClick={back} />
            <div style={{ paddingTop: 18 }}>
              <h1 className="flow-title">Choose an incentive</h1>
              <p style={{ marginTop: 10, font: '15px/1.45 var(--font-body)', maxWidth: 320, textWrap: 'pretty' }}>Every ride counts towards it. You can work towards up to 2 incentives at a time.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', borderRadius: 999, background: 'var(--ink)', color: 'var(--cream)', font: '600 12px var(--font-body)' }}>
                  <span style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: MAX_INCENTIVES }, (_, i) => (
                      <span key={i} style={{ width: 8, height: 8, borderRadius: 4, background: i < mine.length ? 'var(--lime)' : 'var(--text-2)' }} />
                    ))}
                  </span>
                  {mine.length} of {MAX_INCENTIVES} in use
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '18px 16px 0' }}>
            {avail.map(o => {
              const on = s.pick === o.id;
              // Tapping the selected card again deselects it
              const pick = () => setS(st => ({ ...st, pick: st.pick === o.id ? null : o.id }));
              return (
                <div
                  key={o.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  className={`select-card${on ? ' on' : ''}`}
                  onClick={pick}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick())}
                  style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  <span className="tile ms" style={{ width: 76, height: 76, borderRadius: 20, background: on ? 'var(--white)' : 'var(--cream)', fontSize: 34 }}>{o.icon}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', font: '600 17px/1.2 var(--font-display)' }}>{o.title}</span>
                    <span style={{ display: 'block', font: '13px/1.4 var(--font-body)', color: 'var(--text-2)', marginTop: 3 }}>{o.desc}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, height: 24, padding: '0 9px', borderRadius: 999, background: on ? 'var(--white)' : 'var(--cream)', font: '500 12px var(--font-body)' }}>
                      <Icon name="flag" size={15} />
                      {o.goal}
                    </span>
                    {/* Placeholder: doesn't select the card */}
                    <button className="btn-more-info" onClick={e => e.stopPropagation()}>
                      More info
                      <Icon name="arrow_forward" />
                    </button>
                  </span>
                  <CheckDot on={on} top />
                </div>
              );
            })}
          </div>
          <button onClick={back} style={{ display: 'block', margin: '16px auto 0', border: 'none', background: 'transparent', font: '500 14px var(--font-body)', textDecoration: 'underline', cursor: 'pointer', padding: 10 }}>
            I don't want any of these yet
          </button>
        </>
      )}

      {s.view === 'added' && (
        <>
          <SuccessHero
            title="Incentive added"
            text="Every ride from now on counts towards it. We'll let you know when you've earned it."
            titleFont="700 34px/1.05 var(--font-display)"
            maxWidth={290}
            style={{ margin: '24px 16px 0', borderRadius: 32, padding: '32px 20px 24px' }}
          />
          <div className="card" style={{ margin: '12px 16px 0', padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="tile ms" style={{ width: 56, height: 56, borderRadius: 18, fontSize: 28 }}>{added.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '600 19px/1.15 var(--font-display)' }}>{added.title}</div>
                <div style={{ font: '13px/1.4 var(--font-body)', color: 'var(--text-2)', marginTop: 3 }}>{added.desc}</div>
              </div>
            </div>
            <div className="stat-grid stat-grid--2" style={{ marginTop: 14 }}>
              <Stat large value={added.goal} label="to earn it" />
              <Stat large value={added.pct} label="progress" />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '12px 16px 0' }}>
            <button className="pill" onClick={() => go('tracker')} style={{ width: '100%', height: 56, border: '1.5px solid var(--ink)', background: 'var(--ink)', color: 'var(--cream)', font: '600 16px var(--font-body)', gap: 8 }}>
              View my tracker
              <Icon name="arrow_forward" size={20} style={{ color: 'var(--lime)' }} />
            </button>
            {avail.length > 0 && canAdd && (
              <button className="pill btn-outline" onClick={toChoose} style={{ width: '100%', height: 52, font: '500 15px var(--font-body)', gap: 6 }}>
                <Icon name="add" size={20} />
                Choose another
              </button>
            )}
          </div>
        </>
      )}

      {s.view === 'single' && (
        <>
          <div style={{ padding: '6px 20px 0' }}>
            <BackButton onClick={back} />
          </div>
          <div className="card" style={{ margin: '18px 16px 0', padding: 20 }}>
            <div className="kicker">My incentive</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
              <span className="tile ms" style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--lime)', fontSize: 30 }}>{one.icon}</span>
              <div>
                <div style={{ font: '600 24px/1.1 var(--font-display)', letterSpacing: '-.02em' }}>{one.title}</div>
                <div style={{ font: '13px/1.4 var(--font-body)', color: 'var(--text-2)', marginTop: 4 }}>{one.desc}</div>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <Meter pct={one.pct} height={40} minWidth={60} padLeft={14} fontSize={15} />
            </div>
            <div className="meter-scale" style={{ marginTop: 6 }}><span>0%</span><span>100%</span></div>
            <div className="stat-grid stat-grid--2" style={{ marginTop: 16 }}>
              <Stat large value={one.doneLabel} label="done so far" />
              <Stat large value={one.togo} label="to go" />
            </div>
          </div>
          <div style={{ margin: '12px 16px 0', background: 'var(--ink)', color: 'var(--cream)', borderRadius: 28, padding: 20 }}>
            <div style={{ font: '600 20px var(--font-display)' }}>Find a new incentive</div>
            <div style={{ marginTop: 4, font: '13px/1.45 var(--font-body)', color: 'var(--grey-light)' }}>
              {canAdd ? `You can work towards up to 2 at a time. ${MAX_INCENTIVES - mine.length} slot free.` : 'You’re using both slots. Earn this one to choose another.'}
            </div>
            {canAdd && (
              <button className="pill" onClick={toChoose} style={{ marginTop: 16, width: '100%', height: 52, border: 'none', background: 'var(--lime)', font: '600 15px var(--font-body)', gap: 8 }}>
                Explore
                <Icon name="arrow_forward" size={20} />
              </button>
            )}
          </div>
        </>
      )}
    </Phone>
  );
}
