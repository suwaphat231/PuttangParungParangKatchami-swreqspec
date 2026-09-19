# Feature: คัดเลือกผู้สมัคร
Spec ID: SPEC-08-08- | Source: Use Case Diagram UC-08 | Use case: UC-08
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
อาจารย์พิจารณาและบันทึกผลการคัดเลือกผู้สมัคร

## Scope
### In scope
- ดูข้อมูลผู้สมัคร
- กำหนดผลคัดเลือก
- ยืนยันและบันทึกผล
### Out of scope
- จัดทำตารางปฏิบัติงาน (UC-09)
- ดูสถานะการสมัคร (UC-03)

## Constraints
- คัดเลือกได้เฉพาะผู้สมัครในรอบที่อาจารย์รับผิดชอบ
- จำนวนผู้ได้รับคัดเลือกต้องไม่เกินจำนวนที่กำหนด

## Requirements
- FR-SEL-01 ระบบต้องให้กำหนดผลคัดเลือก    <- UC-08 requirement 1
- FR-SEL-02 ระบบต้องตรวจสอบจำนวนผู้ได้รับคัดเลือกกับจำนวนที่รับ    <- UC-08 requirement 2
- FR-SEL-03 ระบบต้องบันทึกผู้ทำรายการและเวลาที่บันทึกผล    <- UC-08 requirement 3

## Quality Requirements
- NFR-AUD-01 เก็บประวัติการเปลี่ยนแปลงผลคัดเลือก
- NFR-SEC-01 เฉพาะผู้มีสิทธิ์เท่านั้นที่ยืนยันผลได้

## Acceptance Criteria
- [ ] AC-SEL-01 (FR-SEL-02)
      Given จำนวนรับคือ 10 คน
            When  เลือกคนที่ 11
            Then  ระบบไม่ให้ยืนยันเกินโควตา
- [ ] AC-SEL-02 (FR-SEL-03)
      Given อาจารย์ยืนยันผล
            When  บันทึก
            Then  เก็บผู้ทำรายการและเวลา

## Assumptions & Open Questions
- ASM-01 จำนวนที่รับกำหนดในประกาศ
- Q-01 ต้องมีการอนุมัติซ้ำโดยเจ้าหน้าที่หรือไม่? -> ยืนยัน workflow

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-08 requirement 1 | FR-SEL-01 | AC-SEL-01 |
| UC-08 requirement 2 | FR-SEL-02 | AC-SEL-02 |
| UC-08 requirement 3 | FR-SEL-03 |  |
| NFR-AUD-01 | Quality Requirements |  |
| NFR-SEC-01 | Quality Requirements |  |
