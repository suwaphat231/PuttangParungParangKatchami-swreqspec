const BASE = import.meta.env.VITE_API_BASE ?? '/api';

// รองรับ FR-CAL-01, FR-CAL-05 และ NFR-INT-01 ด้วย JSON contract ของ UC-19.
export async function checkCalendarPeriod(request) {
  const response = await fetch(`${BASE}/calendar/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const responseText = await response.text();
  let payload;

  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch (parseError) {
      const message = response.ok
        ? `API ตอบกลับไม่ใช่ JSON ที่ถูกต้อง (HTTP ${response.status})`
        : `API ตอบกลับผิดพลาด (HTTP ${response.status})`;
      throw new Error(message, { cause: parseError });
    }
  }

  if (!response.ok) {
    const detail = typeof payload?.detail === 'string'
      ? payload.detail
      : `ไม่สามารถตรวจสอบช่วงเวลาได้ (HTTP ${response.status})`;
    throw new Error(detail);
  }

  if (payload === undefined) {
    throw new Error(`API ตอบกลับว่าง (HTTP ${response.status})`);
  }

  return payload;
}
