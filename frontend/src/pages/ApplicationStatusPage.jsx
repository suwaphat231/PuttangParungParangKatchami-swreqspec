import { useEffect, useState } from 'react';
import ApplicationStatusDetail from '../components/ApplicationStatusDetail.jsx';
import { applicationStatusApi } from '../api/applicationStatus.js';

export default function ApplicationStatusPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isActive = true;

    applicationStatusApi.listApplications()
      .then((payload) => {
        const records = Array.isArray(payload?.applications)
          ? payload.applications
          : Array.isArray(payload)
            ? payload
            : payload?.status
              ? [payload]
              : [];
        if (isActive) {
          setApplications(records);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isActive) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main>
      <h1>สถานะการสมัคร</h1>
      {loading ? <p>กำลังโหลดข้อมูล...</p> : null}
      {error ? <p role="alert">ไม่สามารถโหลดข้อมูลสถานะได้</p> : null}
      {!loading && !error && applications.length === 0 ? <p>ไม่พบรายการใบสมัคร</p> : null}
      {applications.map((application, index) => (
        <ApplicationStatusDetail
          key={application.application_id ?? application.updated_at ?? index}
          application={application}
        />
      ))}
    </main>
  );
}
