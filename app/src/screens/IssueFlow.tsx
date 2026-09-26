import { Fragment, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckDot, CtaBar, FlowNav, Icon, KvRow, Phone, StatusBar, SuccessHero, TabBar } from '../components/ui';
import { AREAS, CALENDAR_MONTH, DAYS, DETAILS, GENERIC, OTHER, SLOTS, SYMPTOMS, UNSURE, isTaken, type Area, type Half, type Option } from '../data/issue';
import { MY_BIKE } from '../data/user';

export type IssueStep = 'area' | 'symptom' | 'detail' | 'schedule' | 'confirm' | 'booked';

export type IssueState = {
  step: IssueStep;
  hist: IssueStep[];
  sel: string[];
  sym: Record<string, string | undefined>;
  det: Record<string, string | undefined>;
  note: Record<string, string>;
  day: number | null;
  half: Half;
  time: string | null;
};

const INITIAL: IssueState = { step: 'area', hist: [], sel: [], sym: {}, det: {}, note: {}, day: null, half: 'AM', time: null };
const ORDER: IssueStep[] = ['area', 'symptom', 'detail', 'schedule', 'confirm', 'booked'];
const NEXT: Partial<Record<IssueStep, IssueStep>> = { area: 'symptom', symptom: 'detail', detail: 'schedule', schedule: 'confirm', confirm: 'booked' };

