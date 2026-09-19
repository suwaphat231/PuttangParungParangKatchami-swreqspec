# Feature: ประเมินการปฏิบัติงาน
Spec ID: SPEC-11-11- | Source: Use Case Diagram UC-11 | Use case: UC-11
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
อาจารย์ประเมินผลการปฏิบัติงานของ Lab Boy และบันทึกผล

## Scope
### In scope
- ดูข้อมูลการปฏิบัติงาน
- กรอกคะแนน/ผลตามเกณฑ์
- ยืนยันผลการประเมิน
### Out of scope
- ส่งผลการปฏิบัติงาน (UC-12)
- ติดตามและตรวจสอบการจ่ายเงิน (UC-16)

## Constraints
- ต้องมีเกณฑ์การประเมินที่กำหนด
- ต้องกรอกข้อมูลที่บังคับครบก่อนยืนยัน

## Requirements
- FR-EVL-01 ระบบต้องแสดงแบบประเมินตามกิจกรรม/รายวิชา    <- UC-11 requirement 1
- FR-EVL-02 ระบบต้องตรวจสอบช่วงคะแนนและข้อมูลบังคับ    <- UC-11 requirement 2
- FR-EVL-03 ระบบต้องบันทึกผลพร้อมผู้ประเมินและเวลา    <- UC-11 requirement 3

## Quality Requirements
- NFR-AUD-01 บันทึกประวัติการประเมิน
- NFR-SEC-01 จำกัดการแก้ไขผลการประเมินตามบทบาท

## Acceptance Criteria
- [ ] AC-EVL-01 (FR-EVL-02)
      Given คะแนนอยู่นอกช่วง
            When  ยืนยันผล
            Then  ระบบปฏิเสธและแจ้งช่วงที่ถูกต้อง
- [ ] AC-EVL-02 (FR-EVL-03)
      Given กรอกข้อมูลครบ
            When  ยืนยัน
            Then  บันทึกผลพร้อมผู้ประเมินและเวลา

## Assumptions & Open Questions
- ASM-01 เกณฑ์การประเมินถูกกำหนดก่อนเปิดรอบ
- Q-01 แก้ไขผลหลังยืนยันได้หรือไม่ และใครอนุมัติ? -> ยืนยันกับอาจารย์/เจ้าหน้าที่

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-11 requirement 1 | FR-EVL-01 | AC-EVL-01 |
| UC-11 requirement 2 | FR-EVL-02 | AC-EVL-02 |
| UC-11 requirement 3 | FR-EVL-03 |  |
| NFR-AUD-01 | Quality Requirements |  |
| NFR-SEC-01 | Quality Requirements |  |
