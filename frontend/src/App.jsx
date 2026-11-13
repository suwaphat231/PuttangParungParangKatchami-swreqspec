import ApplicationStatusPage from './pages/ApplicationStatusPage.jsx';
import ApplyLabBoyPage from '../../specs/001-apply-lab-boy/ApplyLabBoyPrototype.jsx';
import RecruitmentAnnouncementPrototype from '../../specs/015-create-recruitment-announcement/prototype.jsx';
import CheckWorkTimePage from './pages/CheckWorkTimePage.jsx';
import PaymentTrackingPage from './pages/PaymentTrackingPage.jsx';

export default function App() {
  if (window.location.pathname === '/create-announcement') {
    return <RecruitmentAnnouncementPrototype />;
  }

  if (window.location.pathname === '/calendar/check') {
    return <CheckWorkTimePage />;
  }

  if (window.location.pathname === '/apply-lab-boy') {
    return <ApplyLabBoyPage />;
  }

  if (window.location.pathname === '/payments') {
    return <PaymentTrackingPage />;
  }

  return <ApplicationStatusPage />;
}
