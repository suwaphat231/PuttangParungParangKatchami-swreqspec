# RTM: ดูรายชื่อผู้สมัคร
อ้างอิง: [spec.md](./spec.md) Draft v1 | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | test เฉพาะฟีเจอร์: ไม่พบ

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-APP-01 | AC-APP-01 | T-01 พร้อมทำ | ไม่พบ applicant list API/page | ไม่พบ test AC-APP-01 | ยังไม่ถึง |
| FR-APP-02 | AC-APP-02 | T-02 พร้อมทำ | ไม่พบ search/filter applicants | ไม่พบ test AC-APP-02 | ยังไม่ถึง |
| FR-APP-03 | AC-APP-03 | T-03 พร้อมทำ | ไม่พบ access denial สำหรับรอบไม่มีสิทธิ์ | ไม่พบ test AC-APP-03 | ยังไม่ถึง |
| NFR-SEC-01 | ไม่มี AC ตรง | T-01 ถึง T-03 | ไม่พบ role/ownership guard | ไม่พบ test | ยังไม่ถึง |
| NFR-PERF-01 | ไม่มี AC ตรง | T-01 ถึง T-03 | ไม่พบ endpoint/benchmark | ไม่พบ test | ยังไม่ถึง |
| Constraint: จำกัดรอบ/รายวิชาตามสิทธิ์อาจารย์ | AC-APP-01, AC-APP-03 | T-01, T-03 | ไม่พบ authorization/query filter | ไม่พบ test | ยังไม่ถึง |
| Constraint: จำกัดข้อมูลส่วนบุคคลตามบทบาท | AC-APP-01 | T-01 | ไม่พบ applicant data policy/endpoint | ไม่พบ test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| `workerStatusDemo.js` | FR-WKS-* | ไม่ตรงกับ UC-07 | เป็นข้อมูลผู้ปฏิบัติงาน ไม่ใช่ผู้สมัคร |
| ไม่พบโค้ด UC-07 | - | ไม่มี implementation | - |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| - | - | - | - | ไม่มีข้อค้นพบใหม่; requirement ที่ยังไม่มีโค้ดแสดงเป็น `ยังไม่ถึง` และ T-04 รอ Q-01 ตาม tasks | - |

## 4. แก้แล้ว
ไม่มี
