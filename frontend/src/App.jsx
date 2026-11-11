import ApplicationStatusPage from './pages/ApplicationStatusPage.jsx';
import ApplyLabBoyPage from '../../specs/001-apply-lab-boy/ApplyLabBoyPrototype.jsx';
import PaymentTrackingPage from './pages/PaymentTrackingPage.jsx';

export default function App() {
  if (window.location.pathname === '/apply-lab-boy') {
    return <ApplyLabBoyPage />;
  }

  if (window.location.pathname === '/payments') {
    return <PaymentTrackingPage />;
  }

  return <ApplicationStatusPage />;
}
