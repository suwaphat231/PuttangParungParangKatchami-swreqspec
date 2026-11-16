# RTM: เปิดรับสมัคร
อ้างอิง: [spec.md](./spec.md) Draft v1 | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | test เฉพาะฟีเจอร์: ไม่พบ

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-REC-01 | ไม่มี AC ตรง | T-01 พร้อมทำ | ไม่พบ recruitment creation API/UI | ไม่พบ test | ช่องโหว่ |
| FR-REC-02 | AC-REC-02 | T-02 พร้อมทำ | ไม่พบ date/quota validation | ไม่พบ test AC-REC-02 | ยังไม่ถึง |
| FR-REC-03 | AC-REC-01 | T-03 พร้อมทำ | ไม่พบ publish-state transition | ไม่พบ test AC-REC-01 | ยังไม่ถึง |
| NFR-SEC-01 | ไม่มี AC ตรง | T-01, T-04 | ไม่พบ authorization ก่อนแก้ไข | ไม่พบ test | ช่องโหว่ |
| NFR-AUD-01 | ไม่มี AC ตรง | T-02 | ไม่พบ creator/publish audit | ไม่พบ test | ช่องโหว่ |
| Constraint: ผู้เปิดต้องมีสิทธิ์ในวิชา/กิจกรรม | AC-REC-01 | T-01 | ไม่พบ ownership check | ไม่พบ test | ยังไม่ถึง |
| Constraint: วันเปิดต้องไม่มากกว่าวันปิด | AC-REC-02 | T-02 | ไม่พบ validation | ไม่พบ test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| `AnnouncementForm.jsx` | FR-ANN-* ของ UC-15 | ไม่ตรงกับ UC-06 | เป็นฟอร์มประกาศคนละ use case และไม่ได้ต่อ API |
| ไม่พบโค้ด UC-06 | - | ไม่มี implementation | - |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | FR ไม่มี AC | `spec.md`: Traceability | FR-REC-01, NFR-SEC-01, NFR-AUD-01 | Requirement เหล่านี้ไม่มี AC โดยตรง | |
| F-002 | อ้าง ID ผิดเรื่อง | `spec.md`: Traceability | FR-REC-01, FR-REC-03, AC-REC-01 | หัวข้อ AC-REC-01 ระบุว่าเป็นของ FR-REC-03 แต่ตาราง Traceability กลับผูก AC-REC-01 กับ FR-REC-01 | |

## 4. แก้แล้ว
ไม่มี
