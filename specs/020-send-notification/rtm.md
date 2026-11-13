# RTM: ส่งคำขอแจ้งเตือน
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | ผลตรวจ: ไม่พบ implementation/test ของ UC-20

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test | สถานะ |
|---|---|---|---|---|---|
| FR-NOT-01 | AC-NOT-01 | T-01, T-02 | ไม่พบ notification queue/payload | ไม่พบ test | ยังไม่ถึง |
| FR-NOT-02 | AC-NOT-01 | T-03 | ไม่พบ async delivery | ไม่พบ test | ยังไม่ถึง |
| FR-NOT-03 | AC-NOT-02 | T-04 | ไม่พบ retry queue/history | ไม่พบ test | ยังไม่ถึง |
| NFR-REL-02 | AC-NOT-02 | T-04 | ไม่พบ retry implementation | ไม่พบ test | ยังไม่ถึง |
| NFR-PERF-01 | AC-NOT-01 | T-03 | ไม่พบ async implementation | ไม่พบ test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| ไม่พบโค้ด UC-20 | - | ไม่มีโค้ดให้ตรวจ | - |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| - | - | - | - | ไม่มีข้อค้นพบใหม่; requirement ที่ยังไม่มีโค้ดแสดงเป็น `ยังไม่ถึง` | - |

## 4. แก้แล้ว
ไม่มี
