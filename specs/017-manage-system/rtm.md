# RTM: จัดการระบบ
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md) | ไม่มี `test-cases.md`
สร้างด้วย /verify เมื่อ 2569-11-11 | test เฉพาะฟีเจอร์: ไม่พบ

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test | สถานะ |
|---|---|---|---|---|---|
| FR-ADM-01 | AC-ADM-01 | T-01, T-06 | ไม่พบเมนู/ฟังก์ชันจัดการระบบ | ไม่พบ test AC-ADM-01 | ยังไม่ถึง |
| FR-ADM-02 | AC-ADM-02 | T-02, T-06 | ไม่พบ validation สำหรับฟิลด์ รูปแบบ ค่าซ้ำ หรือนโยบาย | ไม่พบ test AC-ADM-02 | ยังไม่ถึง |
| FR-ADM-03 | AC-ADM-03 | T-03, T-06 | ไม่พบการจัดการผู้ใช้/บทบาทหรือ Pending Approval | ไม่พบ test AC-ADM-03 | ยังไม่ถึง |
| FR-ADM-04 | AC-ADM-04 | T-04, T-06 | ไม่พบ service-status management page/API | ไม่พบ test AC-ADM-04 | ยังไม่ถึง |
| FR-ADM-05 | AC-ADM-05 | T-05, T-06 | ไม่พบ audit log ของ UC-17 | ไม่พบ test AC-ADM-05 | ยังไม่ถึง |
| FR-ADM-06 | AC-ADM-06 | T-03, T-06 | ไม่พบ self-approval prevention หรือ delayed activation | ไม่พบ test AC-ADM-06 | ยังไม่ถึง |
| NFR-SEC-01 | AC-ADM-01 | T-01, T-06 | ไม่พบ admin-or-higher authorization | ไม่พบ test | ยังไม่ถึง |
| NFR-SEC-02 | AC-ADM-03, AC-ADM-06 | T-03, T-06 | ไม่พบ approval gate สำหรับค่าตั้งค่าสำคัญ | ไม่พบ test | ยังไม่ถึง |
| NFR-AUD-01 | AC-ADM-05 | T-05, T-06 | ไม่พบ audit log ที่มี actor/time/before/after/detail | ไม่พบ test | ยังไม่ถึง |
| NFR-AVAIL-01 | AC-ADM-04 | T-04, T-06 | ไม่พบการแสดงสถานะและเวลาอัปเดตล่าสุด | ไม่พบ test | ยังไม่ถึง |
| Constraint: เฉพาะผู้ดูแลที่ได้รับสิทธิ์เข้าถึง | AC-ADM-01 | T-01 | ไม่พบ access control | ไม่พบ test | ยังไม่ถึง |
| Constraint: บทบาทหลัก 4 ระดับและหน้าที่ต่างกัน | AC-ADM-01, AC-ADM-03 | T-01 | ไม่พบ role matrix/implementation | ไม่พบ test | ยังไม่ถึง |
| Constraint: ป้องกันข้อมูลไม่ครบ ไม่ถูกต้อง หรือซ้ำ | AC-ADM-02 | T-02 | ไม่พบ validation | ไม่พบ test | ยังไม่ถึง |
| Constraint: การเปลี่ยนแปลงสำคัญต้องยืนยันและ audit ก่อนมีผล | AC-ADM-03, AC-ADM-05 | T-03, T-05 | ไม่พบ approval/audit flow | ไม่พบ test | ยังไม่ถึง |
| Constraint: ค่าตั้งค่าสำคัญต้องอนุมัติโดยอาจารย์หรือผู้มีสิทธิ์ | AC-ADM-03, AC-ADM-06 | T-03 | ไม่พบ approval role check | ไม่พบ test | ยังไม่ถึง |
| Constraint: แสดงสถานะล่าสุดและเวลาที่เปลี่ยน | AC-ADM-04 | T-04 | ไม่พบ service status | ไม่พบ test | ยังไม่ถึง |
| Constraint: ห้าม self-approval | AC-ADM-06 | T-03 | ไม่พบ self-approval guard | ไม่พบ test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| ไม่พบโค้ด UC-17 | - | ไม่มีโค้ดให้ตรวจ | - |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| - | - | - | - | ไม่มีข้อค้นพบใหม่; โค้ด `backend/app/payments/audit.py` เป็น UC-16 และไม่ถูกนับเป็น implementation ของ UC-17 | - |

## 4. แก้แล้ว
ไม่มี
