# RTM: ตรวจสอบวันและเวลาปฏิบัติงาน
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2026-11-13 14:12 UTC | backend: 81 ผ่าน, 0 ไม่ผ่าน | frontend: feature-focused 9 ผ่าน, 0 ไม่ผ่าน; full suite still fails in unrelated ApplyLabBoy tests

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-CAL-01 | AC-CAL-01 | T-01, T-05, T-06, T-07 | [calendar_check_request.py](../../backend/app/schemas/calendar_check_request.py): `CalendarCheckRequest`; [router.py](../../backend/app/router.py): `check_work_time`; [CheckWorkTimePage.jsx](../../frontend/src/pages/CheckWorkTimePage.jsx): `handleSubmit` | `test_AC_CAL_01_accepts_start_and_end_dates`, `test_AC_CAL_01_rejects_missing_or_malformed_dates`, `test_AC_CAL_01_endpoint_accepts_and_processes_requested_period`, `test_AC_CAL_01_posts_the_requested_start_and_end_to_the_calendar_API` (ผ่าน) | ครบ |
| FR-CAL-02 | AC-CAL-03 | T-02, T-07 | [calendar_source.py](../../backend/app/services/calendar_source.py): `load_calendar_snapshot`, `_load_public_holidays` | `test_T02_loads_current_calendar_sources_for_each_requested_year` (ผ่าน) | ครบ |
| FR-CAL-03 | AC-CAL-02, AC-CAL-04 | T-03, T-07 | [calendar_overlap_service.py](../../backend/app/services/calendar_overlap_service.py): `check_calendar_overlap` | `test_AC_CAL_02_fails_on_partial_overlap_with_academic_period`, `test_AC_CAL_02_fails_for_a_part_day_public_holiday_overlap`, `test_AC_CAL_02_passes_when_request_does_not_overlap_blocked_periods`, `test_AC_CAL_04_returns_pass_response_with_calendar_reference` (ผ่าน) | ครบ |
| FR-CAL-04 | AC-CAL-03 | T-02, T-07 | [calendar_source.py](../../backend/app/services/calendar_source.py): `CalendarSourceUnavailable`, `load_calendar_snapshot`; [router.py](../../backend/app/router.py): `check_work_time` | `test_AC_CAL_03_rejects_unavailable_public_holiday_source`, `test_AC_CAL_03_rejects_unverified_public_holiday_data`, `test_AC_CAL_03_rejects_dates_without_an_available_academic_calendar`, `test_T05_calendar_endpoint_returns_fail_when_source_is_unavailable` (ผ่าน) | ครบ |
| FR-CAL-05 | AC-CAL-04, AC-CAL-05 | T-04, T-05, T-07 | [calendar_check_service.py](../../backend/app/services/calendar_check_service.py): `CalendarCheckResponse`, `build_calendar_check_response`; [router.py](../../backend/app/router.py): `check_work_time` | `test_AC_CAL_04_returns_pass_response_with_calendar_reference`, `test_AC_CAL_05_serializes_fail_response_using_json_contract`, `test_T05_calendar_endpoint_returns_response_json`, `test_AC_CAL_05_displays_the_status_reason_and_calendar_reference` (ผ่าน) | ครบ |
| NFR-REL-01 | AC-CAL-03 | T-02, T-03, T-07 | [calendar_source.py](../../backend/app/services/calendar_source.py): `load_calendar_snapshot`; [calendar_overlap_service.py](../../backend/app/services/calendar_overlap_service.py): `check_calendar_overlap` | `test_AC_CAL_03_rejects_unverified_public_holiday_data`, `test_AC_CAL_02_fails_on_partial_overlap_with_academic_period` (ผ่าน) | ครบ |
| NFR-PERF-01 | ไม่มี AC | T-07 | ไม่มี benchmark หรือ timer ที่ traceable กับ spec | ไม่มี test หรือโค้ดที่ตรวจว่าตอบกลับภายในเกณฑ์ธุรกิจ; status เป็น ยังไม่ถึง | ยังไม่ถึง |
| NFR-INT-01 | AC-CAL-05 | T-04, T-05, T-06, T-07 | [calendar_check_service.py](../../backend/app/services/calendar_check_service.py): `CalendarCheckResponse`; [calendarCheckApi.js](../../frontend/src/api/calendarCheckApi.js): `checkCalendarPeriod`; [CheckWorkTimePage.jsx](../../frontend/src/pages/CheckWorkTimePage.jsx): render result | `test_AC_CAL_05_serializes_fail_response_using_json_contract`, `test_AC_CAL_05_displays_the_status_reason_and_calendar_reference`, `test_T07_routes_to_the_calendar_check_page` (ผ่าน) | ครบ |
| Constraint: ปฏิทินการศึกษาที่ใช้ในการตรวจสอบต้องเป็นข้อมูลที่ระบบยอมรับและมีความสดใหม่ตามข้อกำหนด | AC-CAL-03 | T-02 | [calendar_source.py](../../backend/app/services/calendar_source.py): `load_calendar_snapshot` | `test_T02_loads_current_calendar_sources_for_each_requested_year`, `test_AC_CAL_03_rejects_unverified_public_holiday_data` (ผ่าน) | ครบ |
| Constraint: หากระบบไม่สามารถเรียกข้อมูลปฏิทินหรือข้อมูลไม่ครบถ้วน ไม่ว่าจะเป็นข้อมูลล้าสมัย หรือข้อมูลไม่พร้อมใช้งาน ต้องไม่ถือว่าผ่าน | AC-CAL-03 | T-02 | [router.py](../../backend/app/router.py): `check_work_time` | `test_T05_calendar_endpoint_returns_fail_when_source_is_unavailable` (ผ่าน) | ครบ |
| Constraint: การตรวจสอบต้องพิจารณาว่าช่วงเวลาที่ขอมีการทับซ้อนกับช่วงเวลาที่ห้ามปฏิบัติงานหรือไม่ | AC-CAL-02, AC-CAL-04 | T-03 | [calendar_overlap_service.py](../../backend/app/services/calendar_overlap_service.py): `check_calendar_overlap` | `test_AC_CAL_02_fails_on_partial_overlap_with_academic_period`, `test_AC_CAL_02_fails_for_a_part_day_public_holiday_overlap`, `test_AC_CAL_02_passes_when_request_does_not_overlap_blocked_periods` (ผ่าน) | ครบ |
| Constraint: ผลลัพธ์ของการตรวจสอบต้องมีสถานะเป็น Pass หรือ Fail และมีเหตุผลที่ชัดเจน | AC-CAL-02, AC-CAL-04, AC-CAL-05 | T-04, T-05, T-06, T-07 | [calendar_check_service.py](../../backend/app/services/calendar_check_service.py): `build_calendar_check_response`; [CheckWorkTimePage.jsx](../../frontend/src/pages/CheckWorkTimePage.jsx): result card | `test_AC_CAL_04_returns_pass_response_with_calendar_reference`, `test_AC_CAL_05_serializes_fail_response_using_json_contract`, `test_AC_CAL_05_displays_the_status_reason_and_calendar_reference` (ผ่าน) | ครบ |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| [CalendarCheckRequest](../../backend/app/schemas/calendar_check_request.py) | FR-CAL-01 | ตรง | รับ `startDate`/`endDate` และ validate ด้วย Pydantic |
| [POST /calendar/check](../../backend/app/router.py): `check_work_time` | FR-CAL-01, FR-CAL-04, FR-CAL-05, NFR-INT-01 | ตรง | ส่งผล FAIL เมื่อ source unavailable และ JSON response สอดคล้องกับสัญญา |
| [calendar_source.py](../../backend/app/services/calendar_source.py): `load_calendar_snapshot`, `_load_public_holidays` | FR-CAL-02, FR-CAL-04, NFR-REL-01 | ตรง | ดึง holiday data และ academic periods แล้วปฏิเสธเมื่อข้อมูลไม่พร้อม/ไม่ถูกต้อง |
| [calendar_overlap_service.py](../../backend/app/services/calendar_overlap_service.py): `check_calendar_overlap` | FR-CAL-03 | ตรง | ตรวจ overlap แบบ inclusive ระดับวันและ fail เมื่อทับซ้อนแม้บางส่วน |
| [calendar_check_service.py](../../backend/app/services/calendar_check_service.py): `build_calendar_check_response` | FR-CAL-05, NFR-INT-01 | ตรง | สร้าง response ที่มี `status`, `reason`, `calendarVersion`, `effectiveDate` |
| [calendarCheckApi.js](../../frontend/src/api/calendarCheckApi.js): `checkCalendarPeriod` | FR-CAL-01, FR-CAL-05, NFR-INT-01 | ตรง | POST JSON และแปลง error ตาม HTTP status |
| [CheckWorkTimePage.jsx](../../frontend/src/pages/CheckWorkTimePage.jsx): `CheckWorkTimePage`, `handleSubmit` | FR-CAL-01, FR-CAL-05, NFR-INT-01 | ตรง | รับข้อมูลจาก input และแสดงผลให้ผู้ใช้เห็น |
| [App.jsx](../../frontend/src/App.jsx): route `/calendar` | FR-CAL-01, FR-CAL-05 | ตรง | เปิดหน้า UC-19 ตามวิธีที่ถูกต้อง |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | ตัวเลขไม่ตรง spec | NFR-PERF-01 | NFR-PERF-01 | Spec ระบุว่าต้องตอบสนองภายในเวลาที่กำหนด แต่ไม่ได้ระบุ threshold จริงหรือวิธีวัด; โค้ดและ test ของ feature นี้ยังไม่มี benchmark ที่ traceable กับ spec จึงยังไม่สามารถยืนยันว่าครบตาม NFR นี้ | |

## 4. แก้แล้ว
ไม่มี
