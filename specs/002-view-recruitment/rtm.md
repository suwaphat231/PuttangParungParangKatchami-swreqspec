# RTM: ดูประกาศรับสมัคร
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md) | ไม่มี `test-cases.md`
สร้างด้วย /verify เมื่อ 2569-11-11 | test เฉพาะฟีเจอร์: ไม่พบ

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-ANN-01 | AC-ANN-01 | T-01, T-02, T-04 | ไม่พบ announcement model/API/list page | ไม่พบ test AC-ANN-01 | ช่องโหว่ |
| FR-ANN-02 | AC-ANN-02 | T-03 | ไม่พบ announcement detail page/API | ไม่พบ test AC-ANN-02 | ยังไม่ถึง |
| FR-ANN-03 | AC-ANN-03 | T-01, T-03 | ไม่พบ status/expired guard | ไม่พบ test AC-ANN-03 | ยังไม่ถึง |
| NFR-PERF-01 | ไม่มี AC ตรง | T-02, T-05 | ไม่พบ benchmark/cache implementation | ไม่พบ test | ช่องโหว่ |
| NFR-USE-01 | ไม่มี AC ตรง | T-02, T-03, T-05 | ไม่พบ list/detail UX implementation | ไม่พบ test | ช่องโหว่ |
| Constraint: ประกาศหมดเขตไม่เป็นรายการที่สมัครได้ | AC-ANN-03 | T-01 ถึง T-03 | ไม่พบ expiry/status rule | ไม่พบ test | ยังไม่ถึง |
| Constraint: ข้อมูลต้องมาจากเจ้าหน้าที่/อาจารย์เผยแพร่ | AC-ANN-01 | T-01, T-02 | ไม่พบ publication source/guard | ไม่พบ test | ยังไม่ถึง |
| Q-01: filter รายวิชา/ภาคการศึกษา | ไม่มี AC | T-04 | ยังไม่มี search/filter implementation | ไม่พบ test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/components/AnnouncementForm.jsx` | FR-ANN-* ของ UC-15 | ไม่ตรงกับ UC-02 | เป็นฟอร์มสร้างประกาศ ไม่ใช่หน้าดูประกาศ |
| ไม่พบโค้ด UC-02 | - | ไม่มี implementation | - |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | โค้ดไม่มี FR | `tasks.md`: T-01 | FR-ANN-01, FR-ANN-03 | T-01 ระบุว่า “เสร็จ รอทีมตรวจ” แต่ไม่พบ model หรือ service ตามไฟล์ที่ task ระบุ จึงยังไม่มี implementation ให้ยืนยัน requirement | |
| F-002 | FR ไม่มี AC | `spec.md`: Traceability | NFR-PERF-01, NFR-USE-01 | Quality Requirements ทั้งสองข้อไม่มี AC ที่ตรวจโดยตรง | |
| F-003 | โค้ดไม่มี FR | `frontend/src/components/AnnouncementForm.jsx` | FR-ANN-01 ถึง FR-ANN-03 ของ UC-02 | พบเป็นฟอร์มสร้างประกาศของ UC-15 ไม่ใช่หน้าดูประกาศของ UC-02 จึงไม่ใช่หลักฐาน implementation ของ UC-02 | |

## 4. แก้แล้ว
ไม่มี
