# Feature: จัดการระบบ
Spec ID: SPEC-17-17- | Source: Use Case Diagram UC-17 | Use case: UC-17
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
ผู้ดูแลระบบจัดการข้อมูลตั้งค่าและรายการระบบที่ได้รับอนุญาต

## Scope
### In scope
- จัดการข้อมูลผู้ใช้/บทบาทที่ระบบอนุญาต
- จัดการค่าตั้งระบบ
- ตรวจสอบสถานะบริการ
- บันทึกการเปลี่ยนแปลง
### Out of scope
- อนุมัติสิทธิ์การเข้าใช้งาน (UC-18)

## Constraints
- เฉพาะผู้ดูแลระบบที่ได้รับสิทธิ์
- การเปลี่ยนค่าที่กระทบข้อมูลสำคัญต้องตรวจสอบและบันทึก audit

## Requirements
- FR-ADM-01 ระบบต้องแสดงเมนูตามสิทธิ์ผู้ดูแล    <- UC-17 requirement 1
- FR-ADM-02 ระบบต้องตรวจสอบข้อมูลก่อนบันทึก    <- UC-17 requirement 2
- FR-ADM-03 ระบบต้องบันทึกประวัติการเปลี่ยนแปลง    <- UC-17 requirement 3

## Quality Requirements
- NFR-SEC-01 ต้องใช้สิทธิ์ระดับผู้ดูแล
- NFR-AUD-01 ทุกการเปลี่ยนแปลงสำคัญต้องมี audit log

## Acceptance Criteria
- [ ] AC-ADM-01 (FR-ADM-02)
      Given ข้อมูลถูกต้อง
            When  บันทึก
            Then  ระบบบันทึกสำเร็จ
- [ ] AC-ADM-02 (FR-ADM-03)
      Given มีการเปลี่ยนข้อมูลสำคัญ
            When  บันทึก
            Then  มีประวัติผู้ทำรายการ เวลา และรายละเอียดการเปลี่ยนแปลง

## Assumptions & Open Questions
- ASM-01 รายการที่ผู้ดูแลแก้ไขได้ถูกกำหนดโดยระบบ
- Q-01 ต้องมีขั้นตอนอนุมัติแบบสองคนสำหรับการตั้งค่าบางประเภทหรือไม่? -> ยืนยันกับผู้ดูแล

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-17 requirement 1 | FR-ADM-01 | AC-ADM-01 |
| UC-17 requirement 2 | FR-ADM-02 | AC-ADM-02 |
| UC-17 requirement 3 | FR-ADM-03 |  |
| NFR-SEC-01 | Quality Requirements |  |
| NFR-AUD-01 | Quality Requirements |  |
