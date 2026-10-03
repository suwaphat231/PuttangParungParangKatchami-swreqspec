import React from 'react';

export default function ApplicationStatusDetail({ application }) {
  if (!application) {
    return null;
  }

  const updatedAt = application.updated_at || application.updatedAt;
  const status = application.status || 'ยื่นแล้ว';
  const validDate = updatedAt ? new Date(updatedAt) : null;
  const formattedTime = validDate
    ? new Intl.DateTimeFormat('th-TH', {
        timeZone: 'Asia/Bangkok',
        dateStyle: 'medium',
        timeStyle: 'medium',
      }).format(validDate)
    : '—';

  return (
    <section aria-label="application-status-detail">
      <h2>สถานะใบสมัคร</h2>
      <dl>
        <div>
          <dt>สถานะล่าสุด</dt>
          <dd>{status}</dd>
        </div>
        <div>
          <dt>เวลาอัปเดต</dt>
          <dd>{formattedTime}</dd>
        </div>
      </dl>

      {application.reason ? (
        <div>
          <h3>เหตุผล</h3>
          <p>{application.reason}</p>
        </div>
      ) : null}

      {application.required_actions && application.required_actions.length > 0 ? (
        <div>
          <h3>รายการที่ต้องแก้</h3>
          <ul>
            {application.required_actions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
