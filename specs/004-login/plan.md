# Implementation Plan: เข้าสู่ระบบ

Spec: `SPEC-04-04`  
Source: UC-04  
Status: Draft  
Updated: 2569-09-19

## Objective
พัฒนาการเข้าสู่ระบบผ่าน SSO ของสถาบัน ให้ผู้ใช้ได้รับสิทธิ์ตามบทบาท สร้าง session ที่ปลอดภัย หมดอายุตาม idle timeout และบันทึก audit การเข้าสู่ระบบสำเร็จหรือล้มเหลว

## Scope
- เชื่อมต่อ SSO ของสถาบัน
- รองรับรหัสนักศึกษา/บุคลากรหรืออีเมลมหาวิทยาลัย
- รองรับบทบาท นักศึกษา อาจารย์ เจ้าหน้าที่ และผู้ดูแลระบบ
- สร้างและยกเลิก session ของอุปกรณ์ปัจจุบัน
- หมดอายุ session หลังไม่มีการใช้งาน 120 นาที
- ล็อกการเข้าสู่ระบบ 15 นาทีเมื่อผิด 5 ครั้งภายใน 15 นาที
- บันทึก audit user เวลา IP และผลลัพธ์อย่างน้อย 1 ปี
- ไม่ใช้ MFA ในขอบเขตนี้

## Design Decisions
- SSO เป็นผู้ตรวจสอบรหัสผ่านและตัวตนหลัก ระบบไม่เก็บรหัสผ่านผู้ใช้
- ระบบต้องยอมรับเฉพาะบัญชีหรืออีเมลจากสถาบันที่ได้รับอนุญาต
- บทบาทจาก SSO ต้องถูกตรวจสอบกับ role ที่ระบบรองรับก่อนสร้าง session
- session ใช้ idle timeout 120 นาที และ logout ยกเลิกเฉพาะ session ปัจจุบัน
- การล็อกชั่วคราวใช้เกณฑ์ 5 ครั้งใน 15 นาที และล็อก 15 นาที
- ข้อมูล audit ต้องไม่เก็บรหัสผ่าน token หรือข้อมูลยืนยันตัวตนลับ

## Work Plan

### 1. SSO Integration
- [ ] ยืนยัน protocol และ endpoint ของ SSO ที่สถาบันจัดให้
- [ ] ลงทะเบียน client/application กับผู้ให้บริการ SSO
- [ ] ตรวจสอบ redirect URI และการป้องกัน CSRF/state
- [ ] ตรวจสอบ token หรือ assertion ตามมาตรฐานของ SSO
- [ ] ตรวจสอบ issuer, audience, expiry และ signature
- [ ] ตรวจสอบบัญชีหรืออีเมลว่าเป็นของสถาบัน
- [ ] กำหนดพฤติกรรมเมื่อ SSO ไม่พร้อมหรือส่งข้อมูลไม่ครบ

### 2. Account and Role Mapping
- [ ] กำหนด mapping identifier จาก SSO เป็นผู้ใช้ภายใน
- [ ] รองรับบทบาท นักศึกษา อาจารย์ เจ้าหน้าที่ และผู้ดูแลระบบ
- [ ] ปฏิเสธบทบาทที่ไม่อยู่ในรายการอนุญาต
- [ ] กำหนดพฤติกรรมเมื่อผู้ใช้ไม่มีบัญชีหรือบทบาทในระบบ
- [ ] ไม่สร้างสิทธิ์จากข้อมูลที่ผู้ใช้ส่งเองทาง client

### 3. Session Lifecycle
- [ ] สร้าง session หลัง SSO ยืนยันสำเร็จเท่านั้น
- [ ] ใช้ cookie/session configuration ที่ปลอดภัย เช่น Secure, HttpOnly และ SameSite
- [ ] กำหนด idle timeout 120 นาที
- [ ] ตรวจสอบและต่ออายุ idle timeout ตามกิจกรรมที่อนุญาต
- [ ] ทำให้ session หมดอายุเมื่อไม่มีการใช้งานเกินกำหนด
- [ ] รองรับ logout และยกเลิก session ของอุปกรณ์ปัจจุบัน
- [ ] ป้องกัน session fixation โดยสร้าง session identifier ใหม่หลัง login

### 4. Failed Login Protection
- [ ] นับความพยายามยืนยันตัวตนผิดตามบัญชีและช่วงเวลา
- [ ] ล็อกชั่วคราวเมื่อผิด 5 ครั้งภายใน 15 นาที
- [ ] ปลดล็อกอัตโนมัติหลัง 15 นาทีตามนโยบาย
- [ ] ไม่เปิดเผยว่าบัญชีมีอยู่หรือไม่ผ่านข้อความ error
- [ ] ป้องกันการนับซ้ำหรือ race condition เมื่อ login พร้อมกัน
- [ ] บันทึกเหตุการณ์ lockout และ failed login ใน audit

