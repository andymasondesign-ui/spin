import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/spin-logo-dark.svg';
import { AVATAR_URL, USER_NAME } from '../data/user';

export function Icon({ name, size, style, className = '' }: { name: string; size?: number; style?: CSSProperties; className?: string }) {
  return (
    <span className={`ms ${className}`} style={size ? { fontSize: size, ...style } : style} aria-hidden="true">
      {name}
    </span>
  );
}

/** Mock device frame. `scrollKey` resets the scroll position whenever it changes (e.g. on a new step). */
export function Phone({ children, overlay, padBottom, scrollKey, label }: { children: ReactNode; overlay?: ReactNode; padBottom: number; scrollKey?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
  }, [scrollKey]);
  return (
    <div className="phone" data-screen-label={label}>
      <div ref={ref} className="phone-scroll" style={{ paddingBottom: padBottom }}>
        {children}
      </div>
      {overlay}
    </div>
  );
}

/** Standalone page wrapper: centres the phone on the canvas colour, with links to the other flows. */
export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="page">
      <nav className="page-nav" aria-label="Prototype sections">
        <NavLink to="/onboarding">Onboarding</NavLink>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/help">Help</NavLink>
        <NavLink to="/issue">Issue flow</NavLink>
        <NavLink to="/rides">Rides</NavLink>
        <NavLink to="/screens">All screens</NavLink>
      </nav>
      {children}
    </div>
  );
}

export function StatusBar({ background }: { background?: string }) {
  return (
    <div className="status-bar" style={background ? { background } : undefined}>
      <span>9:41</span>
      <span className="ms">signal_cellular_alt wifi battery_full</span>
    </div>
  );
}

export function Logo() {
  return <img src={logo} alt="Spin Ebikes" className="logo" />;
}

/** Profile photo; falls back to the initial if the photo can't load (offline, or where external images are blocked). */
export function AvatarImg() {
  const [failed, setFailed] = useState(false);
  if (failed)
    return <span style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink)', color: 'var(--lime)', font: '600 15px var(--font-display)' }}>{USER_NAME[0]}</span>;
  return <img src={AVATAR_URL} alt={USER_NAME} onError={() => setFailed(true)} />;
}

/** Logo on the left; notifications and account on the right. */
export function TopBar() {
  return (
    <div className="top-bar">
      <Logo />
      <div className="top-bar__actions">
        <button className="icon-btn ms" aria-label="Notifications">
          notifications<span className="icon-btn__dot" />
        </button>
        <button className="avatar" aria-label="Account">
          <AvatarImg />
        </button>
      </div>
    </div>
  );
}

export function BackButton({ onClick, label = 'Back' }: { onClick: () => void; label?: string }) {
  return (
    <button className="btn-back" onClick={onClick}>
      <Icon name="chevron_left" />
      {label}
    </button>
  );
}

export function Progress({ total, done }: { total: number; done: number }) {
  return (
    <div className="progress">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`progress__seg${i < done ? ' on' : ''}`} />
      ))}
    </div>
  );
}

/** Back button with the step progress bar below it (issue and onboarding flows). */
export function FlowNav({ onBack, backLabel, progress }: { onBack: () => void; backLabel?: string; progress?: { total: number; done: number } }) {
  return (
    <div className="flow-nav">
      <BackButton onClick={onBack} label={backLabel} />
      {progress && <Progress {...progress} />}
    </div>
  );
}

type Tab = 'home' | 'help' | 'rides';
const TABS: [Tab, string, string, string][] = [
  ['home', 'home', 'Home', '/'],
  ['help', 'support', 'Help', '/help'],
  ['rides', 'bar_chart', 'Rides', '/rides'],
];

export function TabBar({ active }: { active: Tab }) {
  return (
    <div className="tab-bar">
      <nav className="tab-bar__inner">
        {TABS.map(([id, icon, label, to]) =>
          id === active ? (
            <div key={id} className="tab active" aria-current="page">
              <Icon name={icon} />
              {label}
            </div>
          ) : (
            <Link key={id} to={to} className="tab">
              <Icon name={icon} />
              {label}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}

export function CtaBar({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <div className="cta-bar">
      <button className="cta" onClick={onClick} disabled={disabled}>
        {label}
        <Icon name="arrow_forward" />
      </button>
    </div>
  );
}

export function CtaLink({ label, to }: { label: string; to: string }) {
  const navigate = useNavigate();
  return (
    <div className="cta-bar">
      <button className="cta" onClick={() => navigate(to)}>
        {label}
        <Icon name="arrow_forward" />
      </button>
    </div>
  );
}

/** Round check indicator. `top` pins it to the top of a tall card instead of centring it. */
export function CheckDot({ on, top }: { on: boolean; top?: boolean }) {
  return <span className={`check-dot ms${on ? ' on' : ''}`} style={top ? { alignSelf: 'flex-start' } : undefined}>{on ? 'check' : ''}</span>;
}

export function KvRow({ icon, k, v, action, compact }: { icon: string; k: string; v: ReactNode; action?: ReactNode; compact?: boolean }) {
  return (
    <div className="kv-row" style={compact ? { padding: '12px 0' } : undefined}>
      <span className="tile ms">{icon}</span>
      <div className="kv-row__body">
        <div className="kv-row__k">{k}</div>
        <div className="kv-row__v">{v}</div>
      </div>
      {action}
    </div>
  );
}

export function Stat({ value, label, large }: { value: ReactNode; label: string; large?: boolean }) {
  return (
    <div className={`stat${large ? ' stat--lg' : ''}`}>
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}

/** Lime confirmation block with a big check (Call booked, Incentive added, You're all set). */
export function SuccessHero({ title, text, titleFont, titleMargin = 18, maxWidth, style }: { title: string; text: string; titleFont: string; titleMargin?: number; maxWidth: number; style: CSSProperties }) {
  return (
    <div style={{ background: 'var(--lime)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', ...style }}>
      <span className="success-icon ms">check</span>
      <h1 style={{ marginTop: titleMargin, font: titleFont, letterSpacing: '-.03em' }}>{title}</h1>
      <p style={{ marginTop: 10, font: '15px/1.45 var(--font-body)', maxWidth, textWrap: 'pretty' }}>{text}</p>
    </div>
  );
}

/** Progress meter used for incentives. The percentage sits inside the fill, left-aligned. */
export function Meter({ pct, height, minWidth, padLeft, fontSize }: { pct: string; height: number; minWidth: number; padLeft: number; fontSize: number }) {
  return (
    <span className="meter" style={{ height }}>
      <span className="meter__fill" style={{ width: pct, minWidth, paddingLeft: padLeft, font: `600 ${fontSize}px var(--font-body)` }}>
        {pct}
      </span>
    </span>
  );
}
