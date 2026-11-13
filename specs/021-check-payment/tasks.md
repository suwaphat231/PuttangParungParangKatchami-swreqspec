# Tasks Breakdown: ตรวจสอบการจ่ายเงิน
Feature: ตรวจสอบการจ่ายเงิน
Spec ID: SPEC-21-21- / UC-21
อ้างอิง plan.md: [specs/021-check-payment/plan.md](specs/021-check-payment/plan.md)
วันที่: 2026-10-03

สรุป:
- ทำทั้งหมด 7 task
- มี task ที่ต้องรอ Open Questions: 0 task

> ข้อยืนยันจากทีม: Q-01 ถึง Q-03 ได้รับคำตอบแล้ว ดังนี้
> - Q-01: paid, pending, failed, cancelled, refunded จะถูกแมปเป็นสถานะเดียวกันใน LAB BOY; ถ้าค่าที่รับเข้ามาไม่รู้จัก ให้ reject + audit
> - Q-02 และ Q-03: ใช้ timestamp เป็นหลัก; ถ้ามี event_id/sequence_number ให้ใช้ตรวจ duplicate เพิ่ม; timestamp ที่เก่ากว่าให้ถือว่า stale และไม่ update

### T-01 สร้าง model และ lookup reference สำหรับ payment record
- รองรับ: FR-FIN-01, NFR-REL-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-01
- ไฟล์ที่แตะ: `backend/app/payment_service.py`, `backend/app/router.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: ระบบสามารถระบุตัวตน payment record ด้วย reference ที่ตรงกับข้อมูลภายใน LAB BOY และเตรียมข้อมูลพื้นฐานสำหรับ validation, duplicate handling, และ audit ได้
- สถานะ: พร้อมทำ

### T-02 ตรวจสอบ payload จากระบบการเงินและ field ที่จำเป็น
- รองรับ: FR-FIN-02, NFR-SEC-01
- ตรวจด้วย: AC-FIN-02
- ไฟล์ที่แตะ: `backend/app/payment_service.py`, `backend/app/router.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ระบบใช้ timestamp เป็นข้อมูลหลักในการระบุความทันสมัยของ callback/response, ตรวจ duplicate เมื่อมี event_id หรือ sequence_number, และปฏิเสธ payload ที่ขาดค่า critical fields หรือมี timestamp เก่ากว่าอัปเดตล่าสุด
- สถานะ: พร้อมทำ

