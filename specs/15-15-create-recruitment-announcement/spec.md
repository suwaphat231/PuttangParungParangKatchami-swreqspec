# Feature: จัดทำประกาศรับสมัคร
Spec ID: SPEC-15-15- | Source: Use Case Diagram UC-15 | Use case: UC-15
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
เจ้าหน้าที่จัดทำและเผยแพร่ประกาศรับสมัคร Lab Boy

## Scope
### In scope
- สร้างประกาศ
- กำหนดรายละเอียดและเงื่อนไข
- บันทึกฉบับร่าง
- เผยแพร่ประกาศ
### Out of scope
- ดูประกาศรับสมัคร (UC-02)
- เปิดรับสมัคร (UC-06)

## Constraints
- ข้อมูลประกาศต้องครบก่อนเผยแพร่
- ผู้จัดทำต้องมีสิทธิ์ของภาควิชา

## Requirements
- FR-ANN-04 ระบบต้องให้เจ้าหน้าที่สร้างประกาศ    <- UC-15 requirement 1
- FR-ANN-05 ระบบต้องตรวจสอบข้อมูลบังคับก่อนเผยแพร่    <- UC-15 requirement 2
- FR-ANN-06 ระบบต้องบันทึกผู้จัดทำและเวลาเผยแพร่    <- UC-15 requirement 3

## Quality Requirements
- NFR-AUD-01 เก็บประวัติการสร้าง/แก้ไข/เผยแพร่
- NFR-SEC-01 ตรวจสอบสิทธิ์ทุกครั้งก่อนแก้ไข

## Acceptance Criteria
- [ ] AC-ANN-04 (FR-ANN-05)
      Given ข้อมูลประกาศไม่ครบ
            When  กดเผยแพร่
            Then  ระบบปฏิเสธและระบุข้อมูลที่ขาด
- [ ] AC-ANN-05 (FR-ANN-06)
      Given ข้อมูลครบ
            When  เผยแพร่
            Then  ระบบบันทึกผู้จัดทำและเวลา

## Assumptions & Open Questions
- ASM-01 รูปแบบประกาศมี template ที่กำหนด
- Q-01 ใครเป็นผู้อนุมัติก่อนเผยแพร่? -> ยืนยันกับภาควิชา

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-15 requirement 1 | FR-ANN-04 | AC-ANN-04 |
| UC-15 requirement 2 | FR-ANN-05 | AC-ANN-05 |
| UC-15 requirement 3 | FR-ANN-06 |  |
| NFR-AUD-01 | Quality Requirements |  |
| NFR-SEC-01 | Quality Requirements |  |
