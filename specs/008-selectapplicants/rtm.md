# RTM: คัดเลือกผู้สมัคร
อ้างอิง: [spec.md](./spec.md) Draft v2 | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | test เฉพาะฟีเจอร์: ไม่พบ

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-SEL-01 | AC-SEL-01 | T-01 | ไม่พบ selection API/UI | ไม่พบ test | ยังไม่ถึง |
| FR-SEL-02 | AC-SEL-02 | T-02 | ไม่พบ unlimited-selection rule | ไม่พบ test | ยังไม่ถึง |
| FR-SEL-03 | AC-SEL-03 | T-03 | ไม่พบ actor/timestamp persistence | ไม่พบ test | ยังไม่ถึง |
| FR-SEL-04 | AC-SEL-04 | T-04 | ไม่พบ in-system notification flow | ไม่พบ test | ยังไม่ถึง |
| NFR-AUD-01 | AC-SEL-06 | T-05 | ไม่พบ recruitment/applicant audit history | ไม่พบ test | ยังไม่ถึง |
| NFR-SEC-01 | AC-SEL-05 | T-06 | ไม่พบ teacher-owner authorization | ไม่พบ test | ยังไม่ถึง |
| Constraint: เฉพาะอาจารย์เจ้าของวิชา | AC-SEL-05 | T-06 | ไม่พบ ownership guard | ไม่พบ test | ยังไม่ถึง |
| Constraint: เลือกเฉพาะผู้สมัครอยู่ระหว่างพิจารณา | AC-SEL-01 | T-01 | ไม่พบ status validation | ไม่พบ test | ยังไม่ถึง |
| Constraint: ไม่จำกัดจำนวนผู้ผ่าน | AC-SEL-02 | T-02 | ไม่พบ selection capacity rule | ไม่พบ test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| ไม่พบโค้ด UC-08 | - | ไม่มี implementation | - |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| - | - | - | - | ไม่มีข้อค้นพบใหม่; requirement ที่ยังไม่มีโค้ดแสดงเป็น `ยังไม่ถึง` | - |

## 4. แก้แล้ว
ไม่มี
