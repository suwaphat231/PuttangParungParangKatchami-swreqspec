from app.controllers.student_application_controller import StudentApplicationController


def test_AC_LB_03_requires_authenticated_student_before_submit():
    controller = StudentApplicationController()

    result = controller.validate_before_submit(
        session=None,
        profile={
            "full_name": "นักศึกษา A",
            "student_id": "6501234567",
            "year_level": "2",
            "email": "student@ku.th",
            "student_status": "ปกติ",
            "grade": "A",
            "emergency_contact": "0999999999",
        },
        student_status="ปกติ",
    )

    assert result.allowed is False
    assert result.code == "not_authenticated"
    assert result.reason == "ต้องเข้าสู่ระบบก่อนสมัคร"


def test_AC_LB_03_rejects_non_normal_student_status():
    controller = StudentApplicationController()

    result = controller.validate_before_submit(
        session={"user_id": "std-001"},
        profile={
            "full_name": "นักศึกษา A",
            "student_id": "6501234567",
            "year_level": "2",
            "email": "student@ku.th",
            "student_status": "ปกติ",
            "grade": "A",
            "emergency_contact": "0999999999",
        },
        student_status="ลาออก",
    )

    assert result.allowed is False
    assert result.code == "not_normal_status"
    assert result.reason == "นักศึกษาสถานะปกติเท่านั้นจึงสมัครได้"


def test_AC_LB_04_rejects_missing_required_account_fields():
    controller = StudentApplicationController()

    result = controller.validate_before_submit(
        session={"user_id": "std-002"},
        profile={
            "full_name": "",
            "student_id": "6501234567",
            "year_level": "3",
            "email": "student@ku.th",
            "student_status": "ปกติ",
            "grade": "",
            "emergency_contact": "0999999999",
        },
        student_status="ปกติ",
    )

    assert result.allowed is False
    assert result.code == "incomplete_profile"
    assert "full_name" in result.missing_fields
    assert "grade" in result.missing_fields


def test_AC_LB_03_allows_only_when_session_profile_and_status_are_valid():
    controller = StudentApplicationController()

    result = controller.validate_before_submit(
        session={"user_id": "std-003"},
        profile={
            "full_name": "นักศึกษา B",
            "student_id": "6501234568",
            "year_level": "2",
            "email": "student2@ku.th",
            "student_status": "ปกติ",
            "grade": "B",
            "emergency_contact": "0888888888",
        },
        student_status="ปกติ",
    )

    assert result.allowed is True
    assert result.code == "eligible"
