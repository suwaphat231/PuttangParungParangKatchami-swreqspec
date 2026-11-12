# Test cases: จัดทำประกาศรับสมัคร
อ้างอิง: spec.md SPEC-15-15- Draft v2

คนออกแบบตารางนี้ AI เขียนโค้ด test ตามตารางด้วยคำสั่ง /testcases
- สถานะ: ร่าง (AI เสนอ ยังไม่มีใครตรวจ) / ใช้ได้ (ทีมตรวจแล้ว) / รอ Q-xx
- test ที่มาจากตารางนี้ ห้ามแก้ให้ผ่าน ถ้าไม่ผ่าน ต้องหาว่าโค้ดผิด หรือ AC ผิด (ถ้า AC ผิด แก้ spec ก่อน)

| TC ID | AC | แบบ | Given | When | Then (ตรวจอะไรบ้าง) | ตรวจด้วย | ชื่อ test | สถานะ |
|---|---|---|---|---|---|---|---|---|
| TC-ANN-01-1 | AC-ANN-01 | ทางปกติ | เจ้าหน้าที่ภาควิชามีสิทธิ์ใช้งาน และกรอกข้อมูลประกาศตาม template | กรอกข้อมูลและกดบันทึกฉบับร่าง | ระบบอนุญาตให้บันทึกข้อมูลตาม template และจัดเก็บสถานะเป็น Draft; นักศึกษาเห็นเฉพาะประกาศ Published ตาม ASM-04 | pytest, Vitest + React Testing Library | test_TC_ANN_01_1_department_staff_saves_draft | ร่าง |
| TC-ANN-01-2 | AC-ANN-01 | ทางขอบ | ผู้ดูแลระบบ (Admin) มีสิทธิ์ใช้งาน และกรอกข้อมูลประกาศเพียงบางส่วน | กรอกข้อมูลบางส่วนและกดบันทึกฉบับร่าง | ระบบอนุญาตให้บันทึกข้อมูลฉบับร่างโดยไม่บังคับกรอกทุกฟิลด์ และจัดเก็บสถานะเป็น Draft | pytest, Vitest + React Testing Library | test_TC_ANN_01_2_admin_saves_incomplete_draft | ร่าง |
| TC-ANN-01-3 | AC-ANN-01 | ทางผิด | ผู้ใช้งานไม่มีสิทธิ์ภาควิชาและไม่ใช่ Admin โดยมีข้อมูลประกาศตาม template | พยายามบันทึกฉบับร่าง | ระบบตรวจสอบสิทธิ์ก่อนจัดทำ/แก้ไขและไม่อนุญาตให้บันทึก; รูปแบบการแจ้งผลการปฏิเสธ spec ไม่ได้บอก | pytest, Vitest + React Testing Library | test_TC_ANN_01_3_unauthorized_user_cannot_save_draft | ร่าง |
| TC-ANN-01-4 | AC-ANN-01 | ทางผิด | ผู้ใช้มี role Student และมีประกาศทั้ง Draft และ Published อยู่ในรายการ | เปิดรายการประกาศในมุมมอง Student | Student เห็นประกาศ Published และไม่เห็นประกาศ Draft ตาม ASM-04 | Vitest + React Testing Library | test_TC_ANN_01_4_student_does_not_see_draft | ร่าง |
| TC-ANN-02-1 | AC-ANN-02 | ทางปกติ | ข้อมูลประกาศขาด title, course_id, quota, start_date, end_date, qualifications และ required_documents | ผู้ใช้งานกดเผยแพร่ประกาศ | ระบบปฏิเสธการเผยแพร่ และแสดงรายการข้อมูลที่ขาดทั้ง 7 ฟิลด์ | pytest, Vitest + React Testing Library | test_TC_ANN_02_1_rejects_all_missing_fields | ร่าง |
| TC-ANN-02-2 | AC-ANN-02 | ทางขอบ | ข้อมูลประกาศครบทุกฟิลด์บังคับยกเว้น required_documents | ผู้ใช้งานกดเผยแพร่ประกาศ | ระบบปฏิเสธการเผยแพร่ และแสดง required_documents เป็นข้อมูลที่ขาด | pytest, Vitest + React Testing Library | test_TC_ANN_02_2_rejects_one_missing_field | ร่าง |
| TC-ANN-02-3 | AC-ANN-02 | ทางปกติ | ข้อมูลประกาศครบทุกฟิลด์บังคับและผู้ใช้งานมีสิทธิ์เผยแพร่ | ผู้ใช้งานกดเผยแพร่ประกาศ | ระบบเปลี่ยนสถานะประกาศเป็น Published | pytest, Vitest + React Testing Library | test_TC_ANN_02_3_complete_data_publish_succeeds | ร่าง |
| TC-ANN-02-4 | AC-ANN-02 | ทางผิด | ข้อมูลประกาศครบทุกฟิลด์บังคับและผู้ใช้เป็น Student | ผู้ใช้กดเผยแพร่ประกาศ | ระบบปฏิเสธการเผยแพร่และไม่เปลี่ยนสถานะเป็น Published ตาม NFR-SEC-01; รูปแบบการแจ้งผล spec ไม่ได้บอก | pytest, Vitest + React Testing Library | test_TC_ANN_02_4_student_cannot_publish | ร่าง |
| TC-ANN-03-1 | AC-ANN-03 | ทางปกติ | ประกาศ Draft ถูกสร้างโดยเจ้าหน้าที่ภาควิชาที่มีสิทธิ์ ข้อมูลครบถ้วนและสถานะพร้อมเผยแพร่ | เจ้าหน้าที่กดเผยแพร่ประกาศ | ระบบบันทึกผู้จัดทำ ผู้เผยแพร่ เวลาเผยแพร่ และ audit log แบบ append-only สำหรับการสร้างและเผยแพร่ โดยมี announcement_id, action, operator_id, operator_role, timestamp และ changed_fields | pytest | test_TC_ANN_03_1_department_staff_publish_is_audited | ร่าง |
| TC-ANN-03-2 | AC-ANN-03 | ทางขอบ | ผู้ดูแลระบบ (Admin) มีสิทธิ์เปลี่ยนสถานะได้ทันที ข้อมูลประกาศครบถ้วนและสถานะพร้อมเผยแพร่ | ผู้ใช้งานกดเผยแพร่ประกาศ | ระบบบันทึกผู้จัดทำ ผู้เผยแพร่ เวลาเผยแพร่ และ audit log แบบ append-only ซึ่งมี announcement_id, action, operator_id, operator_role, timestamp และ changed_fields | pytest | test_TC_ANN_03_2_admin_publish_is_audited | ร่าง |
| TC-ANN-03-3 | AC-ANN-03 | ทางขอบ | ประกาศมี audit log เดิมและมีข้อมูลครบถ้วนพร้อมเผยแพร่ | ผู้ใช้งานเผยแพร่ประกาศหรือแก้ไขข้อมูล | ระบบคง audit log เดิมโดยไม่เปลี่ยนแปลง และเพิ่มรายการใหม่แบบ append-only พร้อมฟิลด์ตาม NFR-AUD-01 | pytest | test_TC_ANN_03_3_audit_log_is_append_only | ร่าง |
| TC-ANN-04-1 | AC-ANN-04 | ทางปกติ | ประกาศมีสถานะ Published และเวลาปัจจุบันใน Asia/Bangkok เลย 23:59:59 น. ของ end_date แล้ว | Scheduled Job ทำงานเวลา 00:05 น. Asia/Bangkok | ระบบเปลี่ยนสถานะประกาศเป็น Expired | pytest | test_TC_ANN_04_1_published_announcement_expires_automatically | ร่าง |
| TC-ANN-04-2 | AC-ANN-04 | ทางขอบ | ประกาศมีสถานะ Published และ end_date เป็นวันปัจจุบัน | Scheduled Job ทำงานเวลา 00:05 น. Asia/Bangkok ในวัน end_date | ประกาศยังคงสถานะ Published เพราะยังไม่สิ้นสุดวัน end_date เวลา 23:59:59 น. | pytest | test_TC_ANN_04_2_does_not_expire_before_end_of_day | ร่าง |
| TC-ANN-04-3 | AC-ANN-04 | ทางผิด | ประกาศมีสถานะ Published และยังไม่ถึง end_date | Scheduled Job ทำงานเวลา 00:05 น. Asia/Bangkok | ประกาศยังคงสถานะ Published และไม่เปลี่ยนเป็น Expired ก่อนพ้น end_date | pytest | test_TC_ANN_04_3_future_end_date_remains_published | ร่าง |
| TC-ANN-04-4 | AC-ANN-04 | ทางขอบ | ประกาศมีสถานะ Published และสิ้นสุดวัน end_date เวลา 23:59:59 น. Asia/Bangkok (UTC+7) แล้ว | Scheduled Job ทำงานรอบถัดไปเวลา 00:05 น. Asia/Bangkok (UTC+7) | ระบบเปลี่ยนสถานะประกาศเป็น Expired หลังผ่านเวลา end_date ที่กำหนด | pytest | test_TC_ANN_04_4_expires_on_bangkok_schedule | ร่าง |

