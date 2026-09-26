import { useNavigate } from 'react-router-dom';
import { Icon, Phone, StatusBar, TabBar, TopBar } from '../components/ui';

const SERVICING = [
  ['calendar_month', 'Book maintenance', 'We collect it, or a mechanic comes to you'],
  ['local_shipping', 'Repair status', 'No repairs in progress'],
  ['history', 'Maintenance history', 'Last serviced 12 Sep · next due 3 Nov'],
];

export function Help() {
  const navigate = useNavigate();
  return (
    <Phone label="Help" padBottom={110} overlay={<TabBar active="help" />}>
      <div className="lime-header" style={{ paddingBottom: 84 }}>
        <StatusBar />
        <TopBar />
        <h1 className="hero-title">How can we help?</h1>
        <p className="hero-sub" style={{ maxWidth: 320 }}>Repairs and servicing are included in your plan, so there's nothing extra to pay.</p>
      </div>

      <div className="card card--raised" style={{ margin: '-64px 16px 0', padding: 18 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span className="tile ms" style={{ width: 52, height: 52, borderRadius: 18, background: 'var(--lime)', fontSize: 26 }}>build</span>
          <div>
            <div style={{ font: '600 21px/1.15 var(--font-display)' }}>I've got an issue</div>
            <div style={{ font: '13px/1.45 var(--font-body)', color: 'var(--text-2)', marginTop: 4, textWrap: 'pretty' }}>
              Tap the part of your bike that's playing up and we'll help you work out what's wrong.
            </div>
          </div>
        </div>
        <button className="pill btn-dark press" onClick={() => navigate('/issue')} style={{ marginTop: 16, width: '100%', height: 52, font: '600 15px var(--font-body)', gap: 8 }}>
          Find the issue
          <Icon name="arrow_forward" size={20} style={{ color: 'var(--lime)' }} />
        </button>
        <button className="pill btn-outline" onClick={() => navigate('/issue?step=schedule')} style={{ marginTop: 8, width: '100%', height: 48, font: '500 14px var(--font-body)', gap: 8 }}>
          <Icon name="videocam" size={20} />
          Not sure? Book a technician call
        </button>
      </div>

      <div className="section-title" style={{ margin: '22px 20px 10px' }}>Servicing</div>
      <div className="card" style={{ margin: '0 16px', padding: 6 }}>
        {SERVICING.map(([icon, title, sub], i) => (
          <div key={title}>
            {i > 0 && <div style={{ height: 1, background: 'var(--line)', margin: '0 12px' }} />}
            <button className="list-btn">
              <span className="tile ms" style={{ width: 44, height: 44, borderRadius: 14, fontSize: 22 }}>{icon}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', font: '600 15px var(--font-body)' }}>{title}</span>
                <span style={{ display: 'block', font: '13px var(--font-body)', color: 'var(--muted)', marginTop: 2 }}>{sub}</span>
              </span>
              <Icon name="chevron_right" size={22} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
        ))}
      </div>
    </Phone>
  );
}
