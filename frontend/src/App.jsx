import ApplicationStatusPage from './pages/ApplicationStatusPage.jsx';
import PaymentTrackingPage from './pages/PaymentTrackingPage.jsx';

export default function App() {
  if (window.location.pathname === '/payments') {
    return <PaymentTrackingPage />;
  }

  return <ApplicationStatusPage />;
}
