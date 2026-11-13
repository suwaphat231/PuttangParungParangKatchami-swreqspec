from app.services.application_draft_service import ApplicationDraftService


def test_AC_LB_06_allows_editing_before_confirmation_and_cancel_keeps_last_confirmed_values():
    service = ApplicationDraftService()
    service.start(
        {
            "full_name": "นักศึกษา A",
            "student_id": "6501234567",
            "year_level": "2",
            "email": "student@ku.th",
            "student_status": "ปกติ",
            "grade": "A",
            "emergency_contact": "0999999999",
        }
    )

    service.update_field("full_name", "นักศึกษา B")
    assert service.snapshot()["full_name"] == "นักศึกษา B"

    canceled = service.cancel()
    assert canceled["full_name"] == "นักศึกษา A"
    assert service.snapshot()["full_name"] == "นักศึกษา A"

    confirmed = service.confirm({**service.snapshot(), "full_name": "นักศึกษา C"})
    assert confirmed.valid is True
    assert service.snapshot()["full_name"] == "นักศึกษา C"


def test_AC_LB_06_rejects_incomplete_draft_without_creating_application_record():
    service = ApplicationDraftService()
    service.start(
        {
            "full_name": "นักศึกษา D",
            "student_id": "",
            "year_level": "3",
            "email": "studentd@ku.th",
            "student_status": "ปกติ",
            "grade": "B",
            "emergency_contact": "0888888888",
        }
    )

    result = service.validate()
    assert result.valid is False
    assert "student_id" in result.missing_fields
    assert service.snapshot()["student_id"] == ""