### T-03 ป้องกัน duplicate callback และ stale update ให้ idempotent
- รองรับ: FR-FIN-03, NFR-REL-01
- ตรวจด้วย: AC-FIN-01
- ไฟล์ที่แตะ: `backend/app/payment_service.py`, `backend/tests/test_track_payment.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: callback ซ้ำหรือข้อมูลเก่าที่ส่งซ้ำไม่สร้าง payment record ใหม่ ไม่ให้ข้อมูลเก่าทับข้อมูลล่าสุด และใช้ event_id/sequence_number เป็นข้อมูลเสริมในการตรวจ duplicate เมื่อมีให้ใช้
- สถานะ: พร้อมทำ

### T-04 ปฏิเสธ mismatch และบันทึกเหตุผลการปฏิเสธเพื่อ audit
- รองรับ: FR-FIN-04, NFR-SEC-01
- ตรวจด้วย: AC-FIN-03
- ไฟล์ที่แตะ: `backend/app/payment_service.py`, `backend/app/router.py`, `backend/tests/test_track_payment.py`
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: เมื่อ reference หรือ amount ไม่ตรงหรือ timestamp เก่ากว่า/ stale หรือข้อมูลไม่สอดคล้อง ระบบปฏิเสธการอัปเดต ไม่แก้ไขสถานะเดิม และบันทึก mismatch reason สำหรับการตรวจสอบภายหลัง
- สถานะ: พร้อมทำ

### T-05 แมปสถานะจากระบบการเงินเป็นสถานะภายใน LAB BOY และอัปเดตเมื่อถูกต้อง
- รองรับ: FR-FIN-02, FR-FIN-03, NFR-REL-01
- ตรวจด้วย: AC-FIN-02
- ไฟล์ที่แตะ: `backend/app/payment_service.py`, `backend/app/router.py`
- ต้องทำหลัง: T-01, T-02, T-03
- เสร็จเมื่อ: paid, pending, failed, cancelled, refunded ถูกแมปเป็นสถานะเดียวกันใน LAB BOY ตามคำยืนยันทีม และค่าที่ไม่รู้จักจะถูก reject แล้วบันทึก audit event โดยไม่อัปเดตสถานะเดิม
- สถานะ: พร้อมทำ

### T-06 สร้าง contract API สำหรับ callback, lookup, และผลลัพธ์ของการปฏิเสธ
- รองรับ: FR-FIN-01, FR-FIN-02, FR-FIN-03, FR-FIN-04
- ตรวจด้วย: AC-FIN-02, AC-FIN-03
- ไฟล์ที่แตะ: `backend/app/router.py`, `backend/app/payment_service.py`
- ต้องทำหลัง: T-02, T-03, T-04, T-05
- เสร็จเมื่อ: API รองรับการรับ callback/response จากระบบการเงิน, ค้นหารายการตาม reference, ส่งคืนสถานะผลการประมวลผล, และแสดงสาเหตุการปฏิเสธเมื่อ mismatch, unknown status, หรือ stale timestamp
- สถานะ: พร้อมทำ

### T-07 ทดสอบยอมรับสำหรับ duplicate, paid, และ mismatch
- รองรับ: FR-FIN-01, FR-FIN-02, FR-FIN-03, FR-FIN-04, NFR-REL-01, NFR-SEC-01
- ตรวจด้วย: AC-FIN-01, AC-FIN-02, AC-FIN-03
- ไฟล์ที่แตะ: `backend/tests/test_track_payment.py`
- ต้องทำหลัง: T-03, T-04, T-05, T-06
- เสร็จเมื่อ: test_AC_Fin_01, test_AC_Fin_02, test_AC_Fin_03 ผ่านและครอบคลุม duplicate callback, status mapping, stale timestamp rejection, unknown status rejection, และ mismatch rejection ตามข้อกำหนด
- สถานะ: พร้อมทำ

## ตารางตรวจความครบ

### 1) AC ID | task ที่ตรวจ AC นี้
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-FIN-01 | T-03, T-07 |
| AC-FIN-02 | T-02, T-05, T-06, T-07 |
| AC-FIN-03 | T-04, T-06, T-07 |

### 2) Constraint / Requirement ที่มีลักษณะเป็นข้อจำกัด | task ที่ทำให้เป็นจริง
| Constraint / Requirement | task ที่ทำให้เป็นจริง |
|---|---|
| reference เป็นคีย์หลักสำหรับการเชื่อมรายการระหว่าง LAB BOY กับระบบการเงิน | T-01, T-02, T-06 |
| การอัปเดตสถานะต้อง idempotent และไม่สร้างข้อมูลซ้ำ | T-03, T-05, T-07 |
| การอัปเดตต้องปฏิเสธเมื่อ reference หรือ amount ไม่ตรงและไม่แก้ไขสถานะเดิม | T-04, T-06, T-07 |
| ระบบการเงินเป็นแหล่งข้อมูลที่เชื่อถือได้และต้องใช้การส่งข้อมูลที่เข้ารหัส | T-02, T-04, T-06 |
| ข้อมูล mismatch ต้องถูกบันทึกใน audit log เพื่อใช้ตรวจสอบต่อไป | T-04, T-06, T-07 |

## สิ่งที่ยังไม่ทำ
- Q-01: paid, pending, failed, cancelled, refunded จะถูกแมปเป็นสถานะเดียวกันใน LAB BOY; status ที่ไม่รู้จัก → reject + audit
  - task ที่เกี่ยวข้อง: T-05
- Q-02 และ Q-03: ใช้ timestamp เป็นหลัก; ถ้ามี event_id/sequence_number ให้ใช้ตรวจ duplicate เพิ่ม; timestamp เก่ากว่า → stale ไม่ update
  - task ที่เกี่ยวข้อง: T-02, T-03, T-04
