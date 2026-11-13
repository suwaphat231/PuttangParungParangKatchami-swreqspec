# Tasks: เข้าสู่ระบบ

- Feature: เข้าสู่ระบบ
- Spec ID: SPEC-04-04
- อ้างอิง plan.md: [plan.md](./plan.md)
- วันที่: 2569-09-19

สรุป: มี 6 task ทั้งหมด และไม่มี Open Question ที่ต้องรอ

### T-01 กำหนด model, session และกฎความปลอดภัยของ auth
- รองรับ: FR-AUTH-01, FR-AUTH-02, FR-AUTH-04, FR-AUTH-07, NFR-SEC-02, NFR-AUD-01, NFR-AUD-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-01
- ไฟล์ที่แตะ: `backend/app/models/user.py`, `backend/app/models/session.py`, `backend/app/services/auth_policy.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: ระบบมีข้อมูลผู้ใช้และ session แบบปลอดภัยพร้อม idle timeout 120 นาที, กฎล็อกชั่วคราว 5 ครั้ง/15 นาที และ schema audit ที่เก็บ user เวลา IP และผลลัพธ์
- สถานะ: เสร็จ รอทีมตรวจ

### T-02 เชื่อมต่อ SSO ของสถาบันและตรวจสอบข้อมูลยืนยันตัวตน
- รองรับ: FR-AUTH-01, "ต้องยืนยันตัวตนผ่าน SSO ของสถาบัน", "อนุญาตเฉพาะรหัสนักศึกษา/บุคลากรหรืออีเมลมหาวิทยาลัย"
- ตรวจด้วย: AC-AUTH-01, AC-AUTH-03
- ไฟล์ที่แตะ: `backend/app/services/sso_service.py`, `backend/app/controllers/login_controller.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ผู้ใช้ส่งข้อมูลยืนยันตัวตนผ่าน SSO และระบบยอมรับบัญชีของสถาบันที่ได้รับอนุญาตเท่านั้น พร้อมปฏิเสธข้อมูลไม่ถูกต้องและไม่สร้าง session
- สถานะ: พร้อมทำ

### T-03 กำหนดบทบาทและสิทธิ์หลังเข้าสู่ระบบ
- รองรับ: FR-AUTH-02, FR-AUTH-05
- ตรวจด้วย: AC-AUTH-02, AC-AUTH-05
- ไฟล์ที่แตะ: `backend/app/services/role_service.py`, `backend/app/middleware/authorization.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: SSO ส่งบทบาทของผู้ใช้ ระบบกำหนดสิทธิ์ตามบทบาทที่รองรับเท่านั้น ได้แก่ นักศึกษา อาจารย์ เจ้าหน้าที่ และผู้ดูแลระบบ
- สถานะ: พร้อมทำ

### T-04 สร้าง session, logout และ idle timeout
- รองรับ: FR-AUTH-04, FR-AUTH-06, "session หมดอายุเมื่อไม่มีการใช้งาน 120 นาที", "เมื่อเข้าสู่ระบบผิด 5 ครั้งภายใน 15 นาที ให้ล็อกชั่วคราว 15 นาที"
- ตรวจด้วย: AC-AUTH-04, AC-AUTH-06
- ไฟล์ที่แตะ: `backend/app/services/session_service.py`, `backend/app/controllers/logout_controller.py`, `backend/app/middleware/session_guard.py`
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: การเข้าสู่ระบบสำเร็จสร้าง session ปลอดภัย, session หมดอายุหลังไม่มีการใช้งาน 120 นาที และ logout ยกเลิก session ของอุปกรณ์ปัจจุบันได้
- สถานะ: พร้อมทำ

### T-05 ป้องกันการเข้าสู่ระบบผิดซ้ำและล็อกชั่วคราว
- รองรับ: FR-AUTH-07, "เมื่อเข้าสู่ระบบผิด 5 ครั้งภายใน 15 นาที ให้ล็อกชั่วคราว 15 นาที"
- ตรวจด้วย: AC-AUTH-07
- ไฟล์ที่แตะ: `backend/app/services/login_lockout_service.py`, `backend/app/repositories/auth_attempt_repository.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: ระบบนับจำนวนความพยายามเข้าสู่ระบบผิดต่อบัญชีและช่วงเวลาแล้วล็อกบัญชีนั้นเป็นเวลา 15 นาทีเมื่อเกินเกณฑ์ที่กำหนด
- สถานะ: พร้อมทำ

### T-06 บันทึก audit, error handling และความปลอดภัยด้านข้อมูล
- รองรับ: NFR-SEC-01, NFR-AUD-01, NFR-AUD-02, FR-AUTH-03
- ตรวจด้วย: AC-AUTH-08
- ไฟล์ที่แตะ: `backend/app/services/audit_service.py`, `backend/app/middleware/security_headers.py`, `backend/app/controllers/error_controller.py`
- ต้องทำหลัง: T-02, T-04, T-05
- เสร็จเมื่อ: ระบบบันทึก user เวลา IP และผลลัพธ์ของ login สำเร็จ/ล้มเหลว ไว้อย่างน้อย 1 ปี พร้อมข้อความความผิดพลาดที่ไม่เปิดเผยหัวข้อที่ละเอียดอ่อนและไม่มีการเก็บ password/token/secret ในน log
- สถานะ: พร้อมทำ

## ตารางตรวจความครบ AC
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-AUTH-01 | T-02 |
| AC-AUTH-02 | T-03 |
| AC-AUTH-03 | T-02 |
| AC-AUTH-04 | T-04 |
| AC-AUTH-05 | T-03 |
| AC-AUTH-06 | T-04 |
| AC-AUTH-07 | T-05 |
| AC-AUTH-08 | T-06 |

## ตารางตรวจความครบ Constraint / Requirement
| Constraint ID / Requirement | task ที่ทำให้เป็นจริง |
|---|---|
| ต้องมีบัญชีที่ได้รับอนุญาต | T-02 |
| ต้องไม่เปิดเผยรหัสผ่านหรือข้อมูลยืนยันตัวตน | T-02, T-06 |
| ต้องยืนยันตัวตนผ่าน SSO ของสถาบัน | T-02 |
| อนุญาตเฉพาะรหัสนักศึกษา/บุคลากรหรืออีเมลมหาวิทยาลัย | T-02 |
| session หมดอายุเมื่อไม่มีการใช้งาน 120 นาที | T-01, T-04 |
| เมื่อเข้าสู่ระบบผิด 5 ครั้งภายใน 15 นาที ให้ล็อกชั่วคราว 15 นาที | T-01, T-05 |
| FR-AUTH-01 | T-02 |
| FR-AUTH-02 | T-03 |
| FR-AUTH-03 | T-02, T-06 |
| FR-AUTH-04 | T-04 |
| FR-AUTH-05 | T-03 |
| FR-AUTH-06 | T-04 |
| FR-AUTH-07 | T-05 |
| NFR-SEC-01 | T-02, T-06 |
| NFR-SEC-02 | T-01, T-06 |
| NFR-AUD-01 | T-06 |
| NFR-AUD-02 | T-06 |

## สิ่งที่ยังไม่ทำ
- ไม่มี Open Question ใน feature นี้
