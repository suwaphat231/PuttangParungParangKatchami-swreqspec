# Tasks: ตรวจสอบสถานะนักศึกษา
Spec ID: SPEC-05-05 (Clarified v2) | อ้างอิง: plan.md

สรุป: ทั้งหมด 1 task สำหรับ AC-REG-05

### T-01 บันทึกผลการตรวจสอบสถานะนักศึกษา
- รองรับ: FR-REG-04, AC-REG-05
- ตรวจด้วย: AC-REG-05, `test_TC_REG_05_1`, `test_TC_REG_05_2`, `test_TC_REG_05_3`
- เทคโนโลยี: ใช้โครงสร้าง persistence เดิมของ backend; เทคโนโลยีนี้ทีมเลือกเอง ไม่ได้มาจาก spec
- ไฟล์ที่แตะ: backend/app/db/models.py, backend/app/student_status/service.py, backend/tests/test_AC_REG_05.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: บันทึกรหัสนักศึกษา ชื่อนักศึกษา และสถานะนักศึกษาได้ครบ และกรณีข้อมูลไม่ครบไม่ถูกบันทึกเป็นผลตรวจสอบผ่าน
- สถานะ: เสร็จ

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-REG-05 | T-01 |