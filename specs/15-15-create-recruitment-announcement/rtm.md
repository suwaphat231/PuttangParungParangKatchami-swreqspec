# RTM: จัดทำประกาศรับสมัคร
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | ผลตรวจ: มี Prototype/ฟอร์มบางส่วน แต่ไม่พบระบบจริง/test ตาม task

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test | สถานะ |
|---|---|---|---|---|---|
| FR-ANN-01 | AC-ANN-01 | T-01, T-02, T-06 | `AnnouncementForm.jsx` มีฟอร์มบางส่วน; ไม่มี API/persistence | ไม่พบ test UC-15 | ช่องโหว่ |
| FR-ANN-02 | AC-ANN-02 | T-03, T-07 | มีรายการ required fields ในฟอร์ม; ไม่มี publish validation จริง | ไม่พบ test | ช่องโหว่ |
| FR-ANN-03 | AC-ANN-03 | T-04, T-05, T-07 | ไม่พบ audit/lifecycle implementation | ไม่พบ test | ยังไม่ถึง |
| NFR-AUD-01 | AC-ANN-03 | T-04, T-08 | ไม่พบ announcement audit log | ไม่พบ test | ยังไม่ถึง |
| NFR-SEC-01 | AC-ANN-01 ถึง AC-ANN-03 | T-03, T-04, T-07 | ไม่พบ RBAC | ไม่พบ test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/components/AnnouncementForm.jsx` | FR-ANN-01, FR-ANN-02 | บางส่วน | เป็น component ที่ไม่ได้ต่อหน้า/API และไม่มี persistence |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | โค้ดไม่ครบ | AnnouncementForm.jsx | FR-ANN-01 ถึง FR-ANN-03 | tasks ระบุเสร็จ แต่มีเพียงฟอร์ม; ไม่พบ API, database, audit, RBAC หรือ test | |

## 4. แก้แล้ว
ไม่มี