/** "I've got an issue" flow: pick areas → symptom → detail → schedule a technician → confirm → booked. */
export function IssueFlow({ preset }: { preset?: Partial<IssueState> }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [s, setS] = useState<IssueState>(() => {
    if (preset) return { ...INITIAL, ...preset };
    // Help › "Not sure? Book a technician call" jumps straight to scheduling
    if (params.get('step') === 'schedule') return { ...INITIAL, step: 'schedule', hist: ['area'] };
    return INITIAL;
  });
  const update = (patch: Partial<IssueState> | ((st: IssueState) => Partial<IssueState>)) => setS(st => ({ ...st, ...(typeof patch === 'function' ? patch(st) : patch) }));
  const go = (step: IssueStep, extra: Partial<IssueState> = {}) => update(st => ({ ...extra, step, hist: [...st.hist, st.step] }));
  const back = () => {
    if (s.step === 'booked') return navigate('/');
    if (!s.hist.length) return navigate('/help');
    update({ step: s.hist[s.hist.length - 1], hist: s.hist.slice(0, -1) });
  };

  const step = s.step;
  const selAreas = AREAS.filter(a => s.sel.includes(a.id));
  const multi = selAreas.length > 1;
  const detListFor = (a: Area): Option[] => [...(DETAILS[`${a.id}/${s.sym[a.id]}`] || GENERIC), UNSURE];
  const day = s.day != null ? DAYS[s.day] : undefined;

  const ready = {
    area: selAreas.length > 0,
    symptom: selAreas.every(a => s.sym[a.id] && (s.sym[a.id] !== 'other' || (s.note[a.id] || '').trim())),
    detail: selAreas.every(a => s.det[a.id]),
    schedule: s.day != null && !!s.time,
    confirm: true,
    booked: false,
  }[step];

  const issue = selAreas.length
    ? selAreas
        .map(a => {
          const sy = s.sym[a.id] === 'other' ? '“' + (s.note[a.id] || '').trim() + '”' : SYMPTOMS[a.id].find(x => x[0] === s.sym[a.id])?.[1];
          const d = s.det[a.id];
          const dv = d === 'unsure' ? 'not sure' : detListFor(a).find(x => x[0] === d)?.[1];
          return [a.label, sy, dv].filter(Boolean).join(' · ');
        })
        .join('; ')
    : 'Not sure yet, I’ll show the technician';
  const when = day && s.time ? `${day.full}, ${s.time} ${s.half.toLowerCase()}` : '';

  const toggleArea = (id: string) =>
    update(st => ({ sel: st.sel.includes(id) ? st.sel.filter(x => x !== id) : [...st.sel, id], sym: id === 'other' ? { ...st.sym, other: 'other' } : st.sym }));

  const overlay =
    step === 'booked' ? (
      <TabBar active="help" />
    ) : (
      <CtaBar label={step === 'confirm' ? 'Book call' : 'Confirm'} disabled={!ready} onClick={() => ready && NEXT[step] && go(NEXT[step]!)} />
    );

  return (
    <Phone label="Issue flow" padBottom={130} scrollKey={step} overlay={overlay}>
      <StatusBar />
      <FlowNav
        onBack={back}
        backLabel={step === 'booked' ? 'Home' : 'Back'}
        progress={step === 'booked' ? undefined : { total: 5, done: Math.min(ORDER.indexOf(step), 4) + 1 }}
      />

      {step === 'area' && (
        <>
          <div style={{ padding: '17px 20px 0' }}>
            <h1 className="flow-title">Where's the problem?</h1>
            <p className="flow-sub">Tap every part of your bike that isn't working properly.</p>
          </div>
          <div className="card" style={{ margin: '18px 16px 0', padding: 10 }}>
            <div className="photo">
              <img src={MY_BIKE.photo} alt={MY_BIKE.name} />
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {AREAS.filter(a => a.x != null).map(a => {
                  const on = s.sel.includes(a.id);
                  return (
                    <button key={a.id} className="hotspot" onClick={() => toggleArea(a.id)} aria-label={a.label} aria-pressed={on} style={{ left: a.x + '%', top: a.y + '%' }}>
                      {on && <span className="hotspot__pulse" />}
                      <span className="hotspot__dot ms" style={{ background: on ? 'var(--lime)' : 'var(--white)' }}>{on ? 'check' : 'add'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '12px 4px 4px' }}>
              {AREAS.map(a => {
                const on = s.sel.includes(a.id);
                return (
                  <button key={a.id} onClick={() => toggleArea(a.id)} aria-pressed={on} className="chip" style={{ borderColor: on ? 'var(--ink)' : 'transparent', background: on ? 'var(--lime)' : 'var(--cream)' }}>
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
          {selAreas.length > 0 && (
            <div className="card" style={{ margin: '10px 16px 0', borderRadius: 24, padding: '6px 16px' }}>
              <div className="kicker" style={{ padding: '10px 0 2px' }}>{selAreas.length === 1 ? '1 area selected' : selAreas.length + ' areas selected'}</div>
              {selAreas.map((a, i) => (
                <div key={a.id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${i === selAreas.length - 1 ? 'transparent' : 'var(--line)'}` }}>
                  <span className="tile ms" style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--lime)', fontSize: 22 }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: '600 16px var(--font-display)' }}>{a.label}</div>
                    <div style={{ font: '13px/1.4 var(--font-body)', color: 'var(--text-2)', marginTop: 1 }}>{a.desc}</div>
                  </div>
                  <button onClick={() => update(st => ({ sel: st.sel.filter(x => x !== a.id) }))} aria-label={`Remove ${a.label}`} className="ms" style={{ flex: 'none', width: 36, height: 36, border: 'none', borderRadius: 18, background: 'var(--cream)', cursor: 'pointer', fontSize: 18 }}>
                    close
                  </button>
                </div>
              ))}
            </div>
          )}
          <div style={{ margin: '18px 16px 0', background: 'var(--sand)', borderRadius: 24, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ font: '600 15px var(--font-body)' }}>Not sure where it is?</div>
              <div style={{ font: '13px/1.4 var(--font-body)', color: 'var(--text-2)', marginTop: 2 }}>Show a technician on a free video call.</div>
            </div>
            <button className="pill btn-lime" onClick={() => go('schedule', { sel: [], sym: {}, det: {} })} style={{ flex: 'none', height: 40, padding: '0 14px', font: '600 13px var(--font-body)', gap: 6 }}>
              <Icon name="videocam" size={18} />
              Book a call
            </button>
          </div>
        </>
      )}

      {(step === 'symptom' || step === 'detail') && (
        <>
          <div style={{ padding: '17px 20px 0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 10px', borderRadius: 999, background: 'var(--white)', font: '500 12px var(--font-body)' }}>
              <Icon name={multi ? 'category' : selAreas[0]?.icon ?? ''} size={16} />
              {multi ? selAreas.map(a => a.label).join(' · ') : selAreas[0]?.label ?? ''}
            </div>
            <h1 className="flow-title" style={{ marginTop: 12 }}>
              {step === 'symptom' ? (multi ? "What's wrong?" : `What's wrong with the ${selAreas[0] ? selAreas[0].label.toLowerCase() : 'bike'}?`) : 'Describe the issue'}
            </h1>
            <p className="flow-sub">
              {step === 'symptom' ? (multi ? 'Pick the closest match for each area.' : 'Pick the one that sounds closest.') : 'This helps the technician prepare. Not sure is a fine answer.'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, margin: '18px 16px 0' }}>
            {selAreas.map(a => {
              const key = step === 'symptom' ? 'sym' : 'det';
              const options = step === 'symptom' ? [...SYMPTOMS[a.id], OTHER] : detListFor(a);
              return (
                <div key={a.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {multi && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px', font: '600 17px var(--font-display)' }}>
                      <Icon name={a.icon} size={20} />
                      {a.label}
                    </div>
                  )}
                  {options.map(([id, label, hint, icon]) => {
                    const on = s[key][a.id] === id;
                    return (
                      <Fragment key={id}>
                        <button
                          className="option"
                          aria-pressed={on}
                          onClick={() => update(st => (key === 'sym' ? { sym: { ...st.sym, [a.id]: id }, det: { ...st.det, [a.id]: undefined } } : { det: { ...st.det, [a.id]: id } }))}
                          style={{ borderColor: on ? 'var(--ink)' : 'transparent', background: on ? 'var(--lime)' : 'var(--white)' }}
                        >
                          <span className="tile ms" style={{ width: 48, height: 48, borderRadius: 16, fontSize: 24, background: on ? 'var(--white)' : 'var(--cream)' }}>{icon}</span>
                          <span style={{ flex: 1 }}>
                            <span style={{ display: 'block', font: '600 16px var(--font-body)' }}>{label}</span>
                            <span style={{ display: 'block', font: '13px/1.4 var(--font-body)', color: 'var(--text-2)', marginTop: 2 }}>{hint}</span>
                          </span>
                          <CheckDot on={on} />
                        </button>
                        {on && id === 'other' && (
                          <textarea
                            className="other-text"
                            rows={6}
                            value={s.note[a.id] || ''}
                            onChange={e => {
                              const v = e.target.value;
                              update(st => ({ note: { ...st.note, [a.id]: v } }));
                            }}
                            placeholder="Tell us what's happening, e.g. a rattle from the back when I go over bumps"
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              );
            })}
          </div>
          {step === 'detail' && selAreas.some(a => s.det[a.id] === 'unsure') && (
            <div className="note note--dark" style={{ margin: '12px 16px 0' }}>
              <Icon name="videocam" />
              <span>That's fine. A technician will work it out with you on a short video call, free with your plan.</span>
            </div>
          )}
        </>
      )}

      {step === 'schedule' && (
        <>
          <div style={{ padding: '17px 20px 0' }}>
            <h1 className="flow-title">Let's schedule a technician</h1>
            <p className="flow-sub">A 15-minute video call in the app. Keep your bike nearby so you can show them.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '20px 20px 10px' }}>
            <div style={{ font: '600 17px var(--font-display)' }}>Choose a day</div>
            <div style={{ font: '500 13px var(--font-body)', color: 'var(--text-2)' }}>{CALENDAR_MONTH}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 5, margin: '0 16px' }}>
            {DAYS.map(d => {
              const on = s.day === d.i;
              return (
                <button
                  key={d.i}
                  onClick={() => update({ day: d.i, time: null })}
                  aria-pressed={on}
                  style={{ height: 66, borderRadius: 999, boxSizing: 'border-box', border: `1.5px solid ${on ? 'var(--ink)' : 'transparent'}`, background: on ? 'var(--lime)' : 'var(--white)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: 0 }}
                >
                  <span style={{ font: '500 11px var(--font-body)', color: on ? 'var(--ink)' : 'var(--muted)' }}>{d.dow}</span>
                  <span style={{ font: '600 17px var(--font-display)' }}>{d.num}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '24px 20px 10px' }}>
            <div style={{ font: '600 17px var(--font-display)' }}>Choose a time</div>
            <div style={{ display: 'flex', background: 'var(--white)', borderRadius: 999, padding: 3, gap: 2 }}>
              {(['AM', 'PM'] as const).map(h => (
                <button
                  key={h}
                  onClick={() => update({ half: h, time: null })}
                  aria-pressed={s.half === h}
                  style={{ height: 32, padding: '0 14px', border: 'none', borderRadius: 999, background: s.half === h ? 'var(--ink)' : 'transparent', color: s.half === h ? 'var(--cream)' : 'var(--ink)', font: '600 13px var(--font-body)', cursor: 'pointer' }}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, margin: '0 16px' }}>
            {SLOTS[s.half].map(t => {
              const taken = s.day == null ? false : isTaken(s.day, s.half, t);
              const on = s.time === t;
              return (
                <button
                  key={t}
                  disabled={taken}
                  aria-pressed={on}
                  onClick={() => update(st => ({ day: st.day ?? 0, time: t }))}
                  style={{
                    height: 46,
                    borderRadius: 999,
                    boxSizing: 'border-box',
                    border: `1.5px solid ${on ? 'var(--ink)' : taken ? 'var(--track)' : 'transparent'}`,
                    background: on ? 'var(--lime)' : taken ? 'transparent' : 'var(--white)',
                    color: taken ? 'var(--grey-light)' : 'var(--ink)',
                    textDecoration: taken ? 'line-through' : 'none',
                    font: '500 14px var(--font-body)',
                    cursor: taken ? 'default' : 'pointer',
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <div style={{ margin: '10px 20px 0', font: '12px var(--font-body)', color: 'var(--muted)' }}>Times shown in your local time. Crossed-out slots are taken.</div>
        </>
      )}

      {step === 'confirm' && (
        <>
          <div style={{ padding: '17px 20px 0' }}>
            <h1 className="flow-title">Confirm your call</h1>
            <p className="flow-sub">Check the details before we book it in.</p>
          </div>
          <div className="card" style={{ margin: '18px 16px 0', padding: '6px 18px' }}>
            <KvRow
              icon="calendar_month"
              k="Day and time"
              v={when}
              action={
                <button onClick={() => go('schedule')} style={{ flex: 'none', border: 'none', background: 'transparent', font: '500 13px var(--font-body)', textDecoration: 'underline', cursor: 'pointer', padding: '8px 0' }}>
                  Change
                </button>
              }
            />
            <KvRow icon="videocam" k="How" v="15-minute video call in the app" />
            <KvRow icon="build" k="Issue" v={issue} />
            <KvRow icon="pedal_bike" k="Bike" v={MY_BIKE.name} />
          </div>
          <div className="note" style={{ margin: '12px 16px 0' }}>
            <Icon name="savings" />
            <span>Free with your plan. If the bike needs a repair, that's included too.</span>
          </div>
        </>
      )}

      {step === 'booked' && (
        <>
          <SuccessHero
            title="Call booked"
            text="We'll remind you 15 minutes before. The call opens right here in the app."
            titleFont="700 36px/1 var(--font-display)"
            maxWidth={280}
            style={{ margin: '18px 16px 0', borderRadius: 32, padding: '28px 20px 22px' }}
          />
          <div className="card" style={{ margin: '12px 16px 0', padding: '6px 18px' }}>
            <KvRow icon="calendar_month" k="When" v={when} />
            <KvRow icon="videocam" k="How" v="15-minute video call in the app" />
            <KvRow icon="build" k="Issue" v={issue} />
          </div>
          <div style={{ display: 'flex', gap: 8, margin: '12px 16px 0' }}>
            <button className="pill btn-outline" style={{ flex: 1, height: 48, font: '500 14px var(--font-body)', gap: 6 }}>
              <Icon name="calendar_add_on" size={18} />
              Add to calendar
            </button>
            <button className="pill btn-outline" onClick={() => update(st => ({ step: 'schedule', hist: [...st.hist, 'booked'], time: null }))} style={{ flex: 1, height: 48, font: '500 14px var(--font-body)', gap: 6 }}>
              <Icon name="edit_calendar" size={18} />
              Reschedule
            </button>
          </div>
        </>
      )}
    </Phone>
  );
}
