# Feature: จัดทำตารางปฏิบัติงาน
Spec ID: SPEC-09-09- | Source: Use Case Diagram UC-09 | Use case: UC-09
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
อาจารย์จัดสรรวันและช่วงเวลาปฏิบัติงานให้ Lab Boy ตามโควตาและเงื่อนไขของระบบ

## Scope
### In scope
- เลือกผู้ปฏิบัติงาน
- ดูวันและช่วงเวลาที่ใช้ได้
- กำหนดตาราง
- ตรวจสอบความซ้ำซ้อน
- บันทึกตาราง
### Out of scope
- ตรวจสอบวันและเวลาปฏิบัติงาน (UC-19)
- ติดตามและตรวจสอบการจ่ายเงิน (UC-16)

## Constraints
- ห้ามจัดตารางซ้อนกันตามกติกาที่กำหนด
- ต้องไม่เกินโควตาของแต่ละช่วงเวลา

## Requirements
- FR-SCH-01 ระบบต้องแสดงช่วงเวลาที่สามารถจัดตารางได้    <- UC-09 requirement 1
- FR-SCH-02 ระบบต้องตรวจสอบโควตาก่อนบันทึก    <- UC-09 requirement 2
- FR-SCH-03 ระบบต้องป้องกันตารางซ้ำซ้อน    <- UC-09 requirement 3
- FR-SCH-04 เมื่อบันทึกสำเร็จต้องแสดงตารางล่าสุด    <- UC-09 requirement 4

## Quality Requirements
- NFR-REL-01 การตัดโควตาต้องทำแบบ atomic เพื่อป้องกันเกินจำนวน
- NFR-PERF-01 การตรวจสอบตารางควรตอบสนองภายในเวลาที่กำหนด

## Acceptance Criteria
- [ ] AC-SCH-01 (FR-SCH-02)
      Given ช่วงเวลามีโควตาเหลือ 1
            When  จัดตารางให้ 1 คน
            Then  บันทึกสำเร็จและโควตาเหลือ 0
- [ ] AC-SCH-02 (FR-SCH-03)
      Given มีตารางเดิมซ้อนกัน
            When  บันทึกตารางใหม่
            Then  ระบบปฏิเสธและแสดงรายการที่ขัดแย้ง
- [ ] AC-SCH-03 (NFR-REL-01)
      Given มีผู้ใช้แก้โควตาพร้อมกัน
            When  บันทึกตาราง
            Then  โควตาต้องไม่ติดลบหรือเกินจำนวนที่กำหนด

## Assumptions & Open Questions
- ASM-01 โควตาต่อช่วงเวลามีแหล่งข้อมูลที่เชื่อถือได้
- Q-01 อนุญาตให้เปลี่ยนตารางหลังประกาศแล้วถึงเมื่อใด? -> ยืนยันกับผู้รับผิดชอบ

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-09 requirement 1 | FR-SCH-01 | AC-SCH-01 |
| UC-09 requirement 2 | FR-SCH-02 | AC-SCH-02 |
| UC-09 requirement 3 | FR-SCH-03 | AC-SCH-03 |
| UC-09 requirement 4 | FR-SCH-04 |  |
| NFR-REL-01 | Quality Requirements |  |
| NFR-PERF-01 | Quality Requirements |  |
