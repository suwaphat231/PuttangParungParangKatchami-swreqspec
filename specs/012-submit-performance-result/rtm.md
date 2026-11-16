# RTM: ส่งผลการปฏิบัติงาน
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | ผลตรวจ: มี Prototype Mock แต่ไม่มีระบบจริง/test

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test | สถานะ |
|---|---|---|---|---|---|
| FR-RES-01 | AC-RES-01 | T-01 | prototype.html จำลองเงื่อนไข | ไม่พบ test | ยังไม่ถึง |
| FR-RES-02 | AC-RES-02 | T-02, T-04 | prototype แสดงข้อมูลตัวอย่าง | ไม่พบ test | ยังไม่ถึง |
| FR-RES-03 | AC-RES-02 | T-03 | prototype จำลองสถานะ | ไม่พบ test | ยังไม่ถึง |
| NFR-REL-01 | ไม่มี AC ตรง | T-03 | ไม่พบ transaction จริง | ไม่พบ test | ช่องโหว่ |
| NFR-AUD-01 | ไม่มี AC ตรง | T-04 | ไม่พบ audit persistence | ไม่พบ test | ช่องโหว่ |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| `prototype.html` | FR-RES-* | บางส่วน | เป็นการจำลองใน browser ไม่ใช่ backend หรือ persistence |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | FR ไม่มี AC | `spec.md`: Traceability | NFR-REL-01, NFR-AUD-01 | NFR-REL-01 และ NFR-AUD-01 ไม่มี AC ที่ตรวจโดยตรง | |

## 4. แก้แล้ว
ไม่มี
