# Tasks Breakdown: แจ้งเตือนผู้ใช้งาน
Feature: แจ้งเตือนผู้ใช้งาน
Spec ID: SPEC-22-22- | UC-22 | FR-MSG-01 ถึง FR-MSG-03 / NFR-REL-02 / NFR-SEC-01
อ้างอิง plan.md: [plan.md](plan.md)
วันที่: 2026-10-03

สรุป:
- ทำทั้งหมด 6 task
- มี task ที่ต้องรอ Open Questions: 0 task

> หมายเหตุ: spec ปัจจุบันอยู่ในสถานะ Draft v1 แต่ Q-01 ได้มีคำตอบชัดเจนแล้วว่า ระบบรองรับ notification ภายในระบบเท่านั้น ดังนั้น task ที่แตกนี้ยังคงยึดตาม requirement และ plan ที่มีอยู่โดยไม่เดาเพิ่มเติม

### T-01 กำหนด schema payload และ model สำหรับการแจ้งเตือน
- รองรับ: FR-MSG-01, NFR-SEC-01
- ตรวจด้วย: AC-MSG-01
- ไฟล์ที่แตะ: `backend/app/models/notification.py`, `backend/app/services/notification_service.py`, `backend/app/router.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: ระบบมี payload สำหรับการแจ้งเตือนที่ระบุผู้รับ เหตุการณ์ และ metadata ที่จำเป็นโดยไม่เปิดเผยข้อมูลที่เกินสิทธิ์
- สถานะ: พร้อมทำ

### T-02 กำหนด logic เลือกผู้รับและเลือกช่องทางที่มีสิทธิ์และพร้อมใช้งาน
- รองรับ: FR-MSG-02, NFR-SEC-01
- ตรวจด้วย: AC-MSG-02
- ไฟล์ที่แตะ: `backend/app/services/notification_service.py`, `backend/app/router.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ระบบสามารถเลือกผู้รับและช่องทางการส่งที่ผู้ใช้เปิดใช้งานและยอมรับการติดต่อได้โดยไม่เลือกช่องทางที่ไม่ได้รับสิทธิ์
- สถานะ: พร้อมทำ

### T-03 บันทึกสถานะการส่งและเหตุผลของการพยายามส่ง
- รองรับ: FR-MSG-03, NFR-REL-02
- ตรวจด้วย: AC-MSG-03
- ไฟล์ที่แตะ: `backend/app/models/notification_status.py`, `backend/app/services/notification_service.py`, `backend/app/router.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ระบบบันทึกสถานะ sent/failed/queued พร้อมเหตุผลและ timestamp ของการพยายามส่งแต่ละครั้ง
- สถานะ: พร้อมทำ

### T-04 สร้าง flow ส่งแจ้งเตือนและ retry เมื่อส่งล้มเหลว
- รองรับ: FR-MSG-02, FR-MSG-03, NFR-REL-02
- ตรวจด้วย: AC-MSG-03
- ไฟล์ที่แตะ: `backend/app/services/notification_service.py`, `backend/app/router.py`, `backend/app/worker.py`
- ต้องทำหลัง: T-02, T-03
- เสร็จเมื่อ: ระบบส่งแจ้งเตือนผ่าน notification ภายในระบบได้และเมื่อส่งไม่สำเร็จจะบันทึก failed/queued และดำเนินการ retry ตามนโยบาย
- สถานะ: พร้อมทำ

### T-05 ลดข้อมูลในข้อความให้เป็นข้อมูลที่จำเป็นและตรวจสอบความปลอดภัยของเนื้อหา
- รองรับ: FR-MSG-01, NFR-SEC-01
- ตรวจด้วย: AC-MSG-04
- ไฟล์ที่แตะ: `backend/app/services/notification_service.py`, `backend/app/router.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ข้อความแจ้งเตือนมีเฉพาะข้อมูลที่จำเป็นต่อการแจ้งเหตุการณ์หรือการติดต่อ และไม่เปิดเผยข้อมูลอ่อนไหวเกินสิทธิ์
- สถานะ: พร้อมทำ

### T-06 ทดสอบยอมรับสำหรับทุก AC ของฟีเจอร์แจ้งเตือน
- รองรับ: FR-MSG-01, FR-MSG-02, FR-MSG-03, NFR-REL-02, NFR-SEC-01
- ตรวจด้วย: AC-MSG-01, AC-MSG-02, AC-MSG-03, AC-MSG-04
- ไฟล์ที่แตะ: `backend/tests/test_notify_user.py`, `frontend/src/__tests__/notify_user.test.jsx`
- ต้องทำหลัง: T-02, T-03, T-04, T-05
- เสร็จเมื่อ: test acceptance ครอบคลุมการสร้าง payload, การเลือกช่องทาง, การบันทึกสถานะและ retry, และการลดข้อมูลที่ไม่จำเป็นผ่านตาม requirement
- สถานะ: พร้อมทำ

## ตารางตรวจความครบ

### 1) AC ID | task ที่ตรวจ AC นี้
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-MSG-01 | T-01, T-06 |
| AC-MSG-02 | T-02, T-04, T-06 |
| AC-MSG-03 | T-03, T-04, T-06 |
| AC-MSG-04 | T-05, T-06 |

### 2) Constraint ID | task ที่ทำให้เป็นจริง
| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| ส่งเฉพาะผู้รับที่มีสิทธิ์และมีข้อมูลช่องทาง | T-02, T-04 |
| ข้อความต้องไม่เปิดเผยข้อมูลส่วนบุคคลเกินจำเป็น | T-01, T-05 |

## สิ่งที่ยังไม่ทำ
- Q-01: ช่องทางใดบ้างที่ระบบต้องรองรับสำหรับการแจ้งเตือน? -> ตอบ: notification ในระบบเท่านั้น
  - task ที่รออยู่: ไม่มี (คำตอบนี้ได้รับการยืนยันแล้วใน spec และ plan)

