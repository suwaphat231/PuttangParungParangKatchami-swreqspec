# Plan

## Objective
ปรับปรุงเอกสาร requirement/spec สำหรับฟีเจอร์ "ดูรายชื่อผู้สมัคร" ให้มีความชัดเจน ถูกต้อง และสอดคล้องกับ use case UC-07 ของระบบรับสมัคร Lab Boy

## Scope
- ตรวจทาน spec ที่มีอยู่สำหรับฟีเจอร์ดูรายชื่อผู้สมัคร
- ทำความชัดเจนในเรื่องสิทธิ์การเข้าถึงข้อมูล รายชื่อผู้สมัคร การค้นหาและกรองข้อมูล และพฤติกรรมเมื่อไม่มีสิทธิ์
- ปรับ acceptance criteria ให้ครอบคลุมสถานะปกติและสถานะปฏิเสธการเข้าถึง
- จัดทำ traceability ให้สอดคล้องกับ requirement และ quality requirement
- Commit เป็นเวอร์ชันที่ชัดเจนตามลำดับ

## Tasks
### 1. Review current spec
- ตรวจสอบโครงสร้างและเนื้อหาเริ่มต้นของ spec
- ระบุส่วนที่ยังคลุมเครือหรือขาดความชัดเจน
- ยืนยันว่าชื่อฟีเจอร์และรหัส spec สอดคล้องกับ use case

### 2. Clarify access control and data visibility
- กำหนดว่าอาจารย์สามารถดูรายชื่อผู้สมัครได้เฉพาะในรอบที่ตนรับผิดชอบ
- ระบุชัดว่าข้อมูลใดบ้างที่ได้รับอนุญาตให้เห็นตามบทบาท
- กำหนดพฤติกรรมเมื่อไม่มีสิทธิ์เข้าถึงข้อมูลของรอบนั้น

### 3. Clarify search and filter behavior
- กำหนดเงื่อนไขในการค้นหา เช่น ชื่อ รหัสนักศึกษา รอบรับสมัคร และสถานะ
- ระบุว่าระบบต้องแสดงผลตามเงื่อนไขที่กรองได้อย่างถูกต้อง

### 4. Improve acceptance criteria
- เพิ่ม Given / When / Then ให้ครอบคลุมทั้งสถานะปกติและสถานะปฏิเสธ
- ตรวจสอบว่าแต่ละ requirement มี acceptance criteria ที่สอดคล้องกัน

### 5. Document open questions
- ระบุข้อยืนยันที่ต้องถามเพิ่มเติม เช่น ข้อมูลใดบ้างที่สามารถเปิดดูได้จริงตามนโยบาย
- จัดทำรายการ assumptions และ open questions ให้ชัดเจน

### 6. Version control
- Commit หลังการปรับปรุง spec เป็นเวอร์ชันที่ชัดเจน
- ใช้ข้อความ commit ที่สื่อถึงการปรับปรุง เช่น "Update view applicants spec v2"

## Progress
- [x] Review current view applicants spec
- [x] Clarify access scope and denial behavior
- [x] Update requirements and acceptance criteria
- [x] Commit updated spec as v2
- [ ] Review related specs for consistency with project-wide style
- [ ] Finalize remaining documentation updates if needed

## Notes
- ภาษาที่ใช้ในการเขียน spec ควรเป็นภาษาไทยเพื่อให้สอดคล้องกับทีมผู้พัฒนาและผู้ใช้งาน
- ให้ใช้แนวทาง requirement engineering แบบชัดเจน เป็นระบบ และสามารถตรวจสอบย้อนกลับได้
- ความปลอดภัยและสิทธิ์การเข้าถึงข้อมูลต้องเป็นหัวใจสำคัญของฟีเจอร์นี้
