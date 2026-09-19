# Feature: จัดทำประกาศรับสมัคร
Spec ID: SPEC-15-15- | Source: Use Case Diagram UC-15 | Use case: UC-15
Owner: ทีม A | Status: Draft v2 | Updated: 2569-09-20

## Goal
เจ้าหน้าที่จัดทำและเผยแพร่ประกาศรับสมัคร Lab Boy ให้เป็นแหล่งข้อมูลหลักสำหรับกระบวนการรับสมัคร โดยมีข้อมูลที่ครบถ้วนและบันทึกประวัติการเปลี่ยนแปลงตามมาตรฐานความปลอดภัยและตรวจสอบย้อนกลับได้

## Scope
### In scope
- สร้างประกาศแบบร่าง (Draft)
- กำหนดรายละเอียดและเงื่อนไขประกาศรับสมัคร
- ระบุข้อมูลเอกสารบังคับและคุณสมบัติผู้สมัคร
- บันทึกยืนยันฉบับร่างและประวัติการปรับปรุง
- กำหนดสถานะประกาศตาม lifecycle ที่ชัดเจน
- เผยแพร่ประกาศ (Published)
- บันทึกประวัติการกระทำแบบ immutable audit log
### Out of scope
- ดูประกาศรับสมัคร (UC-02)
- เปิดรับสมัคร (UC-06)
- การอนุมัติกลางก่อนเผยแพร่สำหรับภาควิชา (ยกเลิกตามข้อตกลง RBAC)

## Constraints
- ฟิลด์ข้อมูลบังคับต้องครบถ้วนก่อนเปลี่ยนสถานะเป็น Published
- ประกาศแบบ Draft สามารถบันทึกไว้ก่อนเผยแพร่โดยไม่บังคับให้กรอกทุกฟิลด์
- ผู้จัดทำต้องมีสิทธิ์ของภาควิชา และผู้ดูแลระบบ (Admin) มีสิทธิ์เปลี่ยนสถานะ Draft → Published ได้ทันที
- สถานะประกาศต้องเป็นไปตาม lifecycle: Draft → Published → Expired / Archived
- ประวัติการจัดทำและการเปลี่ยนสถานะต้องถูกบันทึกแบบ append-only

## Requirements
- FR-ANN-01 ระบบต้องให้เจ้าหน้าที่ภาควิชาและผู้ดูแลระบบสร้างประกาศแบบร่างได้ตาม template ที่กำหนด และบันทึกข้อมูลหลักของประกาศ เช่น title, course_id, department_id, quota, description, qualifications, start_date, end_date, required_documents, status <- UC-15 requirement 1
- FR-ANN-02 ระบบต้องตรวจสอบข้อมูลบังคับก่อนเผยแพร่ โดยบังคับให้กรอก title, course_id, quota, start_date, end_date, qualifications, และ required_documents ให้ครบถ้วนก่อนเปลี่ยนสถานะเป็น Published หากข้อมูลไม่ครบจะปฏิเสธการเผยแพร่และระบุข้อมูลที่ขาด <- UC-15 requirement 2
- FR-ANN-03 ระบบต้องบันทึกผู้จัดทำและเวลาเผยแพร่ของประกาศ พร้อมบันทึกประวัติการเปลี่ยนสถานะและการแก้ไขใน audit log แบบ append-only โดยเก็บ action, operator_id, operator_role, timestamp, และ changed_fields <- UC-15 requirement 3

## Quality Requirements
- NFR-AUD-01 ระบบต้องเก็บประวัติการสร้าง/แก้ไข/เผยแพร่ประกาศแบบ immutable ในตาราง announcement_audit_logs โดยมีข้อมูล: announcement_id, action, operator_id, operator_role, timestamp, changed_fields
- NFR-SEC-01 ระบบต้องตรวจสอบสิทธิ์ทุกครั้งก่อนให้จัดทำหรือแก้ไขประกาศ และให้เฉพาะเจ้าหน้าที่ภาควิชาและ Admin ที่สามารถเปลี่ยนสถานะไปสู่ Published

## Acceptance Criteria
- [ ] AC-ANN-01 (FR-ANN-01)
      Given เจ้าหน้าที่ภาควิชา หรือผู้ดูแลระบบมีสิทธิ์ใช้งาน
            When  สร้างประกาศใหม่หรือบันทึกฉบับร่าง
            Then  ระบบอนุญาตให้บันทึกข้อมูลประกาศตาม template และจัดเก็บสถานะเป็น Draft
- [ ] AC-ANN-02 (FR-ANN-02)
      Given ข้อมูลประกาศไม่ครบถ้วนสำหรับการเผยแพร่
            When  ผู้ใช้งานกดเผยแพร่ประกาศ
            Then  ระบบปฏิเสธการเผยแพร่ และแสดงรายการข้อมูลที่ขาด เช่น title, course_id, quota, start_date, end_date, qualifications, required_documents
- [ ] AC-ANN-03 (FR-ANN-03)
      Given ข้อมูลประกาศครบถ้วนและสถานะพร้อมเผยแพร่
            When  ผู้ใช้งานกดเผยแพร่ประกาศ
            Then  ระบบบันทึกผู้จัดทำ ผู้เผยแพร่ เวลาเผยแพร่ และบันทึก audit log แบบ append-only พร้อมข้อมูล action, operator_id, operator_role, timestamp, และ changed_fields

## Assumptions & Open Questions
- ASM-01 รูปแบบประกาศมี template ที่กำหนดไว้ให้ใช้เป็นแหล่งข้อมูลหลัก
- ASM-02 สถานะประกาศมี 4 ระดับมาตรฐาน ได้แก่ Draft, Published, Expired, Archived
- ASM-03 เจ้าหน้าที่ภาควิชาและ Admin มีสิทธิ์เปลี่ยนสถานะจาก Draft เป็น Published ได้ทันที โดยไม่ต้องผ่านผู้อนุมัติกลาง
- ASM-04 นักศึกษาจะมองเห็นเฉพาะประกาศที่มีสถานะ Published เท่านั้น
- Q-01 ไม่จำเป็นต้องมีการอนุมัติกลางก่อนเผยแพร่ เพราะได้ตกลงยืนยันแล้วว่า RBAC ของภาควิชา/ Admin เป็นสิทธิ์ที่ใช้ในการเผยแพร่

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-15 requirement 1 | FR-ANN-01 | AC-ANN-01 |
| UC-15 requirement 2 | FR-ANN-02 | AC-ANN-02 |
| UC-15 requirement 3 | FR-ANN-03 | AC-ANN-03 |
| NFR-AUD-01 | Quality Requirements | AC-ANN-03 |
| NFR-SEC-01 | Quality Requirements | AC-ANN-01 |
