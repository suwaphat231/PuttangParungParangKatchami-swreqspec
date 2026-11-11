# RTM: ตรวจสอบสถานะผู้ปฏิบัติงาน
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | ผลตรวจ: พบ demo data แต่ไม่พบหน้า/API/test ตาม task

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test | สถานะ |
|---|---|---|---|---|---|
| FR-WKS-01 | AC-WKS-01 | T-02, T-07 | `frontend/src/api/workerStatusDemo.js` มีข้อมูล mock | ไม่พบ test เฉพาะ | ช่องโหว่ |
| FR-WKS-02 | AC-WKS-02 | T-03, T-06, T-08 | มี `listWorkers` mock แต่ไม่มีหน้า/Backend จริง | ไม่พบ test เฉพาะ | ช่องโหว่ |
| FR-WKS-03 | AC-WKS-03 | T-04, T-09 | มี `getWorker` mock แต่ไม่มี detail page จริง | ไม่พบ test เฉพาะ | ช่องโหว่ |
| NFR-SEC-01 | AC-WKS-01 | T-01, T-11 | context filter อยู่ใน mock เท่านั้น | ไม่พบ test | ช่องโหว่ |
| NFR-PERF-01 | ไม่มี AC ตรง | T-16 | ไม่พบ performance test | ไม่พบ test | ช่องโหว่ |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| `workerStatusDemo.js: listWorkers/getWorker/getStatusReport` | FR-WKS-01 ถึง FR-WKS-03 | บางส่วน | เป็น demo API ที่ไม่มี route/UI ใช้งานจริง |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | โค้ดไม่มีระบบจริง | workerStatusDemo.js | FR-WKS-01 ถึง FR-WKS-03 | tasks ระบุเสร็จ แต่ repository ไม่มี WorkerStatusPage, Backend route หรือ test ตามที่ระบุ | |
| F-002 | อ้าง ID ผิดเรื่อง | `tasks.md`: T-16 | NFR-PERF-01 | tasks.md อ้าง AC-PERF-01 แต่ spec.md ไม่มี AC นี้ จึงไม่ควรนำ AC-PERF-01 มาอ้างใน RTM | |

## 4. แก้แล้ว
ไม่มี
