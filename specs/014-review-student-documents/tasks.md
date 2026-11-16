# Tasks: ตรวจสอบเอกสารนักศึกษา
- Feature: ตรวจสอบเอกสารนักศึกษา
- Spec ID: SPEC-14-14-
- อ้างอิง plan.md: [specs/14-14-review-student-documents/plan.md](specs/14-14-review-student-documents/plan.md)
- วันที่: 2026-10-03

## สรุป
- งานทั้งหมด: 8 task
- รอ Open Questions: 0 task (Q-01 และ Q-02 ใน spec ปิดแล้วตาม ASM-Q1-01, ASM-Q1-02 และ ASM-Q2-01)

## รายการ task

### T-01 กำหนด checklist เอกสารจากประกาศรับสมัคร
- รองรับ: FR-OFC-01, NFR-SEC-01
- ตรวจด้วย: AC-OFC-01
- ไฟล์ที่แตะ: backend/app/main.py, backend/app/router.py, backend/app/authorization.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: API คืน checklist เอกสารจากประกาศรับสมัครสำหรับใบสมัครที่เลือกและกรองผลตามบทบาทผู้ใช้งาน
- สถานะ: เสร็จแล้ว

### T-02 สร้างผลตรวจสอบและ audit log
- รองรับ: FR-OFC-02, NFR-AUD-01, ASM-03
- ตรวจด้วย: AC-OFC-02
- ไฟล์ที่แตะ: backend/app/main.py, backend/app/router.py, backend/app/review_document_service.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ระบบบันทึกสถานะ ผ่าน / ไม่ผ่าน / ส่งกลับเพื่อแก้ไข พร้อมเหตุผล รายการเอกสารที่มีปัญหา และ audit log แบบ immutable
- สถานะ: เสร็จแล้ว

### T-03 บังคับตรวจสอบก่อนส่งกลับแก้ไข
- รองรับ: FR-OFC-03, NFR-NOT-01
- ตรวจด้วย: AC-OFC-03
- ไฟล์ที่แตะ: backend/app/main.py, backend/app/router.py, backend/app/notifications.py
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: API ปฏิเสธการยืนยันส่งกลับหากไม่มีเอกสารที่มีปัญหาและเหตุผล และส่ง notification ไปยังนักศึกษาในแอปและอีเมล
- สถานะ: เสร็จแล้ว

### T-04 จำกัดสิทธิ์การเข้าถึงใบสมัครและเอกสาร
- รองรับ: NFR-SEC-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04
- ไฟล์ที่แตะ: backend/app/authorization.py, backend/app/router.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: เจ้าหน้าที่แต่ละบทบาทเห็นได้เฉพาะใบสมัครและเอกสารที่มีสิทธิ์ตามบทบาท
- สถานะ: เสร็จแล้ว

### T-05 สร้างหน้า detail ใบสมัครพร้อม checklist auto-load
- รองรับ: FR-OFC-01, NFR-UX-01
- ตรวจด้วย: AC-OFC-01
- ไฟล์ที่แตะ: frontend/src/pages/ReviewStudentDocumentsPage.jsx, frontend/src/pages/ReviewStudentDocumentsPage.css, frontend/src/api/client.js
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าเปิดใบสมัครแสดง checklist เอกสารที่ดึงจากประกาศรับสมัครอัตโนมัติ
- สถานะ: เสร็จแล้ว

### T-06 สร้างฟอร์มบันทึกผลตรวจสอบและยืนยันส่งกลับ
- รองรับ: FR-OFC-02, FR-OFC-03, NFR-UX-01
- ตรวจด้วย: AC-OFC-02, AC-OFC-03
- ไฟล์ที่แตะ: frontend/src/pages/ReviewStudentDocumentsPage.jsx, frontend/src/api/client.js
- ต้องทำหลัง: T-05, T-02, T-03
- เสร็จเมื่อ: ฟอร์มแสดงสถานะ 3 แบบและบังคับเลือกเอกสาร/พิมพ์เหตุผลก่อนยืนยันส่งกลับ
- สถานะ: เสร็จแล้ว

