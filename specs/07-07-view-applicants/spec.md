# Feature: ดูรายชื่อผู้สมัคร
Spec ID: SPEC-07-07- | Source: Use Case Diagram UC-07 | Use case: UC-07
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
อาจารย์ดูรายชื่อและข้อมูลที่จำเป็นของผู้สมัครในรอบรับสมัครที่ตนรับผิดชอบ

## Scope
### In scope
- ค้นหารอบรับสมัคร
- แสดงรายชื่อผู้สมัคร
- ดูรายละเอียดใบสมัครและเอกสารที่มีสิทธิ์เข้าถึง
### Out of scope
- คัดเลือกผู้สมัคร (UC-08)
- ตรวจสอบเอกสารและอนุมัติ (UC-10)

## Constraints
- แสดงเฉพาะข้อมูลของรอบ/รายวิชาที่อาจารย์มีสิทธิ์
- ข้อมูลส่วนบุคคลต้องจำกัดตามสิทธิ์

## Requirements
- FR-APP-01 ระบบต้องแสดงรายชื่อผู้สมัครตามรอบรับสมัคร    <- UC-07 requirement 1
- FR-APP-02 ระบบต้องค้นหา/กรองรายชื่อได้    <- UC-07 requirement 2
- FR-APP-03 ระบบต้องเปิดดูรายละเอียดได้ตามสิทธิ์    <- UC-07 requirement 3

## Quality Requirements
- NFR-SEC-01 จำกัดการเข้าถึงข้อมูลผู้สมัครตามบทบาท
- NFR-PERF-01 การค้นหารายชื่อควรตอบสนองภายในเวลาที่กำหนด

## Acceptance Criteria
- [ ] AC-APP-01 (FR-APP-01)
      Given มีผู้สมัคร
            When  เปิดรอบรับสมัคร
            Then  แสดงรายชื่อผู้สมัคร
- [ ] AC-APP-02 (FR-APP-03)
      Given ไม่มีสิทธิ์ในรอบนั้น
            When  เปิดข้อมูล
            Then  ระบบปฏิเสธการเข้าถึง

## Assumptions & Open Questions
- ASM-01 ข้อมูลผู้สมัครผ่านการบันทึกจาก UC-01
- Q-01 ข้อมูลใดบ้างที่อาจารย์ดูได้? -> ยืนยันกับเจ้าของข้อมูล/นโยบาย

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-07 requirement 1 | FR-APP-01 | AC-APP-01 |
| UC-07 requirement 2 | FR-APP-02 | AC-APP-02 |
| UC-07 requirement 3 | FR-APP-03 |  |
| NFR-SEC-01 | Quality Requirements |  |
| NFR-PERF-01 | Quality Requirements |  |
