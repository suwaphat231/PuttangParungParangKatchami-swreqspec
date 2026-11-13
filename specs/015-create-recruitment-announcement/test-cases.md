# Test cases: จัดทำประกาศรับสมัคร

อ้างอิง: [spec.md](./spec.md) SPEC-15-15- Draft v2
ขอบเขตการทดสอบ: Frontend Prototype ที่ route `/create-announcement` เท่านั้น

## ขอบเขตและสถานะ

- ใช้ Vitest + React Testing Library ทดสอบ React Prototype ด้วย Mock Data และ Local State
- ผล Prototype Test ยืนยันเฉพาะพฤติกรรมที่จำลองบนหน้าจอ ไม่ยืนยัน API, Database, Authentication, RBAC จริง, immutable audit storage หรือ Scheduled Job จริง
- AC-ANN-03 ทดสอบการแสดง Audit Log และการอ่านอย่างเดียวใน UI; ไม่ทดสอบความ immutable ของระบบจัดเก็บจริง
- AC-ANN-04 ทดสอบปุ่มจำลอง Scheduled Job ที่คำนวณเวลา 00:05 Asia/Bangkok; ไม่ทดสอบ job ที่รันอัตโนมัติจริง
- สถานะ `Tested/Passed` หมายถึงรัน Frontend Prototype Test ผ่าน; ไม่ได้หมายถึงทีมอนุมัติหรือระบบจริงผ่าน

