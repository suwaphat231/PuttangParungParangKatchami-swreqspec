# Feature: ตรวจสอบวันและเวลาปฏิบัติงาน
Spec ID: SPEC-19-19- | Source: Use Case Diagram UC-19 | Use case: UC-19
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
ระบบตรวจสอบวันและเวลาปฏิบัติงานกับข้อมูลปฏิทินการศึกษาเพื่อป้องกันการจัดตารางที่ขัดแย้ง

## Scope
### In scope
- รับวัน/เวลาที่ต้องการตรวจสอบ
- เรียกข้อมูลปฏิทินการศึกษา
- เปรียบเทียบเงื่อนไข
- ส่งผลการตรวจสอบกลับ
### Out of scope
- จัดทำตารางปฏิบัติงาน (UC-09)

## Constraints
- ปฏิทินการศึกษาต้องเป็นข้อมูลล่าสุดที่ระบบกำหนด
- หากตรวจสอบไม่ได้ต้องไม่ถือว่าผ่าน

## Requirements
- FR-CAL-01 ระบบต้องส่งวันและเวลาที่ต้องการตรวจสอบ    <- UC-19 requirement 1
- FR-CAL-02 ระบบต้องตรวจสอบวันหยุด/ช่วงเวลาที่ไม่อนุญาต    <- UC-19 requirement 2
- FR-CAL-03 ระบบต้องส่งผลผ่าน/ไม่ผ่านกลับไปยัง UC-09    <- UC-19 requirement 3

## Quality Requirements
- NFR-REL-01 ห้ามใช้ข้อมูลปฏิทินที่ไม่ทราบความสดใหม่เป็นผลผ่าน
- NFR-PERF-01 การตรวจสอบควรตอบสนองภายในเวลาที่กำหนด

## Acceptance Criteria
- [ ] AC-CAL-01 (FR-CAL-02)
      Given วันดังกล่าวเป็นวันหยุดที่ไม่อนุญาต
            When  ตรวจสอบ
            Then  ผลเป็นไม่ผ่านและระบุเหตุผล
- [ ] AC-CAL-02 (FR-CAL-03)
      Given วันเวลาเป็นช่วงที่อนุญาต
            When  ตรวจสอบ
            Then  ส่งผลผ่านกลับไปยังการจัดตาราง

## Assumptions & Open Questions
- ASM-01 ระบบปฏิทินการศึกษามี API/ข้อมูลที่ใช้งานได้
- Q-01 วันหยุดพิเศษที่ประกาศภายหลังอัปเดตเข้าสู่ระบบภายในกี่นาที? -> ยืนยันกับผู้ดูแล

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-19 requirement 1 | FR-CAL-01 | AC-CAL-01 |
| UC-19 requirement 2 | FR-CAL-02 | AC-CAL-02 |
| UC-19 requirement 3 | FR-CAL-03 |  |
| NFR-REL-01 | Quality Requirements |  |
| NFR-PERF-01 | Quality Requirements |  |
