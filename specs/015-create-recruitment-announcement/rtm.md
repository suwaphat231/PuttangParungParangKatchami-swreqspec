# RTM: จัดทำประกาศรับสมัคร
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md)
ปรับปรุงเมื่อ 2569-11-12 | ผลตรวจ: มี Prototype/ฟอร์มบางส่วน แต่ไม่พบระบบจริง; ไม่ได้รันทดสอบตามคำสั่ง

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test case / ผลรันทดสอบ | สถานะ |
|---|---|---|---|---|---|
| FR-ANN-01 | AC-ANN-01 | T-01, T-02, T-06, T-08 | `prototype.html` จำลองการบันทึก Draft ในหน่วยความจำ; `AnnouncementForm.jsx` ไม่มีหน้าที่เชื่อมฟอร์มหรือ persistence | TC-ANN-01-1 ถึง TC-ANN-01-4 ยังเป็นร่าง; ไม่มีผลรันทดสอบ | ช่องโหว่ |
| FR-ANN-02 | AC-ANN-02 | T-03, T-06, T-07, T-08 | `prototype.html` จำลอง required-field validation และ Publish ในหน่วยความจำ; React form แสดง checklist แต่ไม่มี validation หรือ state transition | TC-ANN-02-1 ถึง TC-ANN-02-4 ยังเป็นร่าง; ไม่มีผลรันทดสอบ | ช่องโหว่ |
| FR-ANN-03 | AC-ANN-03 | T-04, T-07, T-08 | `prototype.html` จำลอง publisher/time และ audit entries ในหน่วยความจำ; ไม่พบ persistence จริง | TC-ANN-03-1 ถึง TC-ANN-03-3 ปยังเป็นร่าง; ไม่มีผลรันทดสอบ | ช่องโหว่ |
| NFR-AUD-01 | AC-ANN-03 | T-04, T-08 | มี audit log จำลองในหน่วยความจำเท่านั้น; ไม่พบ `announcement_audit_logs` หรือการเก็บแบบ immutable จริง | TC-ANN-03-1 ถึง TC-ANN-03-3 ยังเป็นร่าง; ไม่มีผลรันทดสอบ | ช่องโหว่ |
| NFR-SEC-01 | AC-ANN-01, AC-ANN-02 | T-02, T-03, T-07, T-08 | `prototype.html` จำลองการกัน Student จากการจัดทำ/เผยแพร่; ไม่พบ auth/RBAC จริงที่เชื่อมระบบ | TC-ANN-01-3 และ TC-ANN-02-4 ยังเป็นร่าง; ไม่มีผลรันทดสอบ | ช่องโหว่ |
| Lifecycle Constraint / ASM-02 | AC-ANN-04 | T-05, T-08 | กำหนดเวลา 23:59:59 น. Asia/Bangkok และ job 00:05 น. แล้ว แต่ `prototype.html` ไม่มี scheduler หรือการเปลี่ยนสถานะอัตโนมัติ | TC-ANN-04-1 ถึง TC-ANN-04-4 ยังเป็นร่าง; ไม่มีผลรันทดสอบ | ช่องโหว่ |
| ASM-04 | AC-ANN-01 | T-07, T-08 | `prototype.html` แสดงรายการทุกสถานะโดยไม่กรองตาม role; Student จึงเห็นรายการ Draft ใน mock UI | TC-ANN-01-1 และ TC-ANN-01-4 ยังเป็นร่าง; ไม่มีผลรันทดสอบ | ช่องโหว่ |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| `prototype.html`: `saveDraft`, `publish`, `appendAudit` | FR-ANN-01, FR-ANN-02, FR-ANN-03, NFR-AUD-01, NFR-SEC-01 | บางส่วน (mock) | บันทึก/เผยแพร่/ตรวจ role/เพิ่ม audit ในหน่วยความจำ; ไม่ใช่ persistence หรือ authorization จริง และไม่มี scheduled expiry |
| `prototype.html`: `renderRecords` | ASM-04 | ไม่ตรง | แสดงรายการทุกสถานะโดยไม่กรอง Student |
| `frontend/src/components/AnnouncementForm.jsx` | FR-ANN-01, FR-ANN-02 | บางส่วน | เป็น component ที่ไม่ได้ต่อหน้า/API; แสดง checklist แต่ไม่ตรวจข้อมูลหรือบันทึกสถานะ |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | โค้ดไม่ครบ | UC-15 implementation | FR-ANN-01 ถึง FR-ANN-03, NFR-AUD-01, NFR-SEC-01, AC-ANN-04 | HTML prototype จำลอง Draft, validation, Publish, role guard และ audit log ด้วยข้อมูลในหน่วยความจำ; React form ยังไม่เชื่อมหน้า/API; ไม่พบ persistence, auth/RBAC จริง, immutable audit storage หรือ Scheduler ที่กำหนดให้รันทุกวัน 00:05 น. เพื่อเปลี่ยนเป็น Expired | |
| F-002 | โค้ดไม่ครบ | `prototype.html`: `renderRecords` | ASM-04 | รายการประกาศไม่ถูกกรองตาม role; เมื่อทดลองเป็น Student ยังเห็นประกาศ Draft ซึ่งขัดกับข้อกำหนดให้เห็นเฉพาะ Published | |

## 4. แก้แล้ว
ไม่มี
