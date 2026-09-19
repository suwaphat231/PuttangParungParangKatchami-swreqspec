# Feature: ดูสถานะการสมัคร
Spec ID: SPEC-03-03- | Source: Use Case Diagram UC-03 | Use case: UC-03
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
นักศึกษาสามารถตรวจสอบสถานะใบสมัครและผลการดำเนินการล่าสุด

## Scope
### In scope
- แสดงใบสมัครของนักศึกษา
- แสดงสถานะและวันเวลาที่อัปเดตล่าสุด
- แสดงเหตุผลเมื่อใบสมัครไม่ผ่านหรือเอกสารมีปัญหา
### Out of scope
- การคัดเลือกผู้สมัคร (UC-08)
- การตรวจสอบเอกสาร (UC-10/UC-14)

## Constraints
- ผู้ใช้ดูได้เฉพาะใบสมัครของตนเอง
- สถานะต้องอ้างอิงจากข้อมูลล่าสุดในระบบ

## Requirements
- FR-STS-01 ระบบต้องแสดงรายการใบสมัครของผู้ใช้    <- UC-03 requirement 1
- FR-STS-02 ระบบต้องแสดงสถานะล่าสุดและเวลาที่อัปเดต    <- UC-03 requirement 2
- FR-STS-03 ระบบต้องแสดงเหตุผลเมื่อมีการส่งกลับ/ไม่อนุมัติ    <- UC-03 requirement 3

## Quality Requirements
- NFR-SEC-01 ผู้ใช้ต้องเข้าถึงเฉพาะข้อมูลใบสมัครของตนเอง
- NFR-REL-01 สถานะต้องไม่ย้อนกลับโดยไม่มีการแก้ไขที่ได้รับอนุญาต

## Acceptance Criteria
- [ ] AC-STS-01 (FR-STS-02)
      Given มีใบสมัคร
            When  เปิดสถานะการสมัคร
            Then  แสดงสถานะล่าสุดและเวลาอัปเดต
- [ ] AC-STS-02 (FR-STS-03)
      Given ใบสมัครถูกส่งกลับ
            When  ดูรายละเอียด
            Then  แสดงเหตุผลที่เกี่ยวข้อง
- [ ] AC-STS-03 (NFR-SEC-01)
      Given ผู้ใช้มีใบสมัครหลายคน
            When  เปิดหน้าสถานะ
            Then  แสดงเฉพาะข้อมูลของผู้ใช้ปัจจุบัน

## Assumptions & Open Questions
- ASM-01 มีชุดสถานะมาตรฐานที่กำหนดไว้
- Q-01 สถานะใดบ้างที่ต้องแสดงแก่ผู้สมัคร? -> ยืนยันกับเจ้าหน้าที่

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-03 requirement 1 | FR-STS-01 | AC-STS-01 |
| UC-03 requirement 2 | FR-STS-02 | AC-STS-02 |
| UC-03 requirement 3 | FR-STS-03 | AC-STS-03 |
| NFR-SEC-01 | Quality Requirements |  |
| NFR-REL-01 | Quality Requirements |  |
