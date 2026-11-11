# RTM: ตรวจสอบวันและเวลาปฏิบัติงาน
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | ผลตรวจ: มี Prototype Mock แต่| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | FR ไม่มี AC | `spec.md`: Traceability | NFR-PERF-01 | NFR-PERF-01 ไม่มี AC ที่ตรวจโดยตรง จึงยังไม่มีเกณฑ์ยืนยันประสิทธิภาพใน RTM | |

## 4. แก้แล้ว
ไม่มีระบบจริง/test

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test | สถานะ |
|---|---|---|---|---|---|
| FR-CAL-01 | AC-CAL-01 | T-01, T-05 | [prototype.html](./prototype.html) ตรวจ input แบบ local เท่านั้น | ไม่พบ test | ยังไม่ถึง |
| FR-CAL-02 | AC-CAL-03 | T-02 | ไม่มี calendar source จริง | ไม่พบ test | ยังไม่ถึง |
| FR-CAL-03 | AC-CAL-02 | T-03 | Prototype ใช้ mock scenario | ไม่พบ test | ยังไม่ถึง |
| FR-CAL-04 | AC-CAL-03 | T-02 | ไม่มีการตรวจ freshness จริง | ไม่พบ test | ยังไม่ถึง |
| FR-CAL-05 | AC-CAL-04, AC-CAL-05 | T-04 | Prototype แสดง JSON mock | ไม่พบ test | ยังไม่ถึง |
| NFR-REL-01 | AC-CAL-02, AC-CAL-03 | T-02, T-03 | ไม่พบโค้ดจริง | ไม่พบ test | ยังไม่ถึง |
| NFR-PERF-01 | ไม่มี AC ตรง | T-07 | ไม่พบ benchmark | ไม่พบ test | ช่องโหว่ |
| NFR-INT-01 | AC-CAL-04, AC-CAL-05 | T-04 ถึง T-06 | ไม่มี endpoint จริง | ไม่พบ test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| `prototype.html` form/script | FR-CAL-01, FR-CAL-05 | บางส่วน | เป็น mock response และไม่เรียก calendar/API จริง |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|

## 4. แก้แล้ว
ไม่มี
