# Feature: อนุมัติสิทธิ์การเข้าใช้งาน
Spec ID: SPEC-18-18- | Source: Use Case Diagram UC-18 | Use case: UC-18
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
ผู้ดูแลระบบตรวจสอบและอนุมัติสิทธิ์ของผู้ใช้งานตามบทบาทที่กำหนด

## Scope
### In scope
- ดูคำขอ/บัญชีที่รออนุมัติ
- ตรวจสอบข้อมูล
- กำหนดบทบาทหรือสิทธิ์
- อนุมัติหรือปฏิเสธ
### Out of scope
- เข้าสู่ระบบ (UC-04)
- จัดการระบบ (UC-17)

## Constraints
- สิทธิ์ต้องสอดคล้องกับบทบาท
- ต้องบันทึกเหตุผลเมื่อปฏิเสธ

## Requirements
- FR-IAM-01 ระบบต้องแสดงรายการที่รออนุมัติ    <- UC-18 requirement 1
- FR-IAM-02 ระบบต้องให้กำหนดบทบาทตามรายการที่อนุญาต    <- UC-18 requirement 2
- FR-IAM-03 ระบบต้องบันทึกผลอนุมัติและผู้อนุมัติ    <- UC-18 requirement 3

## Quality Requirements
- NFR-SEC-01 การเปลี่ยนสิทธิ์ต้องได้รับการยืนยันโดยผู้มีอำนาจ
- NFR-AUD-01 ต้องเก็บประวัติการเปลี่ยนสิทธิ์

## Acceptance Criteria
- [ ] AC-IAM-01 (FR-IAM-03)
      Given มีคำขอรออนุมัติ
            When  ผู้ดูแลยืนยัน
            Then  ระบบบันทึกผลและผู้อนุมัติ
- [ ] AC-IAM-02 (FR-IAM-02)
      Given บทบาทไม่อยู่ในรายการที่อนุญาต
            When  กำหนดสิทธิ์
            Then  ระบบไม่อนุญาต

## Assumptions & Open Questions
- ASM-01 มี role matrix ที่กำหนดไว้
- Q-01 บัญชีใดต้องอนุมัติด้วยเจ้าหน้าที่อีกคนหรือไม่? -> ยืนยันนโยบาย IAM

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-18 requirement 1 | FR-IAM-01 | AC-IAM-01 |
| UC-18 requirement 2 | FR-IAM-02 | AC-IAM-02 |
| UC-18 requirement 3 | FR-IAM-03 |  |
| NFR-SEC-01 | Quality Requirements |  |
| NFR-AUD-01 | Quality Requirements |  |
