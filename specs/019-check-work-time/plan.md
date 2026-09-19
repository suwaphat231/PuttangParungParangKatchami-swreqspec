# Plan: ตรวจสอบวันและเวลาปฏิบัติงาน

## 1. วัตถุประสงค์
กำหนดแนวทางการพัฒนาและทดสอบฟีเจอร์ตรวจสอบวันและเวลาปฏิบัติงานให้สอดคล้องกับข้อกำหนดใน spec.md โดยยึดหลักดังนี้
- ตรวจสอบช่วงเวลาที่ส่งจาก UC-09
- ดึงข้อมูลปฏิทินการศึกษาและวันหยุดที่มีผลบังคับใช้
- ปฏิเสธการผ่านเมื่อข้อมูลปฏิทินไม่พร้อมใช้งานหรือไม่เป็นปัจจุบัน
- ถ้าช่วงเวลาที่ร้องขอทับซ้อนกับวันหยุดหรือช่วงที่ไม่อนุญาต ให้ Fail ทั้งช่วง
- ส่งผลลัพธ์กลับไปยัง UC-09 ในรูปแบบ JSON

## 2. ขอบเขตงาน
### In scope
- รับ request payload จาก UC-09
- ตรวจสอบค่าเริ่มต้นและสิ้นสุดของช่วงเวลา
- ดึงข้อมูลปฏิทินการศึกษาและวันหยุดที่อัปเดตแล้ว
- ตรวจสอบการทับซ้อนกับวันที่/ช่วงที่ไม่อนุญาต
- ส่ง response JSON พร้อม status, reason และ calendar reference

### Out of scope
- การสร้างตารางงาน (UC-09)
- การแก้ไขปฏิทินการศึกษา (UC-17)
- การกำหนดกฎทางธุรกิจใหม่ที่อยู่นอกขอบเขตของปฏิทินการศึกษา

## 3. กฎทางธุรกิจ
1. ใช้ข้อมูลปฏิทินการศึกษาจากแหล่งข้อมูลที่ยอมรับได้
2. หากข้อมูลปฏิทินหาย/ล้าสมัย/ไม่ถูกต้อง ให้ fail ทันที
3. ใช้ระดับวันเต็ม (full-day) สำหรับวันหยุดและช่วงที่ไม่อนุญาตที่กำหนดในปฏิทิน
4. หากช่วงเวลาที่ร้องขอทับซ้อนกับวันหยุดหรือช่วงที่ไม่อนุญาต แม้เพียงบางส่วน ให้ fail ทั้งช่วง
5. เมื่อมีการอัปเดตข้อมูลแล้ว ให้ถือว่าเป็นปัจจุบันทันที

## 4. ตัวอย่าง payload
```json
{
  "requestId": "CAL-2026-09-19-001",
  "startDate": "2026-09-21T00:00:00",
  "endDate": "2026-09-21T23:59:59",
  "scheduleType": "work"
}
```

## 5. ตัวอย่าง response
```json
{
  "status": "PASS",
  "reason": "Requested period is within approved academic calendar.",
  "calendarVersion": "2026/sem2-v3",
  "effectiveDate": "2026-09-19T10:00:00Z"
}
```

```json
{
  "status": "FAIL",
  "reason": "Requested period overlaps with blocked academic calendar date.",
  "calendarVersion": "2026/sem2-v3",
  "effectiveDate": "2026-09-19T10:00:00Z"
}
```

## 6. ขั้นตอนการพัฒนา
### Phase 1: สร้าง interface และ validation
- รับ request payload จาก UC-09
- Validate required fields: startDate, endDate
- Reject request if missing or invalid data

### Phase 2: ดึงข้อมูลปฏิทิน
- เรียกข้อมูลปฏิทินการศึกษาจากแหล่งที่ถูกต้อง
- ตรวจสอบความพร้อมใช้งานและ freshness
- หากข้อมูลไม่พร้อม ให้ response FAIL

### Phase 3: ตรวจสอบการทับซ้อน
- เปรียบเทียบ request period กับ blocked dates
- หาก overlap เกิดขึ้น ให้ fail และระบุเหตุผล
- หากไม่มี overlap ให้ pass

### Phase 4: ส่งผลลัพธ์
- ส่ง JSON response กลับไปยัง UC-09
- รวม status, reason และ calendar reference

## 7. Acceptance validation
- AC-CAL-01: รับข้อมูลวันเริ่มต้นและสิ้นสุดจาก UC-09 สำเร็จ
- AC-CAL-02: ทับซ้อนกับวันหยุดหรือช่วงที่ไม่อนุญาต -> FAIL
- AC-CAL-03: ข้อมูลปฏิทินไม่พร้อมใช้งาน -> FAIL
- AC-CAL-04: ช่วงที่อนุญาต -> PASS
- AC-CAL-05: response ต้องมี status, reason และ calendar reference

## 8. Risks / concerns
- ข้อมูลปฏิทินอาจมี delay หรือ source mismatch
- ต้องกำหนดแนวทาง exact overlap logic ให้ชัดเจน
- ต้องมั่นใจว่า response format สอดคล้องกับ UC-09

## 9. Deliverables
- Updated requirement spec: spec.md
- Implementation plan: plan.md
- API contract / response schema for JSON response
- Test cases สำหรับ pass/fail scenarios
