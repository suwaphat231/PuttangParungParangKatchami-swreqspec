# Feature: เข้าสู่ระบบ
Spec ID: SPEC-04-04- | Source: Use Case Diagram UC-04 | Use case: UC-04
<<<<<<< HEAD
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19
=======
Owner: ทีม A | Status: Draft v2 | Updated: 2569-09-19
>>>>>>> 24812d5 (Guy)

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
<<<<<<< HEAD
=======
- ต้องยืนยันตัวตนผ่าน SSO ของสถาบัน
- อนุญาตเฉพาะรหัสนักศึกษา/บุคลากรหรืออีเมลมหาวิทยาลัย
- session หมดอายุเมื่อไม่มีการใช้งาน 120 นาที
- เมื่อเข้าสู่ระบบผิด 5 ครั้งภายใน 15 นาที ให้ล็อกชั่วคราว 15 นาที
>>>>>>> 24812d5 (Guy)

## Requirements
- FR-AUTH-01 ระบบต้องตรวจสอบข้อมูลยืนยันตัวตน    <- UC-04 requirement 1
- FR-AUTH-02 ระบบต้องกำหนดสิทธิ์ตามบทบาท    <- UC-04 requirement 2
- FR-AUTH-03 ระบบต้องปฏิเสธการเข้าสู่ระบบเมื่อข้อมูลไม่ถูกต้อง    <- UC-04 requirement 3
- FR-AUTH-04 ระบบต้องหมดอายุ session ตามนโยบายความปลอดภัย    <- UC-04 requirement 4
<<<<<<< HEAD
=======
- FR-AUTH-05 ระบบต้องกำหนดสิทธิ์จากบทบาทที่ได้รับจาก SSO ได้แก่ นักศึกษา อาจารย์ เจ้าหน้าที่ และผู้ดูแลระบบ
- FR-AUTH-06 ระบบต้องรองรับการออกจากระบบและยกเลิก session ของอุปกรณ์ปัจจุบัน
- FR-AUTH-07 ระบบต้องล็อกการเข้าสู่ระบบชั่วคราวเมื่อยืนยันตัวตนผิดตามจำนวนครั้งที่กำหนด
>>>>>>> 24812d5 (Guy)

## Quality Requirements
- NFR-SEC-01 การยืนยันตัวตนต้องใช้ช่องทางที่ปลอดภัย
- NFR-SEC-02 รหัสผ่านต้องไม่ถูกเก็บเป็น plaintext
- NFR-AUD-01 ต้องบันทึกเหตุการณ์เข้าสู่ระบบและล้มเหลว
<<<<<<< HEAD
=======
- NFR-AUD-02 ต้องบันทึก user เวลา IP และผลลัพธ์ของการเข้าสู่ระบบ โดยเก็บข้อมูลอย่างน้อย 1 ปี
>>>>>>> 24812d5 (Guy)

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
<<<<<<< HEAD

## Assumptions & Open Questions
- ASM-01 ระบบยืนยันตัวตน/บัญชีผู้ใช้มีข้อมูลบทบาท
- Q-01 ต้องใช้ MFA หรือไม่? -> ยืนยันกับผู้ดูแลระบบ
=======
- [ ] AC-AUTH-04 (FR-AUTH-04)
      Given ผู้ใช้ไม่มีการใช้งานต่อเนื่อง 120 นาที
            When  ส่งคำขอที่ต้องใช้ session
            Then  ระบบหมดอายุ session และให้เข้าสู่ระบบใหม่
- [ ] AC-AUTH-05 (FR-AUTH-05)
      Given SSO ส่งบทบาทของผู้ใช้
            When  เข้าสู่ระบบสำเร็จ
            Then  ระบบกำหนดสิทธิ์เป็น นักศึกษา อาจารย์ เจ้าหน้าที่ หรือผู้ดูแลระบบตามบทบาทที่ได้รับ
- [ ] AC-AUTH-06 (FR-AUTH-06)
      Given ผู้ใช้มี session อยู่
            When  ออกจากระบบ
            Then  ระบบยกเลิก session ของอุปกรณ์ปัจจุบัน
- [ ] AC-AUTH-07 (FR-AUTH-07)
      Given ผู้ใช้ยืนยันตัวตนผิด 5 ครั้งภายใน 15 นาที
            When  พยายามเข้าสู่ระบบครั้งถัดไป
            Then  ระบบล็อกการเข้าสู่ระบบของบัญชีนั้นเป็นเวลา 15 นาที
- [ ] AC-AUTH-08 (NFR-AUD-02)
      Given มีการเข้าสู่ระบบสำเร็จหรือล้มเหลว
            When  ระบบบันทึก audit
            Then  บันทึก user เวลา IP และผลลัพธ์ และเก็บไว้อย่างน้อย 1 ปี

## Assumptions & Open Questions
- ASM-01 ระบบยืนยันตัวตน/บัญชีผู้ใช้มีข้อมูลบทบาท
- ASM-02 ใช้ SSO ของสถาบันเป็นผู้ให้บริการยืนยันตัวตน
- ASM-03 ไม่ใช้ MFA
- ASM-04 session ใช้ idle timeout 120 นาที
- ASM-05 logout ยกเลิกเฉพาะ session ของอุปกรณ์ปัจจุบัน
- ASM-06 บทบาทที่รองรับคือ นักศึกษา อาจารย์ เจ้าหน้าที่ และผู้ดูแลระบบ
- ASM-07 เก็บ audit login อย่างน้อย 1 ปี
>>>>>>> 24812d5 (Guy)

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-04 requirement 1 | FR-AUTH-01 | AC-AUTH-01 |
| UC-04 requirement 2 | FR-AUTH-02 | AC-AUTH-02 |
| UC-04 requirement 3 | FR-AUTH-03 | AC-AUTH-03 |
<<<<<<< HEAD
| UC-04 requirement 4 | FR-AUTH-04 |  |
| NFR-SEC-01 | Quality Requirements |  |
| NFR-SEC-02 | Quality Requirements |  |
| NFR-AUD-01 | Quality Requirements |  |
=======
| UC-04 requirement 4 | FR-AUTH-04 | AC-AUTH-04 |
| Business rule | FR-AUTH-05 | AC-AUTH-05 |
| Business rule | FR-AUTH-06 | AC-AUTH-06 |
| Business rule | FR-AUTH-07 | AC-AUTH-07 |
| NFR-SEC-01 | Quality Requirements | AC-AUTH-01 |
| NFR-SEC-02 | Quality Requirements |  |
| NFR-AUD-01 | Quality Requirements | AC-AUTH-08 |
| NFR-AUD-02 | Quality Requirements | AC-AUTH-08 |
>>>>>>> 24812d5 (Guy)
