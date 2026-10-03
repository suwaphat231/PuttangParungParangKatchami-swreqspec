from datetime import datetime

from app.controllers.application_detail_controller import ApplicationDetailController


def test_application_detail_uses_latest_status_and_asia_bangkok_time():
    application = {
        "application_id": "APP-1001",
        "user_id": "student-01",
        "status": "ส่งกลับแก้ไข",
        "updated_at": "2026-01-10T15:45:00+00:00",
        "reason": "เอกสารไม่ครบ",
        "required_actions": ["แนบสำเนาบัตรนักศึกษา", "กรอกข้อมูลอีเมลใหม่"],
    }

    result = ApplicationDetailController.get_detail_for_user(application, "student-01")

    assert result["status"] == "ส่งกลับแก้ไข"
    assert result["updated_at_display"] == "10/01/2026 22:45:00"
    assert result["updated_at_bangkok"].endswith("+07:00")
    assert result["reason"] == "เอกสารไม่ครบ"
    assert result["required_actions"] == ["แนบสำเนาบัตรนักศึกษา", "กรอกข้อมูลอีเมลใหม่"]


def test_application_detail_reloads_latest_status_when_opened_again():
    old_application = {
        "application_id": "APP-1002",
        "user_id": "student-02",
        "status": "รอตรวจสอบ",
        "updated_at": "2026-01-09T10:00:00+07:00",
        "reason": "",
        "required_actions": [],
    }
    refreshed_application = {
        "application_id": "APP-1002",
        "user_id": "student-02",
        "status": "ผ่าน",
        "updated_at": "2026-01-11T10:30:00+07:00",
        "reason": "",
        "required_actions": [],
    }

    stale_detail = ApplicationDetailController.get_detail_for_user(old_application, "student-02")
    fresh_detail = ApplicationDetailController.get_detail_for_user(refreshed_application, "student-02")

    assert stale_detail["status"] == "รอตรวจสอบ"
    assert fresh_detail["status"] == "ผ่าน"
    assert fresh_detail["updated_at_display"] == "11/01/2026 10:30:00"
