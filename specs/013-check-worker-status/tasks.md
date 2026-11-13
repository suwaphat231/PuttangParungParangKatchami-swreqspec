# Tasks: ตรวจสอบสถานะผู้ปฏิบัติงาน
- Spec ID: SPEC-13-13-
- อ้างอิง: `spec.md`, `plan.md`
- วันที่: 2026-10-03

มีทั้งหมด 16 tasks โดยไม่มี task ที่รอ Q-01 เนื่องจากยืนยันแล้วว่ารายงานสรุปสถานะตามช่วงเวลาเป็น Required
ใช้ in-memory demo data และ API contract ที่บันทึกไว้ใน `plan.md` หัวข้อ 8

## รายการ Task

### T-01 จำกัดข้อมูล Backend ตามบทบาท
- รองรับ: NFR-SEC-01 และข้อจำกัดสิทธิ์เจ้าหน้าที่ภาควิชา อาจารย์ผู้สอน และผู้ดูแลระบบ
- ตรวจด้วย: AC-WKS-01
- ไฟล์ที่แตะ: `backend/app/authorization.py`, `backend/app/router.py`, `backend/app/main.py`, `backend/tests/test_app.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: เจ้าหน้าที่ภาควิชาเห็นเฉพาะรายวิชาในสังกัด อาจารย์เห็นเฉพาะรายวิชาที่รับผิดชอบ และผู้ดูแลระบบเห็นหรือสลับภาควิชาได้
- สถานะ: เสร็จ รอทีมตรวจ

### T-02 ดึงสถานะล่าสุดของผู้ปฏิบัติงาน
- รองรับ: FR-WKS-01
- ตรวจด้วย: AC-WKS-01
- ไฟล์ที่แตะ: `backend/app/worker_status.py`, `backend/app/router.py`, `backend/tests/test_app.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ข้อมูลที่ Backend ส่งให้แต่ละรายการเป็นสถานะล่าสุดจากชุดสถานะมาตรฐานทั้ง 4 ค่า
- สถานะ: เสร็จ รอทีมตรวจ

### T-03 ค้นหาและกรองข้อมูล Backend
- รองรับ: FR-WKS-02
- ตรวจด้วย: AC-WKS-02
- ไฟล์ที่แตะ: `backend/app/worker_status.py`, `backend/app/router.py`, `backend/tests/test_app.py`
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: ค้นหา/กรองได้ครบ 6 รายการ ได้แก่ รหัสนักศึกษา ชื่อ-นามสกุล รายวิชา ภาคการศึกษา ช่วงเวลาปฏิบัติงาน และสถานะ โดยรหัสกับชื่อรองรับ partial match และตัวกรองหลายรายการใช้ OR ข้ามตัวกรอง
- สถานะ: เสร็จ รอทีมตรวจ

