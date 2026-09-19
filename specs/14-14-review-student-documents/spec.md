# Feature: ตรวจสอบเอกสารนักศึกษา
Spec ID: SPEC-14-14- | Source: Use Case Diagram UC-14 | Use case: UC-14
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
เจ้าหน้าที่ตรวจสอบเอกสารของนักศึกษาและบันทึกผลการตรวจสอบ

## Scope
### In scope
- ค้นหานักศึกษา/ใบสมัคร
- ดูเอกสาร
- บันทึกผลตรวจสอบ
- ส่งกลับเมื่อเอกสารไม่ครบ
### Out of scope
- ดูสถานะการสมัคร (UC-03)

## Constraints
- ต้องมีสิทธิ์เข้าถึงเอกสาร
- ต้องระบุเหตุผลเมื่อไม่ผ่าน

## Requirements
- FR-OFC-01 ระบบต้องแสดงเอกสารตามใบสมัคร    <- UC-14 requirement 1
- FR-OFC-02 ระบบต้องบันทึกผลตรวจสอบและเหตุผล    <- UC-14 requirement 2
- FR-OFC-03 ระบบต้องรองรับการส่งกลับเพื่อแก้ไข    <- UC-14 requirement 3

## Quality Requirements
- NFR-SEC-01 เอกสารต้องถูกควบคุมสิทธิ์
- NFR-AUD-01 บันทึกประวัติการตรวจสอบ

## Acceptance Criteria
- [ ] AC-OFC-01 (FR-OFC-02)
      Given เจ้าหน้าที่ตรวจเอกสารแล้ว
            When  บันทึกผล
            Then  ระบบบันทึกผลและเหตุผล
- [ ] AC-OFC-02 (FR-OFC-03)
      Given เอกสารไม่ครบ
            When  ส่งกลับ
            Then  ระบบบันทึกรายการที่ต้องแก้ไข

## Assumptions & Open Questions
- ASM-01 รายการเอกสารบังคับถูกกำหนดในประกาศ
- Q-01 เอกสารประเภทใดต้องตรวจโดยเจ้าหน้าที่เท่านั้น? -> ยืนยัน workflow

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-14 requirement 1 | FR-OFC-01 | AC-OFC-01 |
| UC-14 requirement 2 | FR-OFC-02 | AC-OFC-02 |
| UC-14 requirement 3 | FR-OFC-03 |  |
| NFR-SEC-01 | Quality Requirements |  |
| NFR-AUD-01 | Quality Requirements |  |
