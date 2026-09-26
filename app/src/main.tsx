import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Page } from './components/ui';
import { Home } from './screens/Home';
import { Help } from './screens/Help';
import { IssueFlow } from './screens/IssueFlow';
import { Onboarding } from './screens/Onboarding';
import { Rides } from './screens/Rides';
import { Gallery } from './screens/Gallery';
import './styles.css';

/** Remount a flow when its URL changes (e.g. /issue → /issue?step=schedule) so it picks up the new start step. */
function Keyed({ children }: { children: React.ReactElement }) {
  const { pathname, search } = useLocation();
  return <Page key={pathname + search}>{children}</Page>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Keyed><Home /></Keyed>} />
        <Route path="/help" element={<Keyed><Help /></Keyed>} />
        <Route path="/issue" element={<Keyed><IssueFlow /></Keyed>} />
        <Route path="/rides" element={<Keyed><Rides /></Keyed>} />
        <Route path="/onboarding" element={<Keyed><Onboarding /></Keyed>} />
        <Route path="/screens" element={<Gallery />} />
        <Route path="*" element={<Keyed><Home /></Keyed>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
