# Feature: ติดตามและตรวจสอบการจ่ายเงิน
Spec ID: SPEC-16-16- | Source: Use Case Diagram UC-16 | Use case: UC-16
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
เจ้าหน้าที่ตรวจสอบสถานะการจ่ายเงินของ Lab Boy จากข้อมูลการปฏิบัติงานและระบบการเงิน

## Scope
### In scope
- ค้นหาผู้ปฏิบัติงาน
- ดูยอด/รายการที่เกี่ยวข้อง
- ตรวจสอบสถานะการจ่ายเงิน
- แสดงรายการที่ผิดปกติ
### Out of scope
- ตรวจสอบการจ่ายเงิน (UC-21)

## Constraints
- ข้อมูลการเงินเข้าถึงได้เฉพาะผู้มีสิทธิ์
- ต้องไม่แก้ไขข้อมูลต้นทางจากหน้าติดตาม

## Requirements
- FR-PAY-01 ระบบต้องแสดงรายการที่เกี่ยวข้องกับการจ่ายเงิน    <- UC-16 requirement 1
- FR-PAY-02 ระบบต้องแสดงสถานะจากระบบการเงิน    <- UC-16 requirement 2
- FR-PAY-03 ระบบต้องแสดงรายการที่ยังไม่จ่าย/ผิดปกติ    <- UC-16 requirement 3

## Quality Requirements
- NFR-SEC-01 จำกัดสิทธิ์ข้อมูลการเงิน
- NFR-AUD-01 บันทึกการเข้าถึงข้อมูลการเงิน

## Acceptance Criteria
- [ ] AC-PAY-01 (FR-PAY-02)
      Given ระบบการเงินมีข้อมูล
            When  เจ้าหน้าที่เปิดรายการ
            Then  แสดงสถานะล่าสุด
- [ ] AC-PAY-02 (FR-PAY-03)
      Given มีรายการผิดปกติ
            When  เปิดหน้าติดตาม
            Then  รายการถูกทำเครื่องหมายเพื่อดำเนินการ

## Assumptions & Open Questions
- ASM-01 ระบบการเงินเป็นแหล่งข้อมูลสถานะการจ่ายเงิน
- Q-01 ต้องแสดงจำนวนเงินหรือแสดงเฉพาะสถานะ? -> ยืนยันนโยบายข้อมูล

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-16 requirement 1 | FR-PAY-01 | AC-PAY-01 |
| UC-16 requirement 2 | FR-PAY-02 | AC-PAY-02 |
| UC-16 requirement 3 | FR-PAY-03 |  |
| NFR-SEC-01 | Quality Requirements |  |
| NFR-AUD-01 | Quality Requirements |  |