## ข้อสังเกตจากการตรวจ Prototype

- UI cases ระบุ Vitest + React Testing Library ตามเครื่องมือที่มี; persistence, audit log และ Scheduled Job ใช้ pytest ตามประเภท behavior และงานใน tasks.md
- `prototype.html` เป็น HTML Prototype ที่มี mock interaction สำหรับ Draft, required-field validation, Publish, Student role guard และ audit log ในหน่วยความจำ; การจำลองนี้ไม่ใช่ persistence หรือ audit log แบบ immutable
- `AnnouncementForm.jsx` แสดงฟอร์มและ checklist ฟิลด์บังคับได้ แต่รับ `missingFields`, `error`, `message` และ callback มาจากภายนอก; ตัว component ไม่คำนวณ validation หรือบันทึกสถานะเอง
- ไม่พบหน้าหรือ caller ของ `AnnouncementForm` ใน `frontend/src`; `App.jsx` ยังไม่ได้ route มาที่ฟอร์มนี้ จึงไม่มี UI flow ปัจจุบันสำหรับยืนยัน Draft/Published
- `prototype.html` เป็น static HTML ไม่ใช่ React page; Vitest/RTL ที่ติดตั้งอยู่ยังไม่ได้เชื่อมกับ mock interaction นี้ และทุกกรณียังเป็นร่าง
- `prototype.html` ไม่กรองรายการ Draft สำหรับ Student และไม่มี Scheduled Job เปลี่ยนเป็น Expired; ส่วน React app ไม่ได้เชื่อม HTML Prototype หรือ mock interaction เหล่านี้
- กรณีที่มีใน mock แต่ยังไม่มีระบบจริงคง expected ตาม requirement และต้องถือเป็น implementation gap ไม่ใช่ปรับ test ให้ผ่าน
- การหมดอายุยึด 23:59:59 น. Asia/Bangkok (UTC+7) และตรวจด้วย Scheduled Job เวลา 00:05 น. ทุกวัน; Scheduler ยังเป็น implementation gap และทุกแถวยังเป็นร่าง
