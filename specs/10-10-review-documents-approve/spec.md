# Feature: ตรวจสอบเอกสารและอนุมัติ
Spec ID: SPEC-10-10- | Source: Use Case Diagram UC-10 | Use case: UC-10
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
อาจารย์ตรวจสอบเอกสารของผู้สมัครและบันทึกผลอนุมัติ

## Scope
### In scope
- แสดงเอกสารที่ส่ง
- ตรวจสอบความครบถ้วน/ถูกต้อง
- อนุมัติหรือส่งกลับ
### Out of scope
- ดูสถานะการสมัคร (UC-03)
- คัดเลือกผู้สมัคร (UC-08)

## Constraints
- เข้าถึงเอกสารได้ตามสิทธิ์
- ต้องบันทึกเหตุผลเมื่อไม่อนุมัติ/ส่งกลับ

## Requirements
- FR-DOC-01 ระบบต้องแสดงเอกสารของผู้สมัครตามสิทธิ์    <- UC-10 requirement 1
- FR-DOC-02 ระบบต้องบันทึกผลตรวจสอบ    <- UC-10 requirement 2
- FR-DOC-03 เมื่อไม่อนุมัติต้องระบุเหตุผล    <- UC-10 requirement 3

## Quality Requirements
- NFR-SEC-01 เอกสารต้องเข้าถึงได้เฉพาะผู้มีสิทธิ์
- NFR-AUD-01 บันทึกประวัติการตรวจสอบเอกสาร

## Acceptance Criteria
- [ ] AC-DOC-01 (FR-DOC-02)
      Given เอกสารถูกต้องครบ
            When  อาจารย์อนุมัติ
            Then  ระบบบันทึกผลอนุมัติ
- [ ] AC-DOC-02 (FR-DOC-03)
      Given เอกสารไม่ถูกต้อง
            When  ส่งกลับ
            Then  ระบบบังคับระบุเหตุผล
- [ ] AC-DOC-03 (NFR-SEC-01)
      Given ไม่มีสิทธิ์ดูเอกสาร
            When  เปิดเอกสาร
            Then  ระบบปฏิเสธการเข้าถึง

## Assumptions & Open Questions
- ASM-01 ประเภทเอกสารที่ต้องใช้ถูกกำหนดไว้ในประกาศ
- Q-01 เอกสารที่แก้ไขแล้วต้องตรวจซ้ำทั้งหมดหรือเฉพาะรายการที่แก้? -> ยืนยันกับผู้รับผิดชอบ

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-10 requirement 1 | FR-DOC-01 | AC-DOC-01 |
| UC-10 requirement 2 | FR-DOC-02 | AC-DOC-02 |
| UC-10 requirement 3 | FR-DOC-03 | AC-DOC-03 |
| NFR-SEC-01 | Quality Requirements |  |
| NFR-AUD-01 | Quality Requirements |  |
