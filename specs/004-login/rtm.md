# RTM: เข้าสู่ระบบ
อ้างอิง: [spec.md](./spec.md) Draft v1/v2 มี conflict markers | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | test เฉพาะฟีเจอร์: ไม่พบ

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-AUTH-01 | AC-AUTH-01 | T-01, T-02 | ไม่พบ login/SSO endpoint | ไม่พบ test | ยังไม่ถึง |
| FR-AUTH-02 | AC-AUTH-02 | T-02 | ไม่พบ role assignment flow | ไม่พบ test | ยังไม่ถึง |
| FR-AUTH-03 | AC-AUTH-03 | T-02, T-06 | ไม่พบ invalid-login/session rejection | ไม่พบ test | ยังไม่ถึง |
| FR-AUTH-04 | AC-AUTH-04 | T-01, T-04 | ไม่พบ session idle-timeout | ไม่พบ test | ยังไม่ถึง |
| FR-AUTH-05 | AC-AUTH-05 | T-02 | ไม่พบ SSO role mapping | ไม่พบ test | ยังไม่ถึง |
| FR-AUTH-06 | AC-AUTH-06 | T-05 | ไม่พบ logout/session revoke | ไม่พบ test | ยังไม่ถึง |
| FR-AUTH-07 | AC-AUTH-07 | T-05 | ไม่พบ failed-attempt lockout | ไม่พบ test | ยังไม่ถึง |
| NFR-SEC-01 | ไม่มี AC ตรง | T-01, T-06 | ไม่พบ secure authentication | ไม่พบ test | ช่องโหว่ |
| NFR-SEC-02 | ไม่มี AC ตรง | T-01, T-06 | ไม่พบ password storage | ไม่พบ test | ช่องโหว่ |
| NFR-AUD-01 | ไม่มี AC ตรง | T-01, T-06 | ไม่พบ login audit | ไม่พบ test | ช่องโหว่ |
| NFR-AUD-02 | AC-AUTH-08 | T-01, T-06 | ไม่พบ audit retention | ไม่พบ test | ยังไม่ถึง |
| Constraint: ต้องมีบัญชีได้รับอนุญาต | AC-AUTH-01 | T-01 | ไม่พบ account provider | ไม่พบ test | ยังไม่ถึง |
| Constraint: ห้ามเปิดเผย password/credential | AC-AUTH-03 | T-01, T-06 | ไม่พบ login implementation/log policy | ไม่พบ test | ยังไม่ถึง |
| Constraint: ต้องใช้ SSO และบัญชีมหาวิทยาลัย | AC-AUTH-01, AC-AUTH-03 | T-02 | ไม่พบ implementation | ไม่พบ test | ยังไม่ถึง |
| Constraint: session timeout 120 นาที | AC-AUTH-04 | T-04 | ไม่พบ implementation | ไม่พบ test | ยังไม่ถึง |
| Constraint: lockout 5 ครั้ง/15 นาที/15 นาที | AC-AUTH-07 | T-05 | ไม่พบ implementation | ไม่พบ test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| `backend/app/auth/idp.py: get_verified_hn` | IF-IDP-01 | ไม่ตรงกับ UC-04 | เป็น token จำลองสำหรับ booking ไม่ใช่ SSO login |
| `backend/app/payments/auth.py` | FR-PAY-04 | ไม่ตรงกับ UC-04 | เป็น authorization เฉพาะ UC-16 |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | เอกสารเสียหาย | `spec.md` หลายช่วง | ความถูกต้องของ requirement | มี `<<<<<<<`, `=======`, `>>>>>>>` และเนื้อหา v1/v2 ปะปนกัน ทำให้ขอบเขต requirement ไม่เป็นเอกภาพ | |
| F-002 | FR ไม่มี AC | `spec.md`: Traceability | NFR-SEC-01, NFR-SEC-02, NFR-AUD-01 | ตาราง traceability มี quality requirements เหล่านี้ที่ไม่มี AC โดยตรง และ AC-AUTH-08 อ้าง NFR-AUD-02 ไม่ครอบคลุม NFR-AUD-01 ชัดเจน | |
| F-003 | โค้ดไม่มี FR | `tasks.md`: T-01 | FR-AUTH-01, FR-AUTH-02, FR-AUTH-04, FR-AUTH-07, NFR-SEC-02, NFR-AUD-01, NFR-AUD-02 | T-01 ระบุ “เสร็จ รอทีมตรวจ” แต่ไม่พบ implementation ตาม task; จึงยังยืนยัน requirement เหล่านี้ไม่ได้ | |

## 4. แก้แล้ว
ไม่มี
