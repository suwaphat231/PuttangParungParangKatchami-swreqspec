# Feature: เข้าสู่ระบบ
Spec ID: SPEC-04-04- | Source: Use Case Diagram UC-04 | Use case: UC-04
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
ผู้ใช้งานยืนยันตัวตนและเข้าสู่ระบบตามสิทธิ์ของตน

## Scope
### In scope
- รับข้อมูลยืนยันตัวตน
- ตรวจสอบบัญชีและสิทธิ์
- สร้าง session สำหรับผู้ใช้
### Out of scope
- ฟังก์ชันตามสิทธิ์ของผู้ใช้งาน

## Constraints
- ต้องมีบัญชีที่ได้รับอนุญาต
- ต้องไม่เปิดเผยรหัสผ่านหรือข้อมูลยืนยันตัวตน

## Requirements
- FR-AUTH-01 ระบบต้องตรวจสอบข้อมูลยืนยันตัวตน    <- UC-04 requirement 1
- FR-AUTH-02 ระบบต้องกำหนดสิทธิ์ตามบทบาท    <- UC-04 requirement 2
- FR-AUTH-03 ระบบต้องปฏิเสธการเข้าสู่ระบบเมื่อข้อมูลไม่ถูกต้อง    <- UC-04 requirement 3
- FR-AUTH-04 ระบบต้องหมดอายุ session ตามนโยบายความปลอดภัย    <- UC-04 requirement 4

## Quality Requirements
- NFR-SEC-01 การยืนยันตัวตนต้องใช้ช่องทางที่ปลอดภัย
- NFR-SEC-02 รหัสผ่านต้องไม่ถูกเก็บเป็น plaintext
- NFR-AUD-01 ต้องบันทึกเหตุการณ์เข้าสู่ระบบและล้มเหลว

## Acceptance Criteria
- [ ] AC-AUTH-01 (FR-AUTH-01)
      Given บัญชีถูกต้อง
            When  ผู้ใช้ส่งข้อมูลเข้าสู่ระบบ
            Then  ระบบอนุญาตให้เข้าสู่ระบบ
- [ ] AC-AUTH-02 (FR-AUTH-02)
      Given ผู้ใช้มีบทบาทที่กำหนด
            When  เข้าสู่ระบบ
            Then  ระบบกำหนดสิทธิ์ตามบทบาท
- [ ] AC-AUTH-03 (FR-AUTH-03)
      Given ข้อมูลไม่ถูกต้อง
            When  เข้าสู่ระบบ
            Then  ระบบปฏิเสธและไม่สร้าง session

## Assumptions & Open Questions
- ASM-01 ระบบยืนยันตัวตน/บัญชีผู้ใช้มีข้อมูลบทบาท
- Q-01 ต้องใช้ MFA หรือไม่? -> ยืนยันกับผู้ดูแลระบบ

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-04 requirement 1 | FR-AUTH-01 | AC-AUTH-01 |
| UC-04 requirement 2 | FR-AUTH-02 | AC-AUTH-02 |
| UC-04 requirement 3 | FR-AUTH-03 | AC-AUTH-03 |
| UC-04 requirement 4 | FR-AUTH-04 |  |
| NFR-SEC-01 | Quality Requirements |  |
| NFR-SEC-02 | Quality Requirements |  |
| NFR-AUD-01 | Quality Requirements |  |
