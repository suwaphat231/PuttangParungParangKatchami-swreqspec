# Feature: เปิดรับสมัคร
Spec ID: SPEC-06-06- | Source: Use Case Diagram UC-06 | Use case: UC-06
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
อาจารย์เปิดรอบรับสมัคร Lab Boy พร้อมกำหนดรายละเอียดและช่วงเวลารับสมัคร

## Scope
### In scope
- เลือกวิชา/งานที่รับผิดชอบ
- กำหนดคุณสมบัติ จำนวนที่รับ และช่วงเวลารับสมัคร
- เผยแพร่ประกาศ
### Out of scope
- ดูประกาศรับสมัคร (UC-02)
- สมัครเป็น Lab Boy (UC-01)

## Constraints
- ผู้เปิดรับสมัครต้องมีสิทธิ์ในรายวิชาหรือกิจกรรม
- วันเปิดต้องไม่มากกว่าวันปิด

## Requirements
- FR-REC-01 ระบบต้องให้กำหนดรายละเอียดการรับสมัคร    <- UC-06 requirement 1
- FR-REC-02 ระบบต้องตรวจสอบช่วงเวลาและจำนวนที่รับ    <- UC-06 requirement 2
- FR-REC-03 เมื่อยืนยันเผยแพร่ ระบบต้องเปลี่ยนสถานะเป็นเปิดรับสมัคร    <- UC-06 requirement 3

## Quality Requirements
- NFR-SEC-01 ตรวจสอบสิทธิ์ก่อนแก้ไขข้อมูลรับสมัคร
- NFR-AUD-01 บันทึกผู้สร้างและเวลาเผยแพร่

## Acceptance Criteria
- [ ] AC-REC-01 (FR-REC-03)
      Given กรอกข้อมูลถูกต้อง
            When  ยืนยันเผยแพร่
            Then  ประกาศมีสถานะเปิดรับสมัคร
- [ ] AC-REC-02 (FR-REC-02)
      Given วันปิดก่อนวันเปิด
            When  บันทึก
            Then  ระบบปฏิเสธและแจ้งข้อผิดพลาด

## Assumptions & Open Questions
- ASM-01 รายวิชาและผู้รับผิดชอบมีอยู่ในระบบ
- Q-01 ใครมีสิทธิ์แก้ไขประกาศหลังเผยแพร่? -> ยืนยันกับเจ้าหน้าที่

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-06 requirement 1 | FR-REC-01 | AC-REC-01 |
| UC-06 requirement 2 | FR-REC-02 | AC-REC-02 |
| UC-06 requirement 3 | FR-REC-03 |  |
| NFR-SEC-01 | Quality Requirements |  |
| NFR-AUD-01 | Quality Requirements |  |
