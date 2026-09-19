# Feature: ส่งผลการปฏิบัติงาน
Spec ID: SPEC-12-12- | Source: Use Case Diagram UC-12 | Use case: UC-12
Owner: ทีม A | Status: Draft v2 | Updated: 2569-09-19

## Goal
อาจารย์ยืนยันและส่งผลการปฏิบัติงานเพื่อเข้าสู่กระบวนการถัดไป

## Scope
### In scope
- ตรวจสอบผลประเมิน
- ยืนยันการส่งผล
- ล็อกผลหลังส่งตามกติกา
### Out of scope
- ติดตามและตรวจสอบการจ่ายเงิน (UC-16)
- ตรวจสอบสถานะผู้ปฏิบัติงาน (UC-13)

## Constraints
- ต้องประเมินครบก่อนส่ง
- เมื่อส่งแล้วต้องไม่แก้ไขโดยไม่มีสิทธิ์

## Requirements
- FR-RES-01 ระบบต้องตรวจสอบว่าข้อมูลประเมินครบก่อนส่ง    <- UC-12 requirement 1
- FR-RES-02 ระบบต้องบันทึกเวลาส่งผล    <- UC-12 requirement 2
- FR-RES-03 ระบบต้องเปลี่ยนสถานะเป็นส่งแล้ว    <- UC-12 requirement 3

## Quality Requirements
- NFR-REL-01 การเปลี่ยนสถานะและบันทึกผลต้องเป็นธุรกรรมเดียวกัน
- NFR-AUD-01 บันทึกผู้ส่งและเวลา

## Acceptance Criteria
- [ ] AC-RES-01 (FR-RES-01)
      Given ประเมินครบทุกคน
            When  ยืนยันส่งผล
            Then  ระบบอนุญาตให้ส่ง
- [ ] AC-RES-02 (FR-RES-02)
      Given ส่งผลสำเร็จ
            When  กลับมาดูข้อมูล
            Then  สถานะเป็นส่งแล้ว
- [ ] AC-RES-03 (NFR-REL-01)
      Given การบันทึกล้มเหลว
            When  ส่งผล
            Then  สถานะต้องไม่เปลี่ยนเป็นส่งแล้ว

## Assumptions & Open Questions
- ASM-01 ขั้นตอนส่งผลถือเป็นจุดสิ้นสุดการแก้ไขตามปกติ
- Q-01 Open Question: ใครสามารถปลดล็อกผลหลังส่งแล้ว? ประเด็นนี้ยังต้องยืนยันกับเจ้าหน้าที่

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-12 requirement 1 | FR-RES-01 | AC-RES-01 |
| UC-12 requirement 2 | FR-RES-02 | AC-RES-02 |
| UC-12 requirement 3 | FR-RES-03 | AC-RES-03 |
| NFR-REL-01 | NFR-REL-01 | AC-RES-03 |
| NFR-AUD-01 | NFR-AUD-01 | — |
