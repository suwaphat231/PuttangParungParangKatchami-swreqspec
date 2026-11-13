import ApplicationStatusPage from './pages/ApplicationStatusPage.jsx';
import PaymentTrackingPage from './pages/PaymentTrackingPage.jsx';
import ViewApplicantsPage from './pages/ViewApplicantsPage.jsx';

export default function App() {
  if (window.location.pathname === '/payments') {
    return <PaymentTrackingPage />;
  }
  if (window.location.pathname === '/list-applicants') {
    return <ViewApplicantsPage />;
  }

  return <ApplicationStatusPage />;
}
