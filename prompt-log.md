---
วันที่: 2026-10-02
คำสั่ง: /tasks specs/001-apply-lab-boy/spec.md
ผลลัพธ์: สร้างไฟล์ `specs/001-apply-lab-boy/tasks.md` สำหรับ feature สมัครเป็น Lab Boy พร้อมสรุป 9 task และ 4 task ที่รอ Open Questions (Q-01 ถึง Q-04) และจัดทำตารางตรวจความครบ AC/Constraint ให้ครอบคลุมตาม spec
---
---
วันที่: 2026-10-02
คำสั่ง: /implement T-01 specs/001-apply-lab-boy/tasks.md
สถานะ: ถูกบล็อกก่อนเริ่มพัฒนา เพราะ task T-01 มีสถานะ `รอ Q-03` ตาม `tasks.md` และกติกาใน `prompt_implement.md` ระบุว่าต้องหยุดเมื่อ task ในสถานะ `รอ Q-xx`
ไฟล์ที่พยายามใช้: ไม่มี (ไม่เริ่มเขียนโค้ด)
ผล test: ไม่มีการรันเนื่องจาก task ถูกบล็อกก่อนเริ่ม
สิ่งที่เกือบต้องเดา: รูปแบบเลขใบสมัครและรูปแบบแสดงวันเวลา (Q-03) แต่ต้องถามแทนเพื่อไม่ละเมิด spec
---
---
วันที่: 2026-10-02
คำสั่ง: /tasks specs/002-view-recruitment/spec.md
ผลลัพธ์: สร้างไฟล์ `specs/002-view-recruitment/tasks.md` สำหรับ feature ดูประกาศรับสมัคร โดยใช้สมมติฐานที่ทีมเลือกว่า “รองรับการค้นหา/กรองด้วยรายวิชาและภาคการศึกษา” เนื่องจาก spec ยังอยู่ในสถานะ Draft v1 และ Open Question Q-01 ยังไม่คลี่คลาย แต่ผู้ใช้ยืนยันให้ทำต่อตามสมมติฐานนี้
---
---
วันที่: 2026-10-02
คำสั่ง: /tasks specs/003-view-application-status/spec.md
ผลลัพธ์: สร้างไฟล์ `specs/003-view-application-status/tasks.md` สำหรับ feature ดูสถานะการสมัคร โดยวิเคราะห์จาก spec, plan และความจริงว่ามีไม่มี Open Question ต้องรอใน feature นี้
---
---
วันที่: 2026-10-02
คำสั่ง: /tasks specs/004-login/spec.md
ผลลัพธ์: สร้างไฟล์ `specs/004-login/tasks.md` สำหรับ feature เข้าสู่ระบบ โดยใช้เวอร์ชัน spec ที่รวม merge conflict ระหว่าง Draft v1/v2 และเลือกแก้ไขตามโครงสร้าง final merged โดยไม่เพิ่ม requirement ใหม่ นอกเหนือจากที่ spec ระบุ
---
---
วันที่: 2026-10-02
คำสั่ง: /implement T-01 specs/004-login/tasks.md
ไฟล์ที่สร้าง/แก้: `backend/app/models/user.py`, `backend/app/models/session.py`, `backend/app/services/auth_policy.py`, `backend/tests/test_auth_policy.py`
ผล test: `cd backend && pytest tests/test_auth_policy.py -q` → 3 passed in 0.02s
สิ่งที่เกือบต้องเดา: ไม่มี; ใช้ความจริงจาก spec ว่า session หมดอายุ 120 นาที และ lockout 5 ครั้ง/15 นาที เป็นหลักสำหรับ policy และ model
---
---
วันที่: 2026-10-02
คำสั่ง: /implement T-03 specs/003-view-application-status/tasks.md
ไฟล์ที่สร้าง/แก้: `backend/app/controllers/application_detail_controller.py`, `frontend/src/components/ApplicationStatusDetail.jsx`, `backend/tests/test_application_detail_controller.py`
ผล test: `cd backend && pytest tests/test_application_detail_controller.py -q` → 2 passed in 0.02s
สิ่งที่เกือบต้องเดา: ไม่มี; ค่าทำงานสอดคล้องกับ spec ที่ระบุว่า “แสดงสถานะล่าสุดและเวลาอัปเดตเป็นเวลา Asia/Bangkok” และ “โหลดข้อมูลสถานะล่าสุดเมื่อเปิดหน้าใหม่”
---
---
วันที่: 2026-10-02
คำสั่ง: /implement T-01 specs/002-view-recruitment/tasks.md
ไฟล์ที่สร้าง/แก้: `backend/app/models/announcement.py`, `backend/app/services/announcement_status_service.py`, `backend/tests/test_announcement_status_service.py`
ผล test: `cd backend && pytest tests/test_announcement_status_service.py -q` → 3 passed in 0.03s
สิ่งที่เกือบต้องเดา: ไม่มี; กำหนดสถานะประกาศและเงื่อนไขการแสดงรายการตาม spec และ plan ได้ตรงตามสัญญาเรื่อง `เปิดรับสมัคร`, `เต็ม`, `ปิดรับสมัคร`
---