### 5. Authorization and Error Handling
- [ ] ส่งผู้ใช้ไปยังหน้าที่เหมาะสมหลัง login ตามบทบาท
- [ ] ปฏิเสธการเข้าระบบเมื่อข้อมูล SSO ไม่ถูกต้อง หมดอายุ หรือแก้ไข
- [ ] แสดงข้อความผิดพลาดที่ไม่เปิดเผยข้อมูลละเอียดอ่อน
- [ ] จัดการ timeout, cancel และ error จาก SSO
- [ ] ไม่สร้าง session เมื่อการยืนยันตัวตนล้มเหลว

### 6. Audit and Operations
- [ ] บันทึก user, เวลา, IP และผลลัพธ์ของ login
- [ ] แยกผลลัพธ์อย่างน้อย success, failure และ locked
- [ ] เก็บ audit อย่างน้อย 1 ปีตามนโยบาย
- [ ] จำกัดสิทธิ์การอ่านและแก้ไข audit log
- [ ] ไม่บันทึกรหัสผ่าน token หรือ secret ใน log
- [ ] กำหนด monitoring สำหรับ SSO error และ login failure ที่ผิดปกติ

## Test Plan

### Functional Tests
- [ ] บัญชี SSO ที่ถูกต้องเข้าสู่ระบบได้และสร้าง session (AC-AUTH-01)
- [ ] ระบบกำหนดสิทธิ์ตามบทบาททั้ง 4 ประเภท (AC-AUTH-05)
- [ ] ข้อมูลยืนยันตัวตนไม่ถูกต้องถูกปฏิเสธและไม่สร้าง session (AC-AUTH-03)
- [ ] session หมดอายุหลังไม่มีการใช้งาน 120 นาที (AC-AUTH-04)
- [ ] logout ยกเลิก session ของอุปกรณ์ปัจจุบัน (AC-AUTH-06)
- [ ] ผิด 5 ครั้งภายใน 15 นาทีแล้วถูกล็อก 15 นาที (AC-AUTH-07)
- [ ] บันทึก audit เมื่อ login สำเร็จและล้มเหลว (AC-AUTH-08)

### Security Tests
- [ ] ตรวจสอบ token/assertion ที่ปลอม แก้ไข หมดอายุ หรือมาจาก issuer ไม่ถูกต้อง
- [ ] ตรวจสอบ CSRF/state และ redirect URI ของ SSO
- [ ] ตรวจสอบ cookie flags และ session fixation
- [ ] ตรวจสอบว่า password/token/secret ไม่ปรากฏใน log หรือ response
- [ ] ตรวจสอบว่าผู้ใช้ไม่สามารถยกระดับ role จาก client
- [ ] ตรวจสอบว่าบัญชีถูกล็อกโดยไม่เปิดเผยข้อมูลบัญชีเกินจำเป็น

### Reliability and Performance Tests
- [ ] SSO ไม่พร้อมแล้วระบบไม่สร้าง session ปลอม
- [ ] login พร้อมกันไม่ทำให้ตัวนับ failed attempts ผิดพลาด
- [ ] การหมดอายุและ logout ทำให้ session เดิมใช้งานต่อไม่ได้
- [ ] ตรวจสอบเวลา response ของ login ภายใต้โหลดที่กำหนด

## Dependencies
- SSO/Identity Provider ของสถาบัน
- ข้อมูลบัญชีและ role mapping ภายในระบบ
- กลไก session store หรือ secure cookie
- ระบบจัดเก็บ audit log
- ระบบเวลาและ timezone ที่เชื่อถือได้
- นโยบายความปลอดภัยและ retention ของสถาบัน

## Open Items
- [ ] ยืนยัน protocol ของ SSO เช่น OIDC หรือ SAML
- [ ] ยืนยัน identifier หลักและ claim ที่ใช้ส่งบทบาท
- [ ] ยืนยันข้อความ redirect เมื่อ login สำเร็จตามแต่ละ role
- [ ] ยืนยันนโยบายการปลดล็อกก่อนครบ 15 นาที
- [ ] ยืนยันรูปแบบการแจ้งเตือนเมื่อ SSO ไม่พร้อม
- [ ] ยืนยันนโยบาย session เมื่อผู้ใช้มีหลายอุปกรณ์

## Traceability
| Area | Requirements / Acceptance Criteria |
|---|---|
| SSO และการยืนยันตัวตน | FR-AUTH-01, FR-AUTH-03 / AC-AUTH-01, AC-AUTH-03 |
| Role mapping | FR-AUTH-02, FR-AUTH-05 / AC-AUTH-02, AC-AUTH-05 |
| Session | FR-AUTH-04, FR-AUTH-06 / AC-AUTH-04, AC-AUTH-06 |
| Failed login protection | FR-AUTH-07 / AC-AUTH-07 |
| Secure transport | NFR-SEC-01 / AC-AUTH-01 |
| Password handling | NFR-SEC-02 |
| Audit | NFR-AUD-01, NFR-AUD-02 / AC-AUTH-08 |
