# RTM: ดูรายชื่อผู้สมัคร

อ้างอิง: [spec.md](./spec.md) Draft v1 | [plan.md](./plan.md) | [tasks.md](./tasks.md) | [test-cases.md](./test-cases.md)
ปรับปรุงด้วยการตรวจ RTM เมื่อ 2569-11-12 | test เฉพาะฟีเจอร์: พบ `test_AC_APP_01` ผ่าน 1 รายการ; test cases 9 แถวยังเป็น `ร่าง`

## 1. ตามรอยไปข้างหน้า

| ID | AC | task | โค้ด | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-APP-01 | AC-APP-01 | T-01 เสร็จ รอทีมตรวจ | `frontend/src/pages/ViewApplicantsPage.jsx`, `frontend/src/App.jsx` | `test_AC_APP_01` ผ่าน; `TC-APP-01-1` ถึง `TC-APP-01-3` ยังร่าง | ทำแล้ว รอทีมตรวจ |
| FR-APP-02 | AC-APP-02 | T-02 พร้อมทำ | ยังไม่พบ logic ค้นหา/กรอง | `TC-APP-02-1` ถึง `TC-APP-02-3` ยังร่าง | ยังไม่ถึง |
| FR-APP-03 | AC-APP-03 | T-03 พร้อมทำ | ยังไม่พบ access denial สำหรับรอบไม่มีสิทธิ์ | `TC-APP-03-1` ถึง `TC-APP-03-3` ยังร่าง | ยังไม่ถึง |
| NFR-SEC-01 | ไม่มี AC ตรง | T-01, T-03, T-04 | T-01 กรองข้อมูลตัวอย่างด้วย `isManagedByTeacher`; T-03/T-04 ยังไม่ทำ | ยังไม่มี test ที่ทีมอนุมัติ | บางส่วนแล้ว |
| NFR-PERF-01 | ไม่มี AC ตรง | T-02 | ยังไม่พบ implementation หรือ benchmark ของการค้นหา/กรอง | ยังไม่มี test | ยังไม่ถึง |
| Constraint: จำกัดรอบ/รายวิชาตามสิทธิ์อาจารย์ | AC-APP-01, AC-APP-03 | T-01, T-03 | T-01 แสดงผู้สมัครจากรอบที่ `isManagedByTeacher` เป็นจริง; T-03 ยังไม่ทำ | `test_AC_APP_01` ผ่าน; AC-APP-03 ยังร่าง | บางส่วนแล้ว |
| Constraint: จำกัดข้อมูลส่วนบุคคลตามบทบาท | AC-APP-01 | T-01, T-04 | T-01 แสดงเฉพาะ `studentId`, `name`, `status`; ข้อมูลที่อยู่ใน Q-01 ยังไม่สร้าง | ยังไม่มี test ที่ตรวจ Q-01 | บางส่วนแล้ว |
| Constraint: ปฏิเสธรอบที่ไม่มีสิทธิ์ | AC-APP-03 | T-03 | ยังไม่พบ denial state | `TC-APP-03-1` ถึง `TC-APP-03-3` ยังร่าง | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ

| โค้ด / test | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/pages/ViewApplicantsPage.jsx` | FR-APP-01, NFR-SEC-01, AC-APP-01 | ตรง | แสดงผู้สมัครเฉพาะรอบที่อาจารย์รับผิดชอบ |
| `frontend/src/App.jsx` | FR-APP-01, AC-APP-01 | ตรง | เชื่อมหน้า prototype ที่ path `/applicants` |
| `frontend/src/pages/ViewApplicantsPage.test.jsx` | AC-APP-01 | ตรง | `test_AC_APP_01` ผ่าน 1 test |
| `specs/007-viewapplicants/test-cases.md` | AC-APP-01, AC-APP-02, AC-APP-03 | ตรง | มี 9 แถว แต่ทุกแถวยังมีสถานะ `ร่าง` จึงยังไม่เขียน test ตามตาราง |

## 3. ข้อค้นพบ

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | ความครบถ้วน | `test-cases.md` | ขั้นตอนอนุมัติ test cases | test cases ทั้ง 9 แถวยังเป็น `ร่าง` จึงยังใช้เป็นหลักฐานยืนยัน AC ไม่ได้ | - |
| F-002 | ความครบถ้วน | `tasks.md` / implementation | FR-APP-02, FR-APP-03 | T-02 และ T-03 ยังไม่ได้ทำ จึงยังไม่มีการค้นหา/กรองหรือปฏิเสธการเข้าถึง | - |
| F-003 | Open Question | `spec.md` Q-01 | NFR-SEC-01 | ขอบเขตข้อมูลส่วนบุคคลที่อาจารย์มีสิทธิ์ดูยังไม่ยืนยัน และ T-04 อยู่สถานะรอ Q-01 | - |

## 4. แก้แล้ว

- แก้สถานะ T-01 และเพิ่มหลักฐานโค้ด/test ของ AC-APP-01
- เพิ่ม traceability ของ `test-cases.md` ทั้ง 9 แถว โดยระบุว่ายังเป็นร่าง
- เพิ่ม Constraint เรื่องการปฏิเสธการเข้าถึงที่เดิมตกหล่น
- แก้ task mapping ของ NFR-SEC-01 และ NFR-PERF-01 ให้ตรงกับ `tasks.md`
