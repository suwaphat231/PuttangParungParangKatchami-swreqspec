# RTM: ตรวจสอบเอกสารนักศึกษา
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | ผลตรวจ: tasks ระบุเสร็จ แต่ไม่พบ implementation/test ตามไฟล์ที่อ้าง

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test | สถานะ |
|---|---|---|---|---|---|
| FR-OFC-01 | AC-OFC-01 | T-01, T-05 | ไม่พบ checklist API/UI | ไม่พบ test | ช่องโหว่ |
| FR-OFC-02 | AC-OFC-02 | T-02, T-06 | ไม่พบ review persistence | ไม่พบ test | ช่องโหว่ |
| FR-OFC-03 | AC-OFC-03 | T-03, T-06 | ไม่พบ notification/reason validation | ไม่พบ test | ช่องโหว่ |
| NFR-SEC-01 | AC-OFC-03 | T-04 | ไม่พบ RBAC implementation | ไม่พบ test | ช่องโหว่ |
| NFR-AUD-01 | AC-OFC-02 | T-02, T-07 | ไม่พบ immutable audit log | ไม่พบ test | ช่องโหว่ |
| NFR-UX-01 | ไม่มี AC ตรง | T-05 ถึง T-07 | ไม่พบ UI | ไม่พบ test | ช่องโหว่ |
| NFR-NOT-01 | AC-OFC-03 | T-03, T-08 | ไม่พบ notification implementation | ไม่พบ test | ช่องโหว่ |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| ไม่พบโค้ด UC-14 ตาม tasks | - | ไม่มีโค้ดให้ตรวจ | - |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | โค้ดไม่มี FR | tasks.md | FR-OFC-01 ถึง FR-OFC-03 | สถานะ task เป็นเสร็จแล้ว แต่ไฟล์โค้ดและ test ที่ระบุไม่มีอยู่จริง | |

## 4. แก้แล้ว
ไม่มี
