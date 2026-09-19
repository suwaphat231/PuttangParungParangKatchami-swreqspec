# Feature: ส่งการแจ้งเตือน
Spec ID: SPEC-20-20- | Source: Use Case Diagram UC-20 | Use case: UC-20
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
ระบบส่งคำขอแจ้งเตือนไปยังระบบแจ้งเตือนเมื่อเกิดเหตุการณ์ที่ต้องแจ้งผู้ใช้งาน

## Scope
### In scope
- สร้าง payload การแจ้งเตือน
- ส่งคำขอแบบ asynchronous
- รับสถานะรับคำขอ
- บันทึกผลการส่ง
### Out of scope
- การแจ้งเตือนผู้ใช้งาน (UC-22)

## Constraints
- การทำธุรกรรมหลักต้องไม่รอผลการส่งข้อความ
- ข้อมูลการแจ้งเตือนต้องไม่เกินสิทธิ์และข้อมูลที่จำเป็น

## Requirements
- FR-NOT-01 ระบบต้องสร้างคำขอแจ้งเตือนจากเหตุการณ์ที่กำหนด    <- UC-20 requirement 1
- FR-NOT-02 ระบบต้องส่งแบบ asynchronous    <- UC-20 requirement 2
- FR-NOT-03 หากส่งไม่สำเร็จต้องบันทึกเพื่อส่งซ้ำตามนโยบาย    <- UC-20 requirement 3

## Quality Requirements
- NFR-REL-02 รายการส่งไม่สำเร็จต้องถูก retry ตามนโยบาย
- NFR-PERF-01 ธุรกรรมหลักไม่ควรรอการส่งข้อความ

## Acceptance Criteria
- [ ] AC-NOT-01 (FR-NOT-02)
      Given เกิดเหตุการณ์ที่ต้องแจ้ง
            When  ระบบส่งคำขอ
            Then  ธุรกรรมหลักดำเนินต่อได้โดยไม่รอผลส่ง
- [ ] AC-NOT-02 (FR-NOT-03)
      Given ระบบแจ้งเตือนไม่พร้อม
            When  ส่งข้อความ
            Then  รายการถูกเก็บเพื่อส่งซ้ำ

## Assumptions & Open Questions
- ASM-01 ระบบแจ้งเตือนรองรับ asynchronous API/queue
- Q-01 retry สูงสุดกี่ครั้งก่อนเปลี่ยนเป็น failed? -> ยืนยันกับผู้ดูแล

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-20 requirement 1 | FR-NOT-01 | AC-NOT-01 |
| UC-20 requirement 2 | FR-NOT-02 | AC-NOT-02 |
| UC-20 requirement 3 | FR-NOT-03 |  |
| NFR-REL-02 | Quality Requirements |  |
| NFR-PERF-01 | Quality Requirements |  |
