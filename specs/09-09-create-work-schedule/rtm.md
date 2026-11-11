# RTM: จัดทำตารางปฏิบัติงาน
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | ผลตรวจ: มีเอกสาร task แต่ไม่มีระบบจริง/test

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test | สถานะ |
|---|---|---|---|---|---|
| FR-SCH-01 | ไม่มี AC | T-01, T-02 | ไม่พบ schedule model/API | ไม่พบ test | ช่องโหว่ |
| FR-SCH-02 | AC-SCH-01 | T-01, T-03 | ไม่พบ quota logic | ไม่พบ test | ยังไม่ถึง |
| FR-SCH-03 | AC-SCH-02 | T-01, T-04 | ไม่พบ overlap logic | ไม่พบ test | ยังไม่ถึง |
| FR-SCH-04 | ไม่มี AC | T-06 | ไม่พบการแสดงตารางล่าสุด | ไม่พบ test | ช่องโหว่ |
| NFR-REL-01 | AC-SCH-03 | T-01, T-05 | ไม่พบ atomic transaction/concurrency control | ไม่พบ test | ยังไม่ถึง |
| NFR-PERF-01 | ไม่มี AC ที่ตรวจเวลา | T-01 ถึง T-07 | ไม่พบ benchmark | ไม่พบ test | ช่องโหว่ |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| ไม่พบโค้ด UC-09 | - | ไม่มีโค้ดให้ตรวจ | - |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | FR ไม่มี AC | `spec.md`: Acceptance Criteria/Traceability | FR-SCH-01, FR-SCH-04 | ไม่มี AC ที่ตรวจการแสดงช่วงเวลาที่จัดตารางได้หรือการแสดงตารางล่าสุด แม้ Traceability จะผูก AC-SCH-01 ไว้กับ FR-SCH-01/04 แต่เนื้อหา AC-SCH-01 ตรวจเฉพาะ quota | |
| F-002 | FR ไม่มี AC | `spec.md`: Acceptance Criteria/Traceability | NFR-PERF-01 | ไม่มี AC ที่ตรวจเกณฑ์ 2 วินาทีใน 95% ของคำขอ | |
| F-003 | AC ไม่มี test | `tasks.md`: T-07 | AC-SCH-01 ถึง AC-SCH-03 | T-07 ระบุเพียง test scenario ในเอกสาร และไม่มีผลทดสอบจริง | |

## 4. แก้แล้ว
ไม่มี
