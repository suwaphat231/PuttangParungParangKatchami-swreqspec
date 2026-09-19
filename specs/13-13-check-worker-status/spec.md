# Feature: ตรวจสอบสถานะผู้ปฏิบัติงาน
Spec ID: SPEC-13-13- | Source: Use Case Diagram UC-13 | Use case: UC-13
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
เจ้าหน้าที่ตรวจสอบสถานะของ Lab Boy ในกระบวนการปฏิบัติงาน

## Scope
### In scope
- ค้นหา Lab Boy
- ดูสถานะการคัดเลือก/ตาราง/ผลการปฏิบัติงาน
- กรองตามรายวิชาและช่วงเวลา
### Out of scope
- ติดตามและตรวจสอบการจ่ายเงิน (UC-16)

## Constraints
- เจ้าหน้าที่เห็นข้อมูลตามสิทธิ์ของภาควิชา
- สถานะต้องมาจากข้อมูลล่าสุด

## Requirements
- FR-WKS-01 ระบบต้องแสดงสถานะผู้ปฏิบัติงาน    <- UC-13 requirement 1
- FR-WKS-02 ระบบต้องค้นหาและกรองได้    <- UC-13 requirement 2
- FR-WKS-03 ระบบต้องแสดงวันเวลาที่ข้อมูลถูกอัปเดตล่าสุด    <- UC-13 requirement 3

## Quality Requirements
- NFR-SEC-01 จำกัดข้อมูลตามสิทธิ์
- NFR-PERF-01 การค้นหาต้องตอบสนองภายในเวลาที่กำหนด

## Acceptance Criteria
- [ ] AC-WKS-01 (FR-WKS-01)
      Given มี Lab Boy ในระบบ
            When  เจ้าหน้าที่ค้นหา
            Then  แสดงสถานะล่าสุด
- [ ] AC-WKS-02 (FR-WKS-03)
      Given ข้อมูลถูกอัปเดต
            When  เปิดรายละเอียด
            Then  แสดงเวลาที่อัปเดตล่าสุด

## Assumptions & Open Questions
- ASM-01 สถานะมาตรฐานถูกกำหนดร่วมกันทุกฝ่าย
- Q-01 ต้องมีรายงานสรุปสถานะตามช่วงเวลาหรือไม่? -> ยืนยันกับเจ้าหน้าที่

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-13 requirement 1 | FR-WKS-01 | AC-WKS-01 |
| UC-13 requirement 2 | FR-WKS-02 | AC-WKS-02 |
| UC-13 requirement 3 | FR-WKS-03 |  |
| NFR-SEC-01 | Quality Requirements |  |
| NFR-PERF-01 | Quality Requirements |  |
