import { useNavigate } from 'react-router-dom';
import { Icon, Phone, Stat, StatusBar, TabBar, TopBar } from '../components/ui';
import { RideTracker } from '../components/RideTracker';
import { MY_BIKE, USER_NAME } from '../data/user';

/** Homepage, option 1c: lime header, bike card, "Something not right?" entry and ride tracker. */
export function Home() {
  const navigate = useNavigate();
  return (
    <Phone label="Home" padBottom={110} overlay={<TabBar active="home" />}>
      <div className="lime-header" style={{ paddingBottom: 96 }}>
        <StatusBar />
        <TopBar />
        <div className="hero-date">Tuesday 22 September</div>
        <h1 className="hero-title" style={{ marginTop: 6 }}>Morning, {USER_NAME}.</h1>
        <p className="hero-sub">Your bike is 78% charged, with enough range for about 4 commutes.</p>
      </div>

      <div className="card card--raised" style={{ margin: '-76px 16px 0', padding: 10 }}>
        <div className="photo">
          <img src={MY_BIKE.photo} alt={MY_BIKE.name} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 8px 6px' }}>
          <div>
            <div className="kicker">My bike</div>
            <div style={{ font: '600 19px var(--font-display)', marginTop: 2 }}>{MY_BIKE.name}</div>
          </div>
        </div>
        <div className="stat-grid" style={{ paddingTop: 4 }}>
          <Stat value="78%" label="Battery" />
          <Stat value="42 km" label="Range left" />
          <Stat value="3 Nov" label="Next service" />
        </div>
      </div>

      <button
        onClick={() => navigate('/help')}
        style={{ margin: '12px 16px 0', width: 'calc(100% - 32px)', textAlign: 'left', border: 'none', background: 'var(--white)', borderRadius: 26, padding: 16, display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer' }}
      >
        <span className="tile ms" style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--lime)', fontSize: 24 }}>build</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', font: '600 16px var(--font-display)' }}>Something not right?</span>
          <span style={{ display: 'block', font: '13px/1.4 var(--font-body)', color: 'var(--text-2)', marginTop: 3, textWrap: 'pretty' }}>
            Point to it on your bike and we'll help you work it out. Repairs are included in your plan.
          </span>
        </span>
        <Icon name="arrow_forward" size={22} />
      </button>

      <RideTracker style={{ margin: '12px 16px 0' }} />
    </Phone>
  );
}
