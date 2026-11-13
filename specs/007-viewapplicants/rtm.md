# RTM: ดูรายชื่อผู้สมัคร

อ้างอิง: [spec.md](./spec.md) Draft v1 (Updated 2569-11-13) | [tasks.md](./tasks.md) | [test-cases.md](./test-cases.md)
สร้างด้วย /verify เมื่อ 2569-11-13 15:50 | test: backend 54 ผ่าน 0 ไม่ผ่าน; frontend 19 ผ่าน 0 ไม่ผ่าน 1 todo (todo อยู่ใน `TC-STS-02` ของฟีเจอร์อื่น) | test ของฟีเจอร์นี้ 7 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)

| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-APP-01 | AC-APP-01 | T-01 เสร็จ; T-05 เสร็จ รอทีมตรวจ | `frontend/src/pages/ViewApplicantsPage.jsx`: `ViewApplicantsPage` (`managedRounds`, `roundApplicants`, แถว "ไม่พบผู้สมัคร"); `frontend/src/App.jsx`: route `/list-applicants` | `test_AC_APP_01` (2 ตัวชื่อซ้ำ) ผ่าน; `test_TC_APP_01_1_shows_managed_round_applicants` ผ่าน; `test_TC_APP_01_2_shows_single_managed_applicant` ผ่าน; `test_TC_APP_01_3_shows_empty_applicant_table` ไม่มี | ช่องโหว่ (F-004) |
| FR-APP-02 | AC-APP-02 | T-02 เสร็จ | `ViewApplicantsPage.jsx`: `filterApplicants`, `handleRoundChange`, `statusOptions`, ช่องค้นหา, ปุ่มสถานะ, dropdown รอบ | `test_AC_APP_02` ผ่าน (assert ครบ 4 เงื่อนไข: ชื่อ รหัส สถานะ รอบ) | ครบ |
| FR-APP-03 | AC-APP-03 | T-03 เสร็จ | `ViewApplicantsPage.jsx`: `getRequestedRoundId`, `isAccessDenied`, หน้าปฏิเสธ (`role="alert"`) | `test_AC_APP_03` ผ่าน (assert ข้อความปฏิเสธ ไม่มีตาราง ชื่อ รหัส ชื่อรอบ รายวิชา) | ช่องโหว่ (F-007) |
| NFR-SEC-01 | ไม่มี AC ตรง (ตรวจผ่าน AC-APP-01, AC-APP-03) | T-01, T-03, T-04 เสร็จ | `ViewApplicantsPage.jsx`: `rounds.filter(isManagedByTeacher)`, `isAccessDenied`, `TEACHER_VISIBLE_FIELDS`, `toTeacherView` | `test_AC_APP_01`, `test_AC_APP_03`, `test_Q_01` ผ่าน | ครบ |
| NFR-PERF-01 | ไม่มี AC | T-02 เสร็จ | `ViewApplicantsPage.jsx`: `useMemo` ครอบ `roundApplicants`, `statusOptions`, `visibleApplicants` | ไม่มี test (spec ไม่มีเกณฑ์เวลา) | ช่องโหว่ (F-002) |
| Constraint: แสดงข้อมูลเฉพาะในรอบ/รายวิชาที่อาจารย์มีสิทธิ์ | AC-APP-01 | T-01 เสร็จ; T-05 เสร็จ รอทีมตรวจ | `ViewApplicantsPage.jsx`: `managedRounds` ใช้ทั้ง dropdown และการกรองผู้สมัคร | `test_AC_APP_01`, `test_AC_APP_02` (dropdown ไม่มีรอบที่ไม่มีสิทธิ์) ผ่าน | ครบ |
| Constraint: ข้อมูลส่วนบุคคลต้องถูกจำกัดตามบทบาท | ไม่มี AC ตรง (Q-01 ปิดแล้ว) | T-01, T-04 เสร็จ | `ViewApplicantsPage.jsx`: `TEACHER_VISIBLE_FIELDS`, `toTeacherView`; ข้อมูลตัวอย่างไม่มีฟิลด์เอกสาร | `test_Q_01` ผ่าน (หัวตาราง ค่าที่แสดง และการตัดฟิลด์ `documents`, `nationalId`) | ครบ |
| Constraint: ไม่มีสิทธิ์ในรอบใด ต้องปฏิเสธการเข้าถึง | AC-APP-03 | T-03 เสร็จ | `ViewApplicantsPage.jsx`: `isAccessDenied` return ก่อน render ข้อมูลรอบ | `test_AC_APP_03` ผ่าน | ครบ |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)

| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/App.jsx`: route `/list-applicants` | FR-APP-01 | ตรง | เชื่อมหน้าของฟีเจอร์ |
| `ViewApplicantsPage.jsx`: `ViewApplicantsPage` | FR-APP-01, FR-APP-02, FR-APP-03, NFR-SEC-01, NFR-PERF-01 | ตรงบางส่วน | มีข้อมูลคงที่ "Sec 1 · พุธ…" และ badge แจ้งเตือน "1" (F-006), ปุ่มดูที่ไม่ทำงาน (F-008) |
| `ViewApplicantsPage.jsx`: `filterApplicants` | FR-APP-02 | ตรง | ค้นชื่อ/รหัสแบบคำบางส่วน และกรองสถานะ |
| `ViewApplicantsPage.jsx`: `statusOptions` | FR-APP-02 | ตรง | ชุดสถานะสร้างจากข้อมูลตามที่ทีมตัดสินใน T-02 ไม่ได้ตั้งชุดสถานะเอง |
| `ViewApplicantsPage.jsx`: `getRequestedRoundId`, `isAccessDenied` | FR-APP-03, NFR-SEC-01 | ตรง แต่มีกฎเกิน | รหัสรอบที่ไม่มีอยู่จริงก็ถูกปฏิเสธ (F-007) |
| `ViewApplicantsPage.jsx`: `TEACHER_VISIBLE_FIELDS`, `toTeacherView` | NFR-SEC-01, Q-01 | ตรง | ฟิลด์ตรงกับคำตอบ Q-01 ใน spec ทุกตัว |
| `ViewApplicantsPage.jsx`: ข้อมูลตัวอย่าง `rounds`, `applicants` | ASM-01, Q-01 | ตรง | ข้อมูลสมมติ in-memory (F-003) ไม่มีเอกสารประกอบ |
| `ViewApplicantsPage.jsx`: `PageHeader`, ไอคอน, `statusBadgeClass` | ไม่มี ID (การนำเสนอ) | ไม่ขัด | ปุ่มเมนูไม่ทำงาน แต่ไม่ได้แสดงข้อมูลผู้สมัคร |
| `ViewApplicantsPage.jsx`: แถว "ไม่พบผู้สมัคร" | FR-APP-01 (T-05, TC-APP-01-3) | ตรงกับ test-cases.md ที่ทีมอนุมัติ | spec เองไม่ได้ระบุข้อความนี้ ที่มาคือแถว TC-APP-01-3 ที่ทีมตรวจแล้ว |
| โค้ดอื่นใน `frontend/src` และ `backend/app` (booking, payments, slots, student_status, auth, ApplicationStatusPage, PaymentTrackingPage) | ฟีเจอร์อื่น | ไม่เกี่ยวกับ UC-07 | ไม่พบโค้ดอื่นที่อ่านหรือแสดงข้อมูลผู้สมัครของฟีเจอร์นี้ |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-004 | AC ไม่มี test | `test-cases.md` / `frontend/src/__tests__` | AC-APP-01, TC-APP-01-3 | แถว `TC-APP-01-3` สถานะ `ใช้ได้` แต่ยังไม่มี `test_TC_APP_01_3_shows_empty_applicant_table`; กรณีนี้ถูกตรวจใน `ViewApplicantsPage.test.jsx` แต่ตั้งชื่อเป็น `test_AC_APP_01` ซ้ำกับ test แรก จึงตามรอยกลับไปหา TC ไม่ได้ วิธีแก้: สั่ง `/testcases` สร้าง `TC-APP-01-3.test.jsx` | ผ่าน (ทีมตัดสิน 2569-11-13) |
| F-008 | โค้ดไม่มี FR | `ViewApplicantsPage.jsx`: ปุ่ม "ดู" (ไอคอนตา) ทุกแถว | spec In scope "ดูรายละเอียดใบสมัคร…" ไม่มี FR/AC/task รองรับ | ปุ่มดูแสดงอยู่แต่ไม่มี `onClick` กดแล้วไม่เกิดอะไร ขณะเดียวกัน In scope ข้อ "ดูรายละเอียดใบสมัครและข้อมูลที่มีสิทธิ์เข้าถึงตามบทบาท" และ "ค้นหารอบรับสมัครที่อาจารย์มีสิทธิ์" ไม่มี FR ใดรองรับ (ช่องว่างของ spec) ทีมต้องเลือกว่าจะเพิ่ม FR หรือเอาปุ่มออก | ผ่าน (ทีมตัดสิน 2569-11-13) |
| F-007 | ตัวเลขไม่ตรง spec | `ViewApplicantsPage.jsx`: `isAccessDenied` | FR-APP-03 | `?round=` ที่เป็นรหัสรอบที่ไม่มีอยู่จริง (เช่น `xyz`) ถูกปฏิเสธเหมือนรอบที่ไม่มีสิทธิ์ spec บอกเฉพาะกรณี "ไม่มีสิทธิ์" กฎสำหรับรอบที่ไม่มีอยู่จริงจึงเป็นการตัดสินใจแทนทีม และไม่มี test ครอบคลุม | ผ่าน (ทีมตัดสิน 2569-11-13) |
| F-006 | ตัวเลขไม่ตรง spec | `frontend/src/pages/ViewApplicantsPage.jsx` | spec.md / ขอบเขตข้อมูลของฟีเจอร์ | หน้าแสดงตารางเรียนคงที่ `Sec 1 · พุธ 14:50–16:35 · ห้อง 1227/1,1227/2 จ.1` และ badge แจ้งเตือน `1` ซึ่งไม่ได้ระบุใน spec จึงยังยืนยันความถูกต้องหรือที่มาของข้อมูลไม่ได้ (ยังพบอยู่ที่บรรทัด "Sec 1" ในการ์ด "กำลังดู" และ `PageHeader`; ข้อความเดียวกันแสดงทุกรอบ) | ผ่าน (ทีมตัดสิน 2569-11-13) |
| F-001 | กระบวนการทดสอบ | `test-cases.md` | ขั้นตอนอนุมัติ test cases | ตาราง TC มีบางแถวเป็น `ใช้ได้` แล้ว จึงไม่ควรระบุท้ายไฟล์ว่ายังเป็นร่างทั้งหมด (ยังพบ: TC-APP-01-1 ถึง 01-3 เป็น `ใช้ได้` แต่ท้ายไฟล์ยังเขียนว่าแถว `TC-*` ยังเป็นร่าง และหัวข้อ "หลักฐาน" ไม่มี test ของ TC) | ผ่าน (ทีมตัดสิน 2569-11-13) |
| F-002 | ข้อจำกัดเชิงคุณภาพ | `spec.md` NFR-PERF-01 | NFR-PERF-01 | spec ไม่ระบุเกณฑ์เวลาตอบสนอง จึงตรวจได้เพียงการใช้ `useMemo` แต่ยืนยัน threshold ไม่ได้ | ผ่านจากรอบก่อน |
| F-003 | ขอบเขตระบบ | prototype | การใช้งานจริง | ข้อมูลผู้สมัครเป็น in-memory sample และไม่มี backend/database จริง | ผ่านจากรอบก่อน |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| F-005 | T-05 เพิ่มรอบ `round-4` ที่ไม่มีผู้สมัคร และแถว "ไม่พบผู้สมัคร" | อ่านโค้ด `ViewApplicantsPage.jsx` พบ `visibleApplicants.length === 0` และ test empty-state ผ่าน |
| (เดิม) FR-APP-02, FR-APP-03, Q-01 ยังไม่ implement | เพิ่ม `filterApplicants`, `isAccessDenied`, `toTeacherView` | `test_AC_APP_02`, `test_AC_APP_03`, `test_Q_01` ผ่าน |
| (เดิม) ปุ่มรับ/ไม่รับ/รับทั้งหมด checkbox และแถบ "Lab Boy ที่รับแล้ว" อยู่ใน Out of scope (UC-08) | ลบออกจากหน้า | ค้นในโค้ดไม่พบแล้ว และ `test_Q_01` assert ว่าไม่มี checkbox และปุ่ม "รับ" |
| (เดิม) route `/applicants` ไม่ตรงกัน | เปลี่ยนเป็น `/list-applicants` ทั้ง `App.jsx` และ test | อ่าน `App.jsx` และ test ทุกไฟล์ใช้ path เดียวกัน |