### T-07 แสดง audit trail และ timestamp ใน UI
- รองรับ: NFR-AUD-01, NFR-UX-01
- ตรวจด้วย: AC-OFC-02
- ไฟล์ที่แตะ: frontend/src/pages/ReviewStudentDocumentsPage.jsx, frontend/src/pages/ReviewStudentDocumentsPage.css
- ต้องทำหลัง: T-05, T-02
- เสร็จเมื่อ: UI แสดง audit trail, วันที่เวลาล่าสุด และสถานะล่าสุดที่ตรวจสอบ
- สถานะ: เสร็จแล้ว

### T-08 ทดสอบยอมรับกับ API จำลองและ AC ครบ
- รองรับ: FR-OFC-01, FR-OFC-02, FR-OFC-03, NFR-SEC-01, NFR-AUD-01, NFR-NOT-01
- ตรวจด้วย: AC-OFC-01, AC-OFC-02, AC-OFC-03
- ไฟล์ที่แตะ: frontend/src/__tests__/ReviewStudentDocumentsPage.test.jsx, backend/tests/test_review_documents.py
- ต้องทำหลัง: T-04, T-06, T-07
- เสร็จเมื่อ: test_AC_OFC_01, test_AC_OFC_02, test_AC_OFC_03 ผ่านด้วย API จำลอง
- สถานะ: เสร็จแล้ว

## ตารางตรวจความครบ

### AC coverage
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-OFC-01 | T-01, T-05, T-08 |
| AC-OFC-02 | T-02, T-06, T-07, T-08 |
| AC-OFC-03 | T-03, T-06, T-08 |

### Constraint coverage
| Constraint | task ที่ทำให้เป็นจริง |
|---|---|
| รายการเอกสารบังคับต้องถูกกำหนดจากประกาศรับสมัครแต่ละฉบับเป็นแหล่งข้อมูลหลัก (Single Source of Truth) | T-01, T-05 |
| การเข้าถึงเอกสารและใบสมัครต้องถูกควบคุมตามสิทธิ์และบทบาทของผู้ใช้งาน (RBAC) | T-04 |
| เมื่อผลการตรวจสอบไม่ผ่านหรือส่งกลับเพื่อแก้ไข ต้องระบุเหตุผลหรือข้อบกพร่องที่ชัดเจน | T-02, T-06 |
| ก่อนยืนยันส่งกลับ ระบบต้องบันทึกรายการเอกสารที่มีปัญหาและเหตุผลที่ต้องแก้ไขให้ครบถ้วนก่อน จึงจะสามารถกดยืนยันได้ | T-03, T-06 |
| ระบบต้องบันทึกประวัติการตรวจสอบแบบแก้ไขไม่ได้ (Immutable Audit Log) | T-02, T-07 |
| การแจ้งกลับไปยังผู้สมัครต้องใช้ระบบแจ้งเตือนภายในแอปเป็นหลัก และอีเมลเป็นช่องทางเสริม | T-03, T-06, T-08 |

## สิ่งที่ยังไม่ทำ
- Q-01: workflow การตรวจเอกสารแบบอัตโนมัติและแบบเจ้าหน้าที่ถูกกำหนดแล้ว — ไม่มี task ที่รอ Q-xx เนื่องจาก spec ระบุชัดว่าการตรวจเอกสารแบ่งตาม ASM-Q1-01 และ ASM-Q1-02; task ที่เกี่ยวข้อง: T-01, T-05, T-08
- Q-02: ระยะเวลาแก้ไขเอกสารหลังจากส่งกลับถูกกำหนดไว้ที่ 7 วัน — ไม่มี task ที่รอ Q-xx เนื่องจาก spec ระบุชัดใน ASM-Q2-01; task ที่เกี่ยวข้อง: T-03, T-06, T-08
