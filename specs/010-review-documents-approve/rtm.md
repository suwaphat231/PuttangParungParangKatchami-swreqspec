# RTM: ตรวจสอบเอกสารและอนุมัติ
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | ผลตรวจ: มีเอกสาร task แต่ไม่พบ implementation/test

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test | สถานะ |
|---|---|---|---|---|---|
| FR-DOC-01 | ไม่มี AC ตรง | T-01, T-06 | ไม่พบ document endpoint/UI | ไม่พบ test | ช่องโหว่ |
| FR-DOC-02 | AC-DOC-01 | T-02, T-05 | ไม่พบ review/audit implementation | ไม่พบ test | ยังไม่ถึง |
| FR-DOC-03 | AC-DOC-02 | T-03 | ไม่พบ reason validation | ไม่พบ test | ยังไม่ถึง |
| NFR-SEC-01 | AC-DOC-03 | T-01, T-06 | ไม่พบ RBAC document access | ไม่พบ test | ยังไม่ถึง |
| NFR-AUD-01 | ไม่มี AC ตรง | T-02, T-04 | ไม่พบ immutable audit log | ไม่พบ test | ช่องโหว่ |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| ไม่พบโค้ด UC-10 | - | ไม่มีโค้ดให้ตรวจ | - |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | FR ไม่มี AC | `spec.md`: Traceability | FR-DOC-01 | FR-DOC-01 ไม่มี AC ที่ตรวจโดยตรง | |
| F-002 | FR ไม่มี AC | `spec.md`: Traceability | NFR-AUD-01 | NFR-AUD-01 ไม่มี AC ที่ตรวจโดยตรง | |

## 4. แก้แล้ว
ไม่มี
