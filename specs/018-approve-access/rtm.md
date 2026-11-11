# RTM: อนุมัติสิทธิ์
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md) | ไม่มี `test-cases.md`
สร้างด้วย /verify เมื่อ 2569-11-11 | test เฉพาะฟีเจอร์: ไม่พบ

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test | สถานะ |
|---|---|---|---|---|---|
| FR-IAM-01 | AC-IAM-01 | T-01 | ไม่พบ access-request list API/page | ไม่พบ test AC-IAM-01 | ยังไม่ถึง |
| FR-IAM-02 | AC-IAM-02 | T-02 | ไม่พบ role-matrix validation | ไม่พบ test AC-IAM-02 | ยังไม่ถึง |
| FR-IAM-03 | AC-IAM-02 | T-02 | ไม่พบ rejection/error response | ไม่พบ test AC-IAM-02 | ยังไม่ถึง |
| FR-IAM-04 | AC-IAM-03, AC-IAM-04 | T-03, T-04 | ไม่พบ approval/rejection persistence | ไม่พบ test AC-IAM-03/04 | ยังไม่ถึง |
| FR-IAM-05 | AC-IAM-05 | T-05 | ไม่พบ approver authorization | ไม่พบ test AC-IAM-05 | รอ Q-01 |
| NFR-SEC-01 | AC-IAM-05 | T-05 | ไม่พบ authorization ของ approver | ไม่พบ test | รอ Q-01 |
| NFR-SEC-02 | AC-IAM-02 | T-02 | ไม่พบการบล็อก role/permission นอก matrix | ไม่พบ test | ยังไม่ถึง |
| NFR-AUD-01 | AC-IAM-03, AC-IAM-04 | T-03, T-04 | ไม่พบ audit actor/time/reason | ไม่พบ test | ยังไม่ถึง |
| Constraint: role/permission ต้องตรง role matrix | AC-IAM-02 | T-02 | ไม่พบ role-matrix check | ไม่พบ test | ยังไม่ถึง |
| Constraint: role/permission นอก allowed list ต้องถูกปฏิเสธ | AC-IAM-02 | T-02 | ไม่พบ rejection guard | ไม่พบ test | ยังไม่ถึง |
| Constraint: rejection reason ห้ามว่าง | AC-IAM-04 | T-04 | ไม่พบ reject reason validation | ไม่พบ test | ยังไม่ถึง |
| Constraint: approve/reject ต้องระบุผู้อนุมัติและเวลา | AC-IAM-03, AC-IAM-04 | T-03, T-04 | ไม่พบ decision metadata | ไม่พบ test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| ไม่พบโค้ด UC-18 | - | ไม่มีโค้ดให้ตรวจ | - |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | อ้าง ID ผิดเรื่อง | `tasks.md`: T-06 | spec.md ไม่มี `ASM-02` | T-06 อ้าง ASM-02 ซึ่งไม่มีใน requirement/assumption ของ spec.md จึงไม่สามารถตามรอยงานนี้กลับไปยังข้อกำหนดได้ | |

## 4. แก้แล้ว
ไม่มี
