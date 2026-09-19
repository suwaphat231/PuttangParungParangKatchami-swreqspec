# Feature: ตรวจสอบการจ่ายเงิน
Spec ID: SPEC-21-21- | Source: Use Case Diagram UC-21 | Use case: UC-21
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
ระบบตรวจสอบสถานะการจ่ายเงินจากระบบการเงินและนำผลมาใช้ในระบบ LAB BOY

## Scope
### In scope
- ส่งข้อมูลอ้างอิงรายการจ่ายเงิน
- รับสถานะจากระบบการเงิน
- บันทึก/อัปเดตสถานะภายในระบบ
### Out of scope
- ติดตามและตรวจสอบการจ่ายเงิน (UC-16)

## Constraints
- ระบบการเงินเป็นแหล่งข้อมูลสถานะการจ่ายเงิน
- ต้องป้องกันการอัปเดตสถานะจากข้อมูลที่ไม่ตรงรายการ

## Requirements
- FR-FIN-01 ระบบต้องค้นหารายการจ่ายเงินด้วย reference ที่กำหนด    <- UC-21 requirement 1
- FR-FIN-02 ระบบต้องรับสถานะและเวลาที่เกี่ยวข้อง    <- UC-21 requirement 2
- FR-FIN-03 ระบบต้องอัปเดตสถานะโดยไม่สร้างรายการซ้ำ    <- UC-21 requirement 3

## Quality Requirements
- NFR-REL-01 การอัปเดตต้อง idempotent
- NFR-SEC-01 การเชื่อมต่อระบบการเงินต้องเข้ารหัส

## Acceptance Criteria
- [ ] AC-FIN-01 (FR-FIN-03)
      Given มีรายการจ่ายเงินเดิม
            When  รับข้อมูลซ้ำ
            Then  ระบบไม่สร้างรายการจ่ายเงินซ้ำ
- [ ] AC-FIN-02 (FR-FIN-02)
      Given ระบบการเงินตอบสถานะ paid
            When  ประมวลผล
            Then  สถานะภายในเปลี่ยนเป็น paid ตาม mapping

## Assumptions & Open Questions
- ASM-01 ระบบการเงินมี reference ที่ใช้เชื่อมรายการ
- Q-01 สถานะจากระบบการเงินมีค่าอะไรบ้าง? -> ยืนยัน mapping กับฝ่ายการเงิน

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-21 requirement 1 | FR-FIN-01 | AC-FIN-01 |
| UC-21 requirement 2 | FR-FIN-02 | AC-FIN-02 |
| UC-21 requirement 3 | FR-FIN-03 |  |
| NFR-REL-01 | Quality Requirements |  |
| NFR-SEC-01 | Quality Requirements |  |
