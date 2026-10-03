# Prompt Log: UC-13 ตรวจสอบสถานะผู้ปฏิบัติงาน

## 1. วันที่ตรวจสอบ
- 2026-10-03

## 2. เอกสารที่ตรวจสอบ
- [spec.md](spec.md)
- [plan.md](plan.md)
- [tasks.md](tasks.md)

## 3. จำนวน Task
- Total tasks: 10
- Tasks completed: 6 (T-01, T-02, T-03, T-04, T-05, T-06)
- Tasks in progress: 0
- Tasks pending answer: 1 (T-10, รอ Q-01)
- Acceptance criteria covered: 3/3
- Acceptance criteria without task support: 0

## 4. ข้อผิดพลาดที่พบ
1. Task เดิมไม่มี 6 ช่องที่ต้องมีตามเกณฑ์ Week 06: รองรับ / ตรวจด้วย / ไฟล์ที่แตะ / ต้องทำหลัง / เสร็จเมื่อ / สถานะ
2. ไม่มี Traceability table ท้ายไฟล์
3. ไม่มีสถานะที่ชัดเจนสำหรับ Open Question Q-01
4. ไม่มีการระบุว่า task ทั้งหมดยึดจาก Spec และ Plan เท่านั้น
5. ไม่พบ prompt-log.md ใน workspace จึงสร้างขึ้นเพื่อบันทึกผลตรวจสอบและการแก้ไข

## 5. การแก้ไขที่ทำแล้ว
- เพิ่ม task matrix ที่มี 6 ช่องครบทุก task
- เพิ่ม traceability สำหรับ AC-WKS-01 ถึง AC-WKS-03
- เพิ่มสถานะ Q-01 เป็นรอคำตอบแทนการเดา
- ยืนยัน scope ว่าไม่เกิน UC-13 และไม่เพิ่มฟังก์ชันนอกขอบเขต
- ตรวจสอบและปิด T-01 ไปแล้วหลังยืนยัน requirement, traceability และ scope ตาม Spec/Plan
- ตรวจสอบและปิด T-02 แล้ว โดยยืนยัน role-based access matrix ว่าตรงกับ Student/Lab Boy, Instructor, Department Staff, Admin ตาม Spec/Plan
- ตรวจสอบและปิด T-03 แล้ว โดยสรุป logic ค้นหา/กรอง Lab Boy ตาม FR-WKS-02/AC-WKS-02 และระบุ Open Question สำหรับ exact/partial match ที่ Spec/Plan ไม่ระบุชัดเจน
- ตรวจสอบและปิด T-04 แล้ว เพื่อยืนยัน access enforcement และ empty-state handling ตาม RBAC จาก T-02 และ FR-WKS-02/AC-WKS-02
- ตรวจสอบและปิด T-05 แล้ว โดยยืนยัน requirement ว่า status ต้องเป็นข้อมูลล่าสุด และ Last Updated Timestamp ต้องสอดคล้องกับข้อมูลที่แสดงตาม FR-WKS-03 / AC-WKS-03
- ตรวจสอบและปิด T-06 แล้ว โดยยืนยัน requirement ว่า UI ค้นหา/กรองต้องสอดคล้องกับ FR-WKS-02, AC-WKS-02 และ scope ของ role จาก T-02/T-03
- ระบุ Open Question Q-01 ไว้เพื่อไม่ให้เดาคำตอบแทนทีม
- ระบุ Open Question สำหรับ timestamp format/timezone/trigger และ UI matching pattern ที่ Spec/Plan ไม่ระบุไว้เพื่อหลีกเลี่ยงการเดา workflow
- จัดทำ log นี้เพื่อสรุปผลการตรวจสอบและการปรับปรุง

## 6. สรุปแบบสั้น
- Task ทั้งหมด: 10
- Task ที่เสร็จแล้ว: T-01, T-02, T-03, T-04, T-05, T-06
- Task ที่กำลังทำ: ไม่มี
- Task ที่ต้องรอคำตอบ: T-10 (Q-01)
- AC ที่ยังไม่มี Task รองรับ: ไม่มี
- สถานะ: แก้ไขเสร็จแล้วตามเกณฑ์ Week 06 โดยอิงจาก Spec และ Plan เท่านั้น และ T-06 ปิดเป็น “เสร็จแล้ว”
