# Feature: ดูประกาศรับสมัคร
Spec ID: SPEC-02-02- | Source: Use Case Diagram UC-02 | Use case: UC-02
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
นักศึกษาสามารถดูรายการและรายละเอียดประกาศรับสมัคร Lab Boy ที่เปิดเผยในระบบ

## Scope
### In scope
- แสดงรายการประกาศรับสมัคร
- ดูรายละเอียด คุณสมบัติ ช่วงเวลารับสมัคร และจำนวนที่รับ
- แสดงสถานะประกาศ
### Out of scope
- การสมัครเป็น Lab Boy (UC-01)

## Constraints
- ประกาศที่หมดเขตไม่ควรแสดงเป็นรายการที่สมัครได้
- ข้อมูลประกาศต้องมาจากข้อมูลที่เจ้าหน้าที่/อาจารย์เผยแพร่

## Requirements
- FR-ANN-01 ระบบต้องแสดงรายการประกาศรับสมัคร    <- UC-02 requirement 1
- FR-ANN-02 ระบบต้องแสดงรายละเอียดของประกาศที่เลือก    <- UC-02 requirement 2
- FR-ANN-03 ระบบต้องแสดงสถานะเปิด/ปิดของประกาศ    <- UC-02 requirement 3

## Quality Requirements
- NFR-PERF-01 การแสดงรายการประกาศควรตอบสนองภายในเวลาที่ระบบกำหนด
- NFR-USE-01 รายละเอียดสำคัญต้องอ่านและค้นหาได้ง่าย

## Acceptance Criteria
- [ ] AC-ANN-01 (FR-ANN-01)
      Given มีประกาศในระบบ
            When  เปิดหน้าเปิดรับสมัคร
            Then  แสดงรายการประกาศ
- [ ] AC-ANN-02 (FR-ANN-02)
      Given มีประกาศ
            When  เลือกประกาศ
            Then  แสดงรายละเอียดครบถ้วน
- [ ] AC-ANN-03 (FR-ANN-03)
      Given ประกาศหมดเขต
            When  เปิดดูประกาศ
            Then  แสดงสถานะปิดและไม่ให้สมัคร

## Assumptions & Open Questions
- ASM-01 ข้อมูลประกาศมีผู้รับผิดชอบตรวจสอบก่อนเผยแพร่
- Q-01 ต้องค้นหาประกาศด้วยรายวิชา/ภาคการศึกษาหรือไม่? -> ยืนยันกับผู้ใช้

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-02 requirement 1 | FR-ANN-01 | AC-ANN-01 |
| UC-02 requirement 2 | FR-ANN-02 | AC-ANN-02 |
| UC-02 requirement 3 | FR-ANN-03 | AC-ANN-03 |
| NFR-PERF-01 | Quality Requirements |  |
| NFR-USE-01 | Quality Requirements |  |
