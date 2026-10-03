# Feature: ตรวจสอบวันและเวลาปฏิบัติงาน
Spec ID: SPEC-19-19- | อ้างอิง plan.md: plan.md | วันที่: 2026-10-03

## สรุป
- รวมทั้งหมด: 7 task
- รอคำตอบ Open Questions: 0 task

## รายการ task

### T-01 สร้าง contract payload และ validation
- รองรับ: FR-CAL-01
- ตรวจด้วย: AC-CAL-01
- ไฟล์ที่แตะ: backend/app/schemas/calendar_check_request.py, backend/app/services/calendar_check_service.py, backend/tests/test_check_work_time.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: ระบบรับ request payload จาก UC-09 ได้และปฏิเสธค่าเริ่มต้น/สิ้นสุดที่ขาดหรือผิดรูปแบบก่อนดำเนินการตรวจสอบ
- สถานะ: พร้อมทำ

### T-02 ดึงข้อมูลปฏิทินและตรวจความสดใหม่
- รองรับ: FR-CAL-02, FR-CAL-04, NFR-REL-01
- ตรวจด้วย: AC-CAL-03
- ไฟล์ที่แตะ: backend/app/services/calendar_source.py, backend/app/models/calendar_snapshot.py, backend/tests/test_check_work_time.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ระบบเรียกข้อมูลปฏิทินการศึกษาได้และยืนยันความพร้อมใช้งาน/ความเป็นปัจจุบันก่อนอนุญาตให้ทำการตรวจสอบต่อไป
- สถานะ: พร้อมทำ

### T-03 ตรวจจับการทับซ้อนกับวันหยุดและช่วงที่ห้ามปฏิบัติงาน
- รองรับ: FR-CAL-03, NFR-REL-01
- ตรวจด้วย: AC-CAL-02
- ไฟล์ที่แตะ: backend/app/services/calendar_overlap_service.py, backend/tests/test_check_work_time.py
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: ระบบระบุผลเป็น FAIL เมื่อช่วงเวลาที่ร้องขอทับซ้อนกับวันหยุดหรือช่วงที่ไม่อนุญาต แม้เพียงบางส่วน และระบุเหตุผลที่ชัดเจน
- สถานะ: พร้อมทำ

### T-04 สร้าง response PASS/FAIL พร้อมเหตุผลและข้อมูลอ้างอิงปฏิทิน
- รองรับ: FR-CAL-05, NFR-INT-01
- ตรวจด้วย: AC-CAL-04, AC-CAL-05
- ไฟล์ที่แตะ: backend/app/services/calendar_check_service.py, backend/app/router.py, backend/tests/test_check_work_time.py
- ต้องทำหลัง: T-01, T-02, T-03
- เสร็จเมื่อ: ระบบส่ง JSON กลับไปยัง UC-09 โดยมี status, reason, calendarVersion และ effectiveDate ตามรูปแบบที่ยอมรับ
- สถานะ: พร้อมทำ

### T-05 สร้าง API endpoint สำหรับ UC-09
- รองรับ: FR-CAL-01, FR-CAL-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04
- ไฟล์ที่แตะ: backend/app/router.py, backend/app/main.py
- ต้องทำหลัง: T-01, T-04
- เสร็จเมื่อ: endpoint รับ request จาก UC-09 และเรียก service ตรวจสอบปฏิทินเพื่อคืนผล PASS/FAIL ตามสัญญา JSON
- สถานะ: พร้อมทำ

### T-06 สร้างหน้า UI สำหรับตรวจสอบวันและเวลาปฏิบัติงานด้วย API จำลอง
- รองรับ: FR-CAL-01, FR-CAL-05, NFR-INT-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-06
- ไฟล์ที่แตะ: frontend/src/pages/CheckWorkTimePage.jsx, frontend/src/api/calendarCheckApi.js, frontend/src/__tests__/checkWorkTime.test.jsx
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้า UI แสดงฟอร์มตรวจสอบช่วงเวลา และแสดงผล PASS/FAIL จาก mock response ที่สอดคล้องกับ JSON contract
- สถานะ: พร้อมทำ

### T-07 ต่อหน้า UI กับ API จริงและทดสอบ acceptance สำหรับทุก AC
- รองรับ: FR-CAL-01, FR-CAL-02, FR-CAL-03, FR-CAL-04, FR-CAL-05, NFR-REL-01, NFR-PERF-01, NFR-INT-01
- ตรวจด้วย: AC-CAL-01, AC-CAL-02, AC-CAL-03, AC-CAL-04, AC-CAL-05
- ไฟล์ที่แตะ: backend/tests/test_check_work_time.py, frontend/src/__tests__/checkWorkTime.test.jsx, frontend/src/pages/CheckWorkTimePage.jsx
- ต้องทำหลัง: T-05, T-06
- เสร็จเมื่อ: API และ UI ผ่านทุกกรณีหลักของ acceptance criteria รวมถึง benchmark ความเร็วที่ไม่เกินเกณฑ์ธุรกิจ และไม่มีผลลัพธ์ pass เมื่อข้อมูลปฏิทินไม่พร้อมใช้งาน
- สถานะ: พร้อมทำ

## ตารางตรวจความครบ

### 1) AC ID | task ที่ตรวจ AC นี้
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-CAL-01 | T-01, T-07 |
| AC-CAL-02 | T-03, T-07 |
| AC-CAL-03 | T-02, T-07 |
| AC-CAL-04 | T-04, T-07 |
| AC-CAL-05 | T-04, T-07 |

### 2) Constraint ID | task ที่ทำให้เป็นจริง
| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| NFR-REL-01 | T-02, T-03, T-07 |
| NFR-PERF-01 | T-07 |
| NFR-INT-01 | T-04, T-05, T-06, T-07 |

## สิ่งที่ยังไม่ทำ
- Q-01 กำหนดช่วงเวลาที่ไม่อนุญาตมีความละเอียดเท่าใด เช่น วันเต็มหรือชั่วโมงเฉพาะเวลา? -> ตอบ: ใช้ระดับวันเต็ม (full-day) สำหรับวันหยุดและช่วงที่ไม่อนุญาตที่กำหนดในปฏิทินการศึกษา
  - task ที่รออยู่: ไม่มี; ใช้เป็นกฎงานใน T-03
- Q-02 หากช่วงเวลาที่ร้องขอมีการทับซ้อนเพียงบางส่วนของวันหรือเวลา จะถือว่าไม่ผ่านทั้งช่วงหรือไม่? -> ตอบ: ถ้ามีการทับซ้อนกันแม้เพียงส่วนใดส่วนหนึ่งของช่วงเวลาที่ร้องขอ ระบบจะถือว่าไม่ผ่านทั้งช่วง
  - task ที่รออยู่: ไม่มี; ใช้เป็นกฎงานใน T-03
- Q-03 ระบบต้องส่งผลการตรวจสอบกลับไปยัง UC-09 ในรูปแบบใด เช่น JSON, event payload หรือ response object? -> ตอบ: ส่งเป็น JSON
  - task ที่รออยู่: ไม่มี; ใช้เป็นสัญญา response ใน T-04 และ T-05
- Q-04 วันหยุดพิเศษที่ประกาศภายหลังอัปเดตเข้าสู่ระบบภายในกี่นาทีจึงถือว่าปัจจุบัน? -> ตอบ: เมื่อมีการอัปเดทข้อมูลแล้ว ถือว่าปัจจุบันทันที และระบบจะใช้ข้อมูลใหม่นั้นได้เลย
  - task ที่รออยู่: ไม่มี; ใช้เป็นกฎงานใน T-02
