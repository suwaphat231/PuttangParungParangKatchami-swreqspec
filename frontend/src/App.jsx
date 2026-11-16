import ApplicationStatusPage from './pages/ApplicationStatusPage.jsx';
import ApplyLabBoyPage from '../../specs/001-apply-lab-boy/ApplyLabBoyPrototype.jsx';
import RecruitmentAnnouncementPrototype from '../../specs/015-create-recruitment-announcement/prototype.jsx';
import CheckWorkTimePage from './pages/CheckWorkTimePage.jsx';
import PaymentTrackingPage from './pages/PaymentTrackingPage.jsx';
import ViewApplicantsPage from './pages/ViewApplicantsPage.jsx';

// รองรับ FR-CAL-01 และ FR-CAL-05 ด้วย route สำหรับเปิดหน้า UC-19.
export default function App() {
  if (window.location.pathname === '/create-announcement') {
    return <RecruitmentAnnouncementPrototype />;
  }

  if (window.location.pathname === '/calendar') {
    return <CheckWorkTimePage />;
  }

  if (window.location.pathname === '/apply-lab-boy') {
    return <ApplyLabBoyPage />;
  }

  if (window.location.pathname === '/payments') {
    return <PaymentTrackingPage />;
  }
  if (window.location.pathname === '/list-applicants') {
    return <ViewApplicantsPage />;
  }

  return <ApplicationStatusPage />;
}
