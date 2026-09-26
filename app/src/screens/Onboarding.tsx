import { useState } from 'react';
import { AvatarImg, CheckDot, CtaBar, CtaLink, FlowNav, Icon, KvRow, Logo, Phone, StatusBar, SuccessHero } from '../components/ui';
import { ACCESSORIES, ANSWERS, BIKES, FEATURES, INCLUDED_IN_PLAN, LOCKED, money, type Extra } from '../data/onboarding';
import { USER_NAME } from '../data/user';

export type OnboardingStep = 'welcome' | 'bike' | 'confirm' | 'acc' | 'feat' | 'cart' | 'done';

export type OnboardingState = { step: OnboardingStep; hist: OnboardingStep[]; bike: string | null; acc: string[]; feat: string[] };

const INITIAL: OnboardingState = { step: 'welcome', hist: [], bike: null, acc: ['lock'], feat: ['thirdparty'] };
const ORDER: OnboardingStep[] = ['bike', 'confirm', 'acc', 'feat', 'cart', 'done'];
const NEXT: Partial<Record<OnboardingStep, OnboardingStep>> = { confirm: 'acc', acc: 'feat', feat: 'cart', cart: 'done' };
const sum = (l: Extra[]) => l.reduce((n, x) => n + x.price, 0);

/** Onboarding (User Flow 1): Welcome → Choose bike → Confirm → Accessories → Features → Cart → Done. */
export function Onboarding({ preset }: { preset?: Partial<OnboardingState> }) {
  const [s, setS] = useState<OnboardingState>(() => ({ ...INITIAL, ...preset }));
  const go = (step: OnboardingStep, extra: Partial<OnboardingState> = {}) => setS(st => ({ ...st, ...extra, step, hist: [...st.hist, st.step] }));
  const back = () => setS(st => (st.hist.length ? { ...st, step: st.hist[st.hist.length - 1], hist: st.hist.slice(0, -1) } : st));
  const toggle = (key: 'acc' | 'feat', id: string) => {
    if (LOCKED.includes(id)) return;
    setS(st => ({ ...st, [key]: st[key].includes(id) ? st[key].filter(x => x !== id) : [...st[key], id] }));
  };

  const step = s.step;
  const bike = BIKES.find(b => b.id === s.bike);
  const shownBike = bike ?? BIKES[0];
  const accSel = ACCESSORIES.filter(a => s.acc.includes(a.id));
  const accPaid = accSel.filter(a => !a.included);
  const featSel = FEATURES.filter(f => s.feat.includes(f.id));
  const featOpt = featSel.filter(f => !f.included);
  const total = (bike ? bike.price : 0) + sum(accSel) + sum(featSel);

  const lines: [string, string][] = bike
    ? [
        [bike.name.replace('Specialized ', ''), money(bike.price)],
        [accPaid.length ? `${accPaid.length} accessor${accPaid.length === 1 ? 'y' : 'ies'}` : 'Lock included', accPaid.length ? money(sum(accPaid)) : ''],
        [featOpt.length ? `${featOpt.length} feature${featOpt.length === 1 ? '' : 's'}` : 'Protection included', featOpt.length ? (sum(featOpt) ? money(sum(featOpt)) : 'Free') : ''],
      ]
    : [['Choose a bike to start', ''], ['Servicing and repairs', 'Incl.'], ['Theft cover', 'Incl.']];

  const isAcc = step === 'acc';
  const limeTop = step === 'welcome' || step === 'bike' || step === 'done';
  const padBottom = step === 'cart' ? 330 : step === 'bike' ? 140 : 220;

  const drawer = step !== 'welcome' && step !== 'done' && (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'var(--lime)', borderRadius: '32px 32px 0 0', padding: '18px 20px 30px', boxShadow: '0 -10px 30px rgba(26,26,26,.12)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 'none' }}>
          <div style={{ font: '500 12px var(--font-body)' }}>{step === 'cart' ? 'Total' : 'Your plan'}</div>
          <div>
            <span style={{ font: '700 34px/1 var(--font-display)', letterSpacing: '-.02em' }}>{money(total)}</span>
            <span style={{ font: '14px var(--font-body)' }}>/mo</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3, borderLeft: '1.5px solid var(--ink)', paddingLeft: 14 }}>
          {lines.map(([t, p]) => (
            <div key={t} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, font: '12px/1.3 var(--font-body)' }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t}</span>
              <span style={{ flex: 'none', fontWeight: 600 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
      {(step === 'confirm' || step === 'acc' || step === 'feat') && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="pill btn-dark" onClick={() => go(NEXT[step]!)} style={{ flex: 2, height: 52, font: '600 15px var(--font-body)', gap: 6 }}>
            {step === 'confirm' || (isAcc ? accPaid.length : featOpt.length) ? 'Confirm' : 'Skip'}
            <Icon name="arrow_forward" size={20} style={{ color: 'var(--lime)' }} />
          </button>
        </div>
      )}
      {step === 'cart' && (
        <>
          <div style={{ font: '12px/1.4 var(--font-body)', marginTop: 10 }}>Billed monthly from delivery. Servicing, repairs and theft cover included.</div>
          <button className="pill btn-dark" onClick={() => go('done')} style={{ marginTop: 14, width: '100%', height: 56, font: '600 16px var(--font-body)', gap: 8 }}>
            Check out now
            <Icon name="arrow_forward" size={20} style={{ color: 'var(--lime)' }} />
          </button>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="pill btn-outline" onClick={() => setS(INITIAL)} style={{ flex: 1, height: 46, font: '500 14px var(--font-body)' }}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );

  const overlay = (
    <>
      {step === 'welcome' && <CtaBar label="Customise your subscription" onClick={() => go('bike')} />}
      {drawer}
      {step === 'done' && <CtaLink label="Finish" to="/" />}
    </>
  );

  return (
    <Phone label="Onboarding" padBottom={padBottom} scrollKey={step} overlay={overlay}>
      <StatusBar background={limeTop ? 'var(--lime)' : undefined} />

      {!limeTop && <FlowNav onBack={back} progress={{ total: 4, done: Math.min(ORDER.indexOf(step), 4) }} />}

      {step === 'welcome' && (
        <>
          <div className="lime-header" style={{ padding: '8px 20px 96px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Logo />
              <span className="avatar" style={{ cursor: 'default' }}><AvatarImg /></span>
            </div>
            <h1 className="flow-title" style={{ marginTop: 22 }}>Welcome, {USER_NAME}.</h1>
            <p style={{ marginTop: 12, font: '15px/1.45 var(--font-body)', maxWidth: 310, textWrap: 'pretty' }}>
              Thanks for telling us a bit about you. We've used your answers to suggest the right bike and extras.
            </p>
          </div>
          <div className="card card--raised" style={{ margin: '-72px 16px 0', padding: '6px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 4px' }}>
              <div className="section-title">Your answers</div>
              <button className="btn-edit"><Icon name="edit" />Edit</button>
            </div>
            {ANSWERS.map(([icon, k, v]) => (
              <KvRow key={k} icon={icon} k={k} v={v} compact />
            ))}
          </div>
        </>
      )}

      {step === 'bike' && (
        <>
          <div className="lime-header" style={{ padding: '8px 20px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Logo />
              <button
                onClick={() => go('welcome')}
                aria-label="Edit profile"
                style={{ height: 44, padding: '0 6px 0 14px', border: '2px solid var(--ink)', borderRadius: 999, background: 'var(--white)', display: 'flex', alignItems: 'center', gap: 8, font: '600 13px var(--font-body)', cursor: 'pointer' }}
              >
                Edit profile
                <span style={{ width: 32, height: 32, borderRadius: 16, overflow: 'hidden', display: 'block' }}><AvatarImg /></span>
              </button>
            </div>
            <h1 className="flow-title" style={{ marginTop: 22 }}>Choose your bike</h1>
            <p style={{ marginTop: 10, font: '15px/1.45 var(--font-body)', maxWidth: 320, textWrap: 'pretty' }}>Every plan includes servicing, repairs and theft cover. Cancel or swap any time.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '16px 16px 0' }}>
            {BIKES.map((b, i) => {
              const on = s.bike === b.id;
              return (
                <div key={b.id} className="card" style={{ padding: 10, boxSizing: 'border-box', border: `2px solid ${on ? 'var(--ink)' : 'transparent'}` }}>
                  <div className="photo">
                    <img src={b.photo} alt={b.name} />
                    <span style={{ position: 'absolute', top: 10, left: 10, width: 30, height: 30, borderRadius: 15, background: 'var(--ink)', color: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '600 14px var(--font-display)' }}>{i + 1}</span>
                    {b.suggested && (
                      <span style={{ position: 'absolute', bottom: 10, left: 10, height: 28, padding: '0 10px', borderRadius: 999, background: 'var(--lime)', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', gap: 4, font: '600 12px var(--font-body)', boxSizing: 'border-box' }}>
                        <Icon name="auto_awesome" size={16} />
                        Suggested for you
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, padding: '12px 8px 4px' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ font: '12px var(--font-body)', color: 'var(--muted)' }}>{b.type}</div>
                      <div style={{ font: '600 19px/1.15 var(--font-display)', marginTop: 2 }}>{b.name}</div>
                    </div>
                    <div style={{ flex: 'none', textAlign: 'right' }}>
                      <span style={{ font: '700 24px var(--font-display)' }}>{money(b.price)}</span>
                      <span style={{ font: '13px var(--font-body)', color: 'var(--muted)' }}>/mo</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 8px 0' }}>
                    {b.chips.map(([icon, t]) => (
                      <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 30, padding: '0 10px', borderRadius: 999, background: 'var(--cream)', font: '500 12px var(--font-body)' }}>
                        <Icon name={icon} size={16} />
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    className="pill btn-outline"
                    onClick={() => go('confirm', { bike: b.id })}
                    style={{ marginTop: 12, width: '100%', height: 48, background: on ? 'var(--lime)' : 'var(--white)', font: '600 15px var(--font-body)', gap: 6 }}
                  >
                    {on ? 'Chosen' : 'Choose'}
                    <Icon name="arrow_forward" size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {step === 'confirm' && (
        <>
          <h1 className="flow-title" style={{ margin: '17px 20px 0' }}>Confirm your bike</h1>
          <div className="card" style={{ margin: '16px 16px 0', padding: 10 }}>
            <div className="photo"><img src={shownBike.photo} alt={shownBike.name} /></div>
            <div style={{ padding: '14px 8px 6px' }}>
              <div style={{ font: '12px var(--font-body)', color: 'var(--muted)' }}>{shownBike.type}</div>
              <div style={{ font: '600 24px/1.1 var(--font-display)', letterSpacing: '-.02em', marginTop: 2 }}>{shownBike.name}</div>
              <p style={{ marginTop: 8, font: '14px/1.45 var(--font-body)', color: 'var(--text-2)', textWrap: 'pretty' }}>{shownBike.blurb}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '4px 8px 8px' }}>
              {bike?.specs.map(([icon, t]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                  <span className="tile ms" style={{ width: 36, height: 36, borderRadius: 12, fontSize: 20 }}>{icon}</span>
                  <span style={{ font: '500 14px var(--font-body)' }}>{t}</span>
                </div>
              ))}
              {/* Placeholder: bike detail page not designed yet */}
              <button className="pill btn-outline" style={{ marginTop: 8, width: '100%', height: 48, gap: 6, font: '600 14px var(--font-body)' }}>
                More info about this bike
                <Icon name="arrow_forward" size={18} />
              </button>
            </div>
            <div style={{ marginTop: 4, background: 'var(--sand)', borderRadius: 20, padding: '14px 8px 8px' }}>
              <div style={{ font: '600 17px var(--font-display)', padding: '0 6px' }}>Included in every plan</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, marginTop: 10 }}>
                {INCLUDED_IN_PLAN.map(([icon, t]) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', borderRadius: 14, padding: 10, font: '500 13px/1.3 var(--font-body)' }}>
                    <Icon name={icon} size={20} style={{ flex: 'none' }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {(step === 'acc' || step === 'feat') && (
        <>
          <h1 className="flow-title" style={{ margin: '17px 20px 0' }}>{isAcc ? 'Choose accessories' : 'Choose features'}</h1>
          <p className="flow-sub" style={{ margin: '8px 20px 0' }}>
            {isAcc ? 'Add as many as you like. Suggestions are based on your onboarding answers.' : 'Optional extras for your plan. You can change these later.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '18px 16px 0' }}>
            {(isAcc ? ACCESSORIES : FEATURES).map(o => {
              const key = isAcc ? 'acc' : 'feat';
              const on = s[key].includes(o.id);
              const priceLabel = o.included ? 'Included with your plan' : o.free ? 'Free' : '+' + money(o.price) + '/mo' + (isAcc ? ' for 12 months' : '');
              return (
                <div
                  key={o.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  className={`select-card${on ? ' on' : ''}`}
                  onClick={() => toggle(key, o.id)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(key, o.id))}
                  style={{ display: 'block' }}
                >
                  {!isAcc && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', height: 26, padding: '0 10px', marginBottom: 10, borderRadius: 999, background: on ? 'var(--white)' : 'var(--lime)', font: '600 11px var(--font-body)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                      {o.title}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span className="tile ms" style={{ width: isAcc ? 76 : 64, height: isAcc ? 76 : 64, borderRadius: 20, background: on ? 'var(--white)' : 'var(--cream)', fontSize: 32 }}>
                      {o.img ? <img src={o.img} alt="" style={{ width: 34, height: 34, display: 'block' }} /> : o.icon}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      {isAcc && <span style={{ display: 'block', font: '600 17px/1.2 var(--font-display)' }}>{o.title}</span>}
                      <span style={{ display: 'block', font: '13px/1.4 var(--font-body)', color: 'var(--text-2)', marginTop: 3 }}>{o.desc}</span>
                      {!isAcc && (
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 8 }}>
                          {o.points?.map(pt => (
                            <span key={pt} style={{ display: 'flex', gap: 6, font: '12px/1.35 var(--font-body)' }}>
                              <Icon name="check" size={15} />
                              {pt}
                            </span>
                          ))}
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                        <span style={{ font: '600 14px var(--font-body)' }}>{priceLabel}</span>
                        {o.suggested && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, height: 22, padding: '0 8px', borderRadius: 999, background: on ? 'var(--white)' : 'var(--cream)', font: '500 11px var(--font-body)' }}>
                            <Icon name="auto_awesome" size={14} />
                            Suggested
                          </span>
                        )}
                        {!isAcc && (
                          // Placeholder: doesn't toggle the card
                          <button className="btn-more-info" onClick={e => e.stopPropagation()}>
                            More info
                            <Icon name="arrow_forward" />
                          </button>
                        )}
                      </span>
                    </span>
                    <CheckDot on={on} top />
                  </span>
                </div>
              );
            })}
          </div>
          {isAcc && (
            <>
              {/* Placeholder */}
              <button className="pill btn-outline" style={{ margin: '14px 16px 0', width: 'calc(100% - 32px)', height: 48, padding: '0 22px', gap: 6, font: '600 14px var(--font-body)' }}>
                <Icon name="add" size={20} />
                View more accessories
              </button>
              <div className="note" style={{ margin: '14px 16px 0' }}>
                <Icon name="info" />
                <span>
                  <strong style={{ fontWeight: 600 }}>Accessories are yours to keep after 12 months.</strong> Each one is paid off over 12 monthly payments. If you end your subscription before then, the accessories must be returned with the bike.
                </span>
              </div>
            </>
          )}
        </>
      )}

      {step === 'cart' && (
        <>
          <h1 className="flow-title" style={{ margin: '17px 20px 0' }}>Your cart</h1>
          {(
            [
              ['Bike', 'bike', bike ? [{ icon: 'pedal_bike', t: bike.name, p: money(bike.price) }] : []],
              ['Accessories', 'acc', accSel.map(a => ({ icon: a.icon, t: a.title, p: a.included ? 'Incl.' : money(a.price) }))],
              ['Features', 'feat', featSel.map(f => ({ icon: f.icon, t: f.title, p: f.included ? 'Incl.' : f.free ? 'Free' : money(f.price) }))],
            ] as const
          ).map(([label, editStep, rows]) => {
            const list = rows.length || editStep === 'bike' ? rows : [{ icon: 'remove', t: 'None added', p: '' }];
            return (
              <div key={label}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 20px 10px' }}>
                  <div className="section-title">{label}</div>
                  <button className="btn-edit" onClick={() => go(editStep)}><Icon name="edit" />Edit</button>
                </div>
                <div className="card" style={{ margin: '0 16px', borderRadius: 24, padding: '4px 16px' }}>
                  {list.map((r, i) => (
                    <div key={r.t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${i === list.length - 1 ? 'transparent' : 'var(--line)'}` }}>
                      <span className="tile ms" style={{ width: 44, height: 44, borderRadius: 14, fontSize: 22 }}>{r.icon}</span>
                      <span style={{ flex: 1, minWidth: 0, font: '500 14px/1.35 var(--font-body)' }}>{r.t}</span>
                      <span style={{ flex: 'none', font: '600 14px var(--font-body)' }}>{r.p}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      {step === 'done' && (
        <>
          <SuccessHero
            title="You're all set"
            text="We'll email your delivery date. Your first ride is on its way."
            titleFont="700 36px/1 var(--font-display)"
            titleMargin={16}
            maxWidth={290}
            style={{ padding: '14px 20px 30px', borderRadius: '0 0 36px 36px' }}
          />
          <div className="card" style={{ margin: '16px 16px 0', padding: 10 }}>
            <div className="photo"><img src={shownBike.photo} alt={shownBike.name} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '12px 8px 6px' }}>
              <div>
                <div style={{ font: '12px var(--font-body)', color: 'var(--muted)' }}>My bike</div>
                <div style={{ font: '600 19px var(--font-display)', marginTop: 2 }}>{shownBike.name}</div>
              </div>
              <div style={{ font: '600 15px var(--font-body)' }}>{money(total)}/mo</div>
            </div>
          </div>
          {(
            [
              ['Accessories', accSel],
              ['Features', featSel],
            ] as const
          ).map(([label, sel]) => {
            const list = sel.length ? sel.map(x => ({ icon: x.icon, t: x.title })) : [{ icon: 'remove', t: 'None added' }];
            return (
              <div key={label}>
                <div className="section-title" style={{ margin: '20px 20px 10px' }}>{label}</div>
                <div className="card" style={{ margin: '0 16px', borderRadius: 24, padding: '4px 16px' }}>
                  {list.map((r, i) => (
                    <div key={r.t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${i === list.length - 1 ? 'transparent' : 'var(--line)'}` }}>
                      <span className="tile ms" style={{ width: 40, height: 40, borderRadius: 14, fontSize: 20 }}>{r.icon}</span>
                      <span style={{ flex: 1, font: '500 14px var(--font-body)' }}>{r.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </Phone>
  );
}