### T-04 บันทึกเวลาเมื่อสถานะเปลี่ยน
- รองรับ: FR-WKS-03 และ ASM-02
- ตรวจด้วย: AC-WKS-03
- ไฟล์ที่แตะ: `backend/app/worker_status.py`, `backend/app/router.py`, `backend/tests/test_app.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: เมื่อสถานะผู้ปฏิบัติงานเปลี่ยน ค่า Last Updated Timestamp ถูกอัปเดตตามข้อมูลล่าสุด
- สถานะ: เสร็จ รอทีมตรวจ

### T-05 จัดเตรียมข้อมูลรายงานสรุปตามช่วงเวลา
- รองรับ: FR-WKS-02, Q-01
- ตรวจด้วย: AC-WKS-04
- ไฟล์ที่แตะ: `backend/app/worker_status.py`, `backend/app/router.py`, `backend/tests/test_app.py`
- ต้องทำหลัง: T-02, T-03
- เสร็จเมื่อ: Backend จัดเตรียมข้อมูลสรุปสถานะตามช่วงเวลาที่ทีมยืนยัน โดยไม่มีการกำหนดช่วงเวลาเพิ่มเติมจาก task นี้
- สถานะ: เสร็จ รอทีมตรวจ

### T-06 สร้างตัวควบคุมค้นหาและตัวกรอง
- รองรับ: FR-WKS-02
- ตรวจด้วย: AC-WKS-02
- ไฟล์ที่แตะ: `frontend/src/App.jsx`, `frontend/src/pages/WorkerStatusPage.jsx`, `frontend/src/pages/WorkerStatusPage.css`, `frontend/src/api/workerStatusDemo.js`, `frontend/src/pages/WorkerStatusPage.test.jsx`, `frontend/src/__tests__/setup.test.jsx`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าจอมีช่องค้นหารหัสนักศึกษาและชื่อ-นามสกุล พร้อมตัวกรองรายวิชา ภาคการศึกษา ช่วงเวลาปฏิบัติงาน และสถานะ โดยแสดงผลจากข้อมูลจำลอง
- สถานะ: เสร็จ รอทีมตรวจ

### T-07 แสดงรายการและสถานะปัจจุบัน
- รองรับ: FR-WKS-01, NFR-SEC-01
- ตรวจด้วย: AC-WKS-01
- ไฟล์ที่แตะ: `frontend/src/pages/WorkerStatusPage.jsx`, `frontend/src/pages/WorkerStatusPage.css`, `frontend/src/api/workerStatusDemo.js`, `frontend/src/pages/WorkerStatusPage.test.jsx`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าจอแสดงสถานะมาตรฐานล่าสุดของผู้ปฏิบัติงานแต่ละคนจากข้อมูลจำลอง
- สถานะ: เสร็จ รอทีมตรวจ

### T-08 แสดงผลเมื่อไม่พบข้อมูล
- รองรับ: FR-WKS-02
- ตรวจด้วย: AC-WKS-02
- ไฟล์ที่แตะ: `frontend/src/pages/WorkerStatusPage.jsx`, `frontend/src/pages/WorkerStatusPage.css`, `frontend/src/pages/WorkerStatusPage.test.jsx`
- ต้องทำหลัง: T-06
- เสร็จเมื่อ: เมื่อผลค้นหาว่าง หน้าจอแสดงข้อความ “ไม่พบข้อมูลผู้ปฏิบัติงานตามเงื่อนไขที่ระบุ”
- สถานะ: เสร็จ รอทีมตรวจ

### T-09 แสดง Last Updated Timestamp แบบเต็ม
- รองรับ: FR-WKS-03
- ตรวจด้วย: AC-WKS-03
- ไฟล์ที่แตะ: `frontend/src/pages/WorkerStatusPage.jsx`, `frontend/src/pages/WorkerStatusPage.css`, `frontend/src/pages/WorkerStatusPage.test.jsx`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าจอรายละเอียดแสดงวันและเวลาอัปเดตล่าสุดแบบเต็มของผู้ปฏิบัติงาน
- สถานะ: เสร็จ รอทีมตรวจ

### T-10 แสดงรายงานสรุปสถานะตามช่วงเวลา
- รองรับ: FR-WKS-02, Q-01
- ตรวจด้วย: AC-WKS-04
- ไฟล์ที่แตะ: `frontend/src/pages/WorkerStatusPage.jsx`, `frontend/src/pages/WorkerStatusPage.css`, `frontend/src/api/workerStatusDemo.js`, `frontend/src/pages/WorkerStatusPage.test.jsx`
- ต้องทำหลัง: T-07
- เสร็จเมื่อ: หน้าจอแสดงรายงานสรุปสถานะตามช่วงเวลาที่ทีมยืนยัน โดยใช้ข้อมูลจาก Backend
- สถานะ: เสร็จ รอทีมตรวจ

### T-11 ทดสอบสถานะและสิทธิ์ตามบทบาท
- รองรับ: FR-WKS-01, NFR-SEC-01
- ตรวจด้วย: AC-WKS-01
- ไฟล์ที่แตะ: `backend/tests/test_app.py`, `frontend/src/pages/WorkerStatusPage.test.jsx`
- ต้องทำหลัง: T-01, T-02, T-07
- เสร็จเมื่อ: การทดสอบยืนยันสถานะล่าสุดครบทั้ง 4 ค่า และขอบเขตข้อมูลถูกต้องสำหรับเจ้าหน้าที่ภาควิชา อาจารย์ผู้สอน และผู้ดูแลระบบ
- สถานะ: เสร็จ รอทีมตรวจ

### T-12 ทดสอบการค้นหาและตัวกรอง
- รองรับ: FR-WKS-02
- ตรวจด้วย: AC-WKS-02
- ไฟล์ที่แตะ: `backend/tests/test_app.py`, `frontend/src/pages/WorkerStatusPage.test.jsx`
- ต้องทำหลัง: T-03, T-06, T-08
- เสร็จเมื่อ: การทดสอบยืนยันตัวกรองทั้ง 6 รายการ การค้นหารหัส/ชื่อแบบบางส่วน เงื่อนไข OR เมื่อเลือกหลายตัวกรอง และข้อความเมื่อไม่พบข้อมูล
- สถานะ: เสร็จ รอทีมตรวจ

### T-13 ทดสอบ Timestamp ในหน้ารายละเอียด
- รองรับ: FR-WKS-03
- ตรวจด้วย: AC-WKS-03
- ไฟล์ที่แตะ: `backend/tests/test_app.py`, `frontend/src/pages/WorkerStatusPage.test.jsx`
- ต้องทำหลัง: T-04, T-09
- เสร็จเมื่อ: การทดสอบยืนยันว่ารายละเอียดแสดงวันเวลาแบบเต็มและค่าเวลาเปลี่ยนหลังสถานะเปลี่ยน
- สถานะ: เสร็จ รอทีมตรวจ

### T-14 ทดสอบรายงานสรุปสถานะตามช่วงเวลา
- รองรับ: FR-WKS-02, Q-01
- ตรวจด้วย: AC-WKS-04
- ไฟล์ที่แตะ: `backend/tests/test_app.py`, `frontend/src/pages/WorkerStatusPage.test.jsx`
- ต้องทำหลัง: T-05, T-10
- เสร็จเมื่อ: ผลทดสอบยืนยันรายงานสรุปสถานะตามช่วงเวลาที่ทีมยืนยันว่าถูกต้อง
- สถานะ: เสร็จ รอทีมตรวจ

### T-15 เชื่อมหน้าจอกับ Backend จริง
- รองรับ: FR-WKS-01, FR-WKS-02, FR-WKS-03, NFR-SEC-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-11, T-12 และ T-13
- ไฟล์ที่แตะ: `frontend/src/App.jsx`, `frontend/src/api/client.js`, `frontend/src/api/client.test.js`, `frontend/src/__tests__/setup.test.jsx`
- ต้องทำหลัง: T-01, T-02, T-03, T-04, T-05, T-06, T-07, T-08, T-09, T-10, T-11, T-12, T-13, T-14
- เสร็จเมื่อ: หน้าจอแสดงผลจาก Backend จริงสำหรับรายการค้นหา สถานะ รายละเอียด และขอบเขตข้อมูลตามบทบาท
- สถานะ: เสร็จ รอทีมตรวจ

### T-16 ทดสอบประสิทธิภาพการค้นหาและกรอง
- รองรับ: NFR-PERF-01
- ตรวจด้วย: AC-PERF-01
- ไฟล์ที่แตะ: `backend/tests/test_app.py`
- ต้องทำหลัง: T-03, T-15
- เสร็จเมื่อ: Performance Test แสดงผลการค้นหาและกรองข้อมูลไม่เกิน 10,000 รายการภายใน 2 วินาที
- สถานะ: เสร็จ รอทีมตรวจ

## ตารางตรวจความครบ

### Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-WKS-01 | T-01, T-02, T-07, T-11 |
| AC-WKS-02 | T-03, T-06, T-08, T-12 |
| AC-WKS-03 | T-04, T-09, T-13 |
| AC-WKS-04 | T-05, T-10, T-14 |
| AC-PERF-01 | T-16 |

### Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| ไม่มี ID ใน spec: เจ้าหน้าที่ภาควิชาเห็นเฉพาะรายวิชาที่สังกัดภาควิชาตนเอง | T-01, T-11 |
| ไม่มี ID ใน spec: อาจารย์ผู้สอนเห็นเฉพาะ Lab Boy ในรายวิชาที่ตนเองรับผิดชอบ | T-01, T-11 |
| ไม่มี ID ใน spec: ผู้ดูแลระบบเห็นข้อมูลทุกภาควิชาและสลับภาควิชาที่ต้องการดูได้ | T-01, T-11 |
| ไม่มี ID ใน spec: สถานะต้องมาจากข้อมูลล่าสุดและแสดง timestamp หลักที่ถูกอัปเดต | T-02, T-04, T-11, T-13 |

## สิ่งที่ยังไม่ทำ

- ไม่มี Open Question ที่ยังรอคำตอบ; Q-01 ยืนยันแล้วว่า Required และงานที่เกี่ยวข้องคือ T-05, T-10 และ T-14
- T-01 ผ่าน role-scoping; AC-WKS-01 ครอบคลุม list/status/role tests ใน T-01, T-02, T-07 และ T-11
- Technical decisions ที่ใช้ในรอบนี้ระบุไว้ใน `plan.md` หัวข้อ 8; ไม่มี task ที่เหลือสถานะพร้อมทำ