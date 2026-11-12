# RTM: ตรวจสอบวันและเวลาปฏิบัติงาน
อ้างอิง: [spec.md](./spec.md) Draft v2 | [tasks.md](./tasks.md) | ไม่มี `test-cases.md`
สร้างด้วย /verify เมื่อ 2026-11-12 18:22 UTC | backend: 81 ผ่าน | frontend: 24 ผ่าน, 6 ไม่ผ่าน, 1 todo

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-CAL-01 | AC-CAL-01 | T-01, T-05, T-06, T-07 | [calendar_check_request.py](../../backend/app/schemas/calendar_check_request.py): `CalendarCheckRequest`; [router.py](../../backend/app/router.py): `check_work_time`; [CheckWorkTimePage.jsx](../../frontend/src/pages/CheckWorkTimePage.jsx): `handleSubmit` | `test_AC_CAL_01_accepts_start_and_end_dates`, `test_AC_CAL_01_endpoint_accepts_and_processes_requested_period`, `test_AC_CAL_01_posts_the_requested_start_and_end_to_the_calendar_API` (ผ่าน) | ครบ |
| FR-CAL-02 | AC-CAL-02, AC-CAL-03 | T-02, T-07 | [calendar_source.py](../../backend/app/services/calendar_source.py): `_ACADEMIC_PERIODS`, `load_calendar_snapshot`, `_load_public_holidays` | `test_T02_loads_current_calendar_sources_for_each_requested_year`, `test_AC_CAL_03_rejects_unverified_public_holiday_data` (ผ่าน; ไม่มีการตรวจว่า PDF ถูกแทนที่ด้วยฉบับใหม่หรือไม่) | ช่องโหว่ |
| FR-CAL-03 | AC-CAL-02, AC-CAL-04 | T-03, T-07 | [calendar_overlap_service.py](../../backend/app/services/calendar_overlap_service.py): `check_calendar_overlap` | `test_AC_CAL_02_fails_on_partial_overlap_with_academic_period`, `test_AC_CAL_02_fails_for_a_part_day_public_holiday_overlap`, `test_AC_CAL_04_endpoint_returns_pass_for_an_allowed_period` (ผ่าน) | ครบ |
| FR-CAL-04 | AC-CAL-03 | T-02, T-07 | [calendar_source.py](../../backend/app/services/calendar_source.py): `_load_public_holidays`, `load_calendar_snapshot`; [router.py](../../backend/app/router.py): `check_work_time` | `test_AC_CAL_03_rejects_unavailable_public_holiday_source`, `test_AC_CAL_03_rejects_unverified_public_holiday_data`, `test_AC_CAL_03_rejects_dates_without_an_available_academic_calendar`, `test_AC_CAL_03_endpoint_never_passes_when_calendar_source_is_unavailable` (ผ่าน; ครอบคลุม unavailable/invalid แต่ไม่ครอบคลุม PDF ฉบับเก่าที่ถูกแทนที่) | ช่องโหว่ |
| FR-CAL-05 | AC-CAL-04, AC-CAL-05 | T-04, T-05, T-07 | [calendar_check_service.py](../../backend/app/services/calendar_check_service.py): `build_calendar_check_response`; [router.py](../../backend/app/router.py): `_calendar_source_failure_response`, `check_work_time` | `test_AC_CAL_04_returns_pass_response_with_calendar_reference`, `test_AC_CAL_05_serializes_fail_response_using_json_contract`, `test_AC_CAL_05_endpoint_returns_the_json_contract` (ผ่าน; failure เมื่อไม่มี snapshot คืนเวลา attempt เป็น calendar reference) | ช่องโหว่ |
| NFR-REL-01 | AC-CAL-03 | T-02, T-03, T-07 | [calendar_source.py](../../backend/app/services/calendar_source.py): `load_calendar_snapshot`, `_load_public_holidays`; [router.py](../../backend/app/router.py): `_calendar_source_failure_response` | `test_AC_CAL_03_rejects_unverified_public_holiday_data`, `test_AC_CAL_03_endpoint_never_passes_when_calendar_source_is_unavailable` (ผ่าน; ยังยืนยัน freshness ของ PDF ไม่ได้) | ช่องโหว่ |
| NFR-PERF-01 | ไม่มี AC | T-07 | [test_check_work_time.py](../../backend/tests/test_check_work_time.py): `test_NFR_PERF_01_live_calendar_check_completes_within_500ms` | backend ทั้งชุดผ่าน รวม live benchmark 3 ครั้ง; test ใช้เพดาน 500 ms ซึ่งไม่มีใน spec | ช่องโหว่ |
| NFR-INT-01 | AC-CAL-05 | T-04, T-05, T-06, T-07 | [calendar_check_service.py](../../backend/app/services/calendar_check_service.py): `CalendarCheckResponse`, `build_calendar_check_response`; [calendarCheckApi.js](../../frontend/src/api/calendarCheckApi.js): `checkCalendarPeriod`; [CheckWorkTimePage.jsx](../../frontend/src/pages/CheckWorkTimePage.jsx): render response | `test_AC_CAL_05_serializes_fail_response_using_json_contract`, `test_AC_CAL_05_endpoint_returns_the_json_contract`, `test_AC_CAL_05_displays_the_status_reason_and_calendar_reference` (ผ่าน; ค่าอ้างอิงตอน source unavailable ไม่ใช่ snapshot) | ช่องโหว่ |
| Constraint: ปฏิทินการศึกษาที่ใช้ในการตรวจสอบต้องเป็นข้อมูลที่ระบบยอมรับและมีความสดใหม่ตามข้อกำหนด | AC-CAL-02, AC-CAL-03 | T-02, T-07 | [calendar_source.py](../../backend/app/services/calendar_source.py): แหล่งวันหยุด live และช่วงมหาวิทยาลัยแบบ hardcode | `test_T02_loads_current_calendar_sources_for_each_requested_year`, `test_AC_CAL_03_rejects_unverified_public_holiday_data` (ผ่านเฉพาะวันหยุดไทยและการมี academic periods) | ช่องโหว่ |
| Constraint: หากระบบไม่สามารถเรียกข้อมูลปฏิทินหรือข้อมูลไม่ครบถ้วน ไม่ว่าจะเป็นข้อมูลล้าสมัย หรือข้อมูลไม่พร้อมใช้งาน ต้องไม่ถือว่าผ่าน | AC-CAL-03 | T-02, T-07 | [router.py](../../backend/app/router.py): `check_work_time`; [calendar_source.py](../../backend/app/services/calendar_source.py): `CalendarSourceUnavailable` | `test_AC_CAL_03_endpoint_never_passes_when_calendar_source_is_unavailable` (ผ่าน; stale PDF ที่ถูกแทนที่ยังตรวจไม่พบ) | ช่องโหว่ |
| Constraint: การตรวจสอบต้องพิจารณาว่าช่วงเวลาที่ขอมีการทับซ้อนกับช่วงเวลาที่ห้ามปฏิบัติงานหรือไม่ | AC-CAL-02, AC-CAL-04 | T-03, T-07 | [calendar_overlap_service.py](../../backend/app/services/calendar_overlap_service.py): `check_calendar_overlap` | `test_AC_CAL_02_fails_on_partial_overlap_with_academic_period`, `test_AC_CAL_02_fails_for_a_part_day_public_holiday_overlap` (ผ่าน) | ครบ |
| Constraint: ผลลัพธ์ของการตรวจสอบต้องมีสถานะเป็น Pass หรือ Fail และมีเหตุผลที่ชัดเจน | AC-CAL-02, AC-CAL-03, AC-CAL-04, AC-CAL-05 | T-03 ถึง T-07 | [calendar_check_service.py](../../backend/app/services/calendar_check_service.py): `CalendarCheckResponse`, `build_calendar_check_response`; [CheckWorkTimePage.jsx](../../frontend/src/pages/CheckWorkTimePage.jsx): แสดงผล | tests ของ AC-CAL-02 ถึง AC-CAL-05 ใน backend และ frontend (ผ่าน) | ครบ |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| [CalendarCheckRequest](../../backend/app/schemas/calendar_check_request.py) | FR-CAL-01 | ตรงบางส่วน | รับ `startDate`/`endDate` เป็น datetime; ไม่รับ field แยกสำหรับช่วงเวลาปฏิบัติงาน |
| [POST /calendar/check](../../backend/app/router.py): `check_work_time` | FR-CAL-01, FR-CAL-04, FR-CAL-05, NFR-INT-01 | ตรงบางส่วน | source failure คืน FAIL แต่ metadata ของ failure ใช้เวลา attempt แทนเวลาของ snapshot |
| [calendar_source.py](../../backend/app/services/calendar_source.py): `load_calendar_snapshot`, `_load_public_holidays` | FR-CAL-02, FR-CAL-04, NFR-REL-01 | ตรงบางส่วน | วันหยุดไทยดึง live และ validate; academic periods เป็นค่าคงที่ ไม่มีการตรวจ PDF ฉบับล่าสุด |
| [calendar_overlap_service.py](../../backend/app/services/calendar_overlap_service.py): `check_calendar_overlap` | FR-CAL-03 | ตรง | เปรียบเทียบช่วง request กับ blocked periods แบบ inclusive ระดับวัน ตาม Q-01/Q-02 |
| [calendar_check_service.py](../../backend/app/services/calendar_check_service.py): `build_calendar_check_response` | FR-CAL-05, NFR-INT-01 | ตรงบางส่วน | PASS/FAIL response มี reason และ reference; fallback เมื่อไม่มี snapshot ใช้ timestamp ของ attempt |
| [calendarCheckApi.js](../../frontend/src/api/calendarCheckApi.js): `checkCalendarPeriod` | FR-CAL-01, FR-CAL-05, NFR-INT-01 | ตรง | ส่ง POST JSON และแจ้ง HTTP/empty/non-JSON error |
| [CheckWorkTimePage.jsx](../../frontend/src/pages/CheckWorkTimePage.jsx): `CheckWorkTimePage`, `handleSubmit` | FR-CAL-01, FR-CAL-05, NFR-INT-01 | ตรง | รับช่วงวันเวลาและแสดง status, reason, calendarVersion, effectiveDate |
| [App.jsx](../../frontend/src/App.jsx): route `/calendar/check` | FR-CAL-01, FR-CAL-05 | ตรง | เปิดหน้า UC-19; ไม่สร้างตารางงานหรือแก้ปฏิทิน |

โค้ดส่วนอื่นใน `backend/app/` และ `frontend/src/` เป็นฟีเจอร์อื่นที่ระบุ FR ของตนเอง ไม่ได้นับเป็นโค้ดส่วนเกินของ SPEC-19-19-.

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | FR ไม่มี AC | `spec.md`: Traceability | NFR-PERF-01 | NFR-PERF-01 ไม่มี AC ที่ตรวจโดยตรง จึงยังไม่มีเกณฑ์ยืนยันประสิทธิภาพใน RTM | |
| F-002 | ละเมิด Constraint | [calendar_source.py](../../backend/app/services/calendar_source.py): `_ACADEMIC_PERIODS`, `load_calendar_snapshot` | FR-CAL-02, FR-CAL-04, NFR-REL-01, Constraint: ใช้ปฏิทินที่สดใหม่ | academic calendar ถูกเก็บเป็น periods คงที่จาก PDF โดยไม่มีการอ่าน/ตรวจว่าต้นทางมีฉบับใหม่หรือไม่; หากมีการแก้ PDF ระบบยังอาจใช้ข้อมูลเดิมและให้ PASS | |
| F-003 | อ้าง ID ผิดเรื่อง | [router.py](../../backend/app/router.py): `_calendar_source_failure_response` | FR-CAL-05, NFR-INT-01 | เมื่อไม่มี snapshot โค้ดใส่เวลา attempt ลง `calendarVersion` และ `effectiveDate` ทั้งที่ไม่ได้ใช้/สร้าง snapshot จึงไม่ใช่ calendar reference ตามสัญญา | |
| F-004 | ตัวเลขไม่ตรง spec | [test_check_work_time.py](../../backend/tests/test_check_work_time.py): `test_NFR_PERF_01_live_calendar_check_completes_within_500ms` | NFR-PERF-01 | test กำหนด 500 ms แต่ spec ไม่ระบุตัวเลขหรือวิธีวัด; ค่า 500 ms มาจากการตัดสินใจภายหลัง ไม่ได้ trace ลง spec | |

## 4. แก้แล้ว
ไม่มี
