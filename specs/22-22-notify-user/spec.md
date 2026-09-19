# Feature: แจ้งเตือนผู้ใช้งาน
Spec ID: SPEC-22-22- | Source: Use Case Diagram UC-22 | Use case: UC-22
Owner: ทีม A | Status: Draft v1 | Updated: 2569-09-19

## Goal
ผู้ใช้งานได้รับการแจ้งเตือนเกี่ยวกับสถานะหรือเหตุการณ์ที่เกี่ยวข้องกับตนเอง

## Scope
### In scope
- รับรายการแจ้งเตือนจากระบบ
- เลือกช่องทางที่ผู้ใช้อนุญาต
- ส่งข้อความ
- บันทึกสถานะการแจ้งเตือน
### Out of scope
- ดูสถานะการสมัคร (UC-03)
- กระบวนการที่เกี่ยวข้องกับการแจ้งเตือนอื่น ๆ

## Constraints
- ส่งเฉพาะผู้รับที่มีสิทธิ์และมีข้อมูลช่องทาง
- ข้อความต้องไม่เปิดเผยข้อมูลส่วนบุคคลเกินจำเป็น

## Requirements
- FR-MSG-01 ระบบต้องระบุผู้รับและเหตุการณ์ของการแจ้งเตือน    <- UC-22 requirement 1
- FR-MSG-02 ระบบต้องส่งข้อความผ่านช่องทางที่กำหนด    <- UC-22 requirement 2
- FR-MSG-03 ระบบต้องบันทึกสถานะ sent/failed/queued    <- UC-22 requirement 3

## Quality Requirements
- NFR-REL-02 การแจ้งเตือนที่ล้มเหลวต้องถูก retry ตามนโยบาย
- NFR-SEC-01 เนื้อหาการแจ้งเตือนต้องไม่เปิดเผยข้อมูลอ่อนไหวเกินจำเป็น

## Acceptance Criteria
- [ ] AC-MSG-01 (FR-MSG-02)
      Given มีผู้รับและช่องทางพร้อม
            When  ระบบส่งแจ้งเตือน
            Then  ส่งข้อความสำเร็จและบันทึกสถานะ sent
- [ ] AC-MSG-02 (FR-MSG-03)
      Given ช่องทางส่งไม่พร้อม
            When  ส่งแจ้งเตือน
            Then  บันทึกสถานะ failed/queued ตามนโยบาย
- [ ] AC-MSG-03 (NFR-SEC-01)
      Given ข้อความมีข้อมูลผู้สมัคร
            When  ส่งแจ้งเตือน
            Then  ข้อความไม่เปิดเผยข้อมูลอ่อนไหวเกินความจำเป็น

## Assumptions & Open Questions
- ASM-01 ระบบแจ้งเตือนรองรับช่องทางที่กำหนด
- Q-01 ต้องรองรับ SMS, LINE, Email หรือ notification ในเว็บช่องทางใดบ้าง? -> ยืนยันกับผู้รับผิดชอบ

## Traceability
| SRS / Use Case | spec.md | AC |
|---|---|---|
| UC-22 requirement 1 | FR-MSG-01 | AC-MSG-01 |
| UC-22 requirement 2 | FR-MSG-02 | AC-MSG-02 |
| UC-22 requirement 3 | FR-MSG-03 | AC-MSG-03 |
| NFR-REL-02 | Quality Requirements |  |
| NFR-SEC-01 | Quality Requirements |  |