| TC ID | AC | แบบ | Given | When | Expected Result | Actual Result | ตรวจด้วย | ชื่อ test | ผล Prototype | สถานะ |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-ANN-01-1 | AC-ANN-01 | ทางปกติ | ผู้ใช้จำลองเป็น Department Staff | กรอกข้อมูลบางส่วนและบันทึกฉบับ Draft | เพิ่มประกาศใน Local State สถานะ Draft โดยไม่บังคับข้อมูลครบ | พบ Draft ใหม่ในรายการและข้อความยืนยันบันทึก Draft | Vitest + React Testing Library | `test_TC_ANN_01_1_department_staff_saves_an_incomplete_draft` | ผ่าน | Tested/Passed |
| TC-ANN-01-2 | AC-ANN-01 | ทางขอบ | ผู้ใช้จำลองเป็น Admin | บันทึก Draft โดยไม่กรอกข้อมูล | เพิ่มประกาศสถานะ Draft และแสดงผู้จัดทำจำลองใน Audit Log | พบ Draft และ operator `admin-01` ใน Mock Audit Log | Vitest + React Testing Library | `test_TC_ANN_01_2_admin_saves_an_incomplete_draft` | ผ่าน | Tested/Passed |
| TC-ANN-01-3 | AC-ANN-01 | ทางผิด | ผู้ใช้จำลองเป็น Student | ตรวจสิทธิ์และมุมมองหน้า | ไม่มีปุ่มสร้าง/บันทึก Draft หรือควบคุม Scheduled Job จำลอง | ไม่พบปุ่มสร้าง, บันทึก Draft หรือรัน Job ในมุมมอง Student | Vitest + React Testing Library | `test_TC_ANN_01_3_student_cannot_create_or_save_a_draft` | ผ่าน | Tested/Passed |
| TC-ANN-01-4 | AC-ANN-01 | ทางผิด | มีประกาศตัวอย่างหลายสถานะ | เปลี่ยน Role เป็น Student | แสดงเฉพาะ Published; ไม่แสดง Draft, Expired, Archived หรือ Audit Log | พบ Published และไม่พบรายการสถานะอื่นหรือ Audit Log | Vitest + React Testing Library | `test_TC_ANN_01_4_student_sees_only_published_announcements` | ผ่าน | Tested/Passed |
| TC-ANN-01-5 | AC-ANN-01 | ทางปกติ | เปิดแอปที่ route `/create-announcement` | โหลดหน้า | แสดงหน้า UC-15 Prototype | พบ heading หน้า UC-15 หลังเปิด route | Vitest + React Testing Library | `test_TC_ANN_01_5_app_route_opens_the_recruitment_announcement_prototype` | ผ่าน | Tested/Passed |
| TC-ANN-02-1 | AC-ANN-02 | ทางปกติ | Draft ใหม่ที่ฟิลด์บังคับทั้ง 7 ยังว่าง | กด Publish | ปฏิเสธและแจ้ง `title`, `course_id`, `quota`, `start_date`, `end_date`, `qualifications`, `required_documents`; สถานะไม่เปลี่ยน | Alert ระบุฟิลด์บังคับครบทั้ง 7 และไม่มีข้อความเผยแพร่สำเร็จ | Vitest + React Testing Library | `test_TC_ANN_02_1_publish_rejects_all_seven_missing_fields` | ผ่าน | Tested/Passed |
| TC-ANN-02-2 | AC-ANN-02 | ทางขอบ | ข้อมูลครบยกเว้น `required_documents` | กด Publish | ปฏิเสธและแจ้งเฉพาะฟิลด์ที่ขาด | Alert ระบุ `required_documents` และไม่ระบุ `course_id` | Vitest + React Testing Library | `test_TC_ANN_02_2_publish_reports_a_single_missing_required_document` | ผ่าน | Tested/Passed |
| TC-ANN-02-3 | AC-ANN-02 | ทางปกติ | Department Staff เลือก Draft และกรอกฟิลด์บังคับครบ | กด Publish | เปลี่ยนเป็น Published พร้อมแสดงผู้เผยแพร่จำลอง | พบข้อความเผยแพร่สำเร็จ, สถานะ Published และ operator ผู้เผยแพร่จำลอง | Vitest + React Testing Library | `test_TC_ANN_02_3_department_staff_publishes_a_complete_draft` | ผ่าน | Tested/Passed |
| TC-ANN-02-4 | AC-ANN-02 | ทางผิด | มี Draft ที่ข้อมูลครบและผู้ใช้เปลี่ยน Role เป็น Student | ทดลองกด Publish | ปฏิเสธ; เมื่อกลับเป็น Admin สถานะประกาศยังเป็น Draft | Alert ปฏิเสธ Student; เปลี่ยนกลับ Admin แล้วยังพบ Draft ไม่ใช่ Published | Vitest + React Testing Library | `test_TC_ANN_02_4_student_publish_attempt_is_rejected_without_changing_draft` | ผ่าน | Tested/Passed |
| TC-ANN-03-1 | AC-ANN-03 | ทางปกติ | Draft ที่สร้างโดย Department Staff มีข้อมูลครบ | Department Staff กด Publish | แสดงผู้จัดทำ ผู้เผยแพร่ เวลา และ Audit Log ที่มี action, operator, role, timestamp, changed_fields | พบผู้เผยแพร่, `PUBLISH`, operator/role, timestamp และ changed fields ใน UI | Vitest + React Testing Library | `test_TC_ANN_03_1_department_staff_publish_shows_creator_publisher_and_audit_fields` | ผ่าน | Tested/Passed |
| TC-ANN-03-2 | AC-ANN-03 | ทางขอบ | Admin เลือก Draft และกรอกข้อมูลครบ | Admin กด Publish | เพิ่ม Audit Log ที่ระบุผู้เผยแพร่และ Role เป็น Admin | พบ `PUBLISH`, operator `admin-01` และ Role `Admin` ใน Mock Audit Log | Vitest + React Testing Library | `test_TC_ANN_03_2_admin_publish_is_recorded_in_the_mock_audit_log` | ผ่าน | Tested/Passed |
| TC-ANN-03-3 | AC-ANN-03 | ทางขอบ | มี Audit Log เดิมของ Draft | แก้ไขและบันทึก Draft | รายการเดิมยังแสดง, มีรายการใหม่ต่อท้าย และไม่มีปุ่มแก้ไข/ลบใน Audit Log UI | พบรายการ CREATE และ UPDATE_DRAFT; ไม่พบปุ่มในส่วน Audit Log | Vitest + React Testing Library | `test_TC_ANN_03_3_audit_log_is_append_only_and_has_no_edit_or_delete_controls` | ผ่าน | Tested/Passed |
| TC-ANN-03-4 | AC-ANN-03 | ทางปกติ | เลือก Draft ที่มี Audit Log สร้างเดิม | แก้ `description` และบันทึก | เพิ่มรายการ UPDATE_DRAFT และระบุ `description` ใน changed_fields | พบ UPDATE_DRAFT และ `description` ใน changed_fields | Vitest + React Testing Library | `test_TC_ANN_03_4_editing_a_draft_appends_changed_fields_to_audit` | ผ่าน | Tested/Passed |
| TC-ANN-04-1 | AC-ANN-04 | ทางปกติ | Published มี end_date แล้ว | จำลอง Scheduled Job วันที่ถัดจาก end_date เวลา 00:05 | เปลี่ยน Published เป็น Expired และเพิ่ม Audit Log ของ SYSTEM | สถานะเปลี่ยนเป็น Expired; พบ EXPIRE, `scheduled-job` และ SYSTEM | Vitest + React Testing Library | `test_TC_ANN_04_1_published_announcement_expires_after_end_date` | ผ่าน | Tested/Passed |
| TC-ANN-04-2 | AC-ANN-04 | ทางขอบ | Published มี end_date เป็นวันจำลองที่เลือก | จำลอง Job เวลา 00:05 ในวัน end_date | คงสถานะ Published เพราะยังไม่สิ้นสุดวัน end_date | สถานะยังเป็น Published ในวัน end_date เวลา 00:05 | Vitest + React Testing Library | `test_TC_ANN_04_2_announcement_remains_published_at_0005_on_end_date` | ผ่าน | Tested/Passed |
| TC-ANN-04-3 | AC-ANN-04 | ทางผิด | Published มี end_date ในอนาคตเมื่อเทียบกับวันจำลอง | จำลอง Scheduled Job เวลา 00:05 | คงสถานะ Published | สถานะยังเป็น Published เมื่อ job date อยู่ก่อน end_date | Vitest + React Testing Library | `test_TC_ANN_04_3_future_end_date_remains_published` | ผ่าน | Tested/Passed |
| TC-ANN-04-4 | AC-ANN-04 | ทางขอบ | Published พ้น end_date แล้ว | จำลอง Job รอบถัดไป 00:05 UTC+7 | เปลี่ยนสถานะเป็น Expired และ timestamp ใน Audit Log ตรงกับเวลา Asia/Bangkok | timestamp ที่แสดงตรงกับ 00:05 Asia/Bangkok ของวันจำลอง | Vitest + React Testing Library | `test_TC_ANN_04_4_expiry_audit_timestamp_uses_bangkok_0005` | ผ่าน | Tested/Passed |
| TC-ANN-04-5 | AC-ANN-04 | ทางผิด | Draft มี end_date ผ่านมาแล้ว | จำลอง Scheduled Job | Draft ยังคงสถานะ Draft | รายการยังแสดงสถานะ Draft หลังจำลอง Job | Vitest + React Testing Library | `test_TC_ANN_04_5_draft_does_not_expire_even_when_end_date_is_past` | ผ่าน | Tested/Passed |
| TC-ANN-04-6 | AC-ANN-04 | ทางขอบ | มีรายการ Expired และ Archived อยู่แล้ว | จำลอง Scheduled Job กับ Published ที่หมดอายุ | สถานะ Expired และ Archived เดิมไม่ถูกเปลี่ยน | รายการตัวอย่างยังคงสถานะ Expired และ Archived ตามเดิม | Vitest + React Testing Library | `test_TC_ANN_04_6_expired_and_archived_records_keep_their_status` | ผ่าน | Tested/Passed |

## การแปลผล

- `ผล Prototype = ผ่าน` ยืนยันเฉพาะ UI/Local State ตาม TC นั้น
- ผล Prototype ไม่ใช้สรุปว่า FR/NFR/AC ของ Backend หรือระบบ Production ผ่าน
- `Tested/Passed` เป็นผลการรัน Frontend Prototype เท่านั้น; ไม่เปลี่ยนสถานะการอนุมัติจากทีม และไม่รับรอง Backend/System Tests
