import pytest
from fastapi.testclient import TestClient

from app.authorization import Principal, Role, get_current_principal
from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def set_principal(principal: Principal) -> None:
    app.dependency_overrides[get_current_principal] = lambda: principal


def test_AC_PAY_01_latest_status_is_shown_for_allowed_records(client: TestClient) -> None:
    set_principal(Principal(role=Role.DEPARTMENT_STAFF, department_id="department-a"))

    response = client.get("/uc16/payments")

    assert response.status_code == 200
    records = response.json()
    assert len(records) >= 1
    assert any(record["student_id"] == "std-123" and record["status"] == "จ่ายแล้ว" for record in records)
    assert all(record["department_id"] == "department-a" for record in records)


def test_AC_PAY_02_unpaid_or_abnormal_items_are_flagged(client: TestClient) -> None:
    set_principal(Principal(role=Role.ADMIN))

    response = client.get("/uc16/payments")

    assert response.status_code == 200
    records = response.json()
    flagged = [record for record in records if record["needs_action"] is True]
    assert any(record["status"] == "ยังไม่จ่าย" for record in flagged)
    assert any(record["status"] == "ข้อมูลผิดปกติ" for record in flagged)


def test_AC_PAY_03_search_and_filter_related_payments(client: TestClient) -> None:
    set_principal(Principal(role=Role.ADMIN))

    by_student = client.get("/uc16/payments", params={"student_id": "std-123"})
    by_course = client.get("/uc16/payments", params={"course_id": "course-a"})
    by_status = client.get("/uc16/payments", params={"status": "ยังไม่จ่าย"})

    assert by_student.status_code == 200
    assert by_course.status_code == 200
    assert by_status.status_code == 200
    assert {record["student_id"] for record in by_student.json()} == {"std-123"}
    assert all(record["course_id"] == "course-a" for record in by_course.json())
    assert all(record["status"] == "ยังไม่จ่าย" for record in by_status.json())


def test_AC_PAY_04_role_scope_limits_access(client: TestClient) -> None:
    student = Principal(role=Role.STUDENT, student_id="std-123")
    department_staff = Principal(role=Role.DEPARTMENT_STAFF, department_id="department-a")
    instructor = Principal(role=Role.INSTRUCTOR, taught_course_ids=frozenset({"course-a"}))
    admin = Principal(role=Role.ADMIN)

    for principal, expected in [
        (student, {"std-123"}),
        (department_staff, {"std-123", "std-456"}),
        (instructor, {"std-123"}),
        (admin, {"std-123", "std-456", "std-789"}),
    ]:
        set_principal(principal)
        response = client.get("/uc16/payments")
        assert response.status_code == 200
        ids = {record["student_id"] for record in response.json()}
        assert ids <= expected


def test_AC_PAY_05_access_is_logged_for_audit(client: TestClient) -> None:
    set_principal(Principal(role=Role.DEPARTMENT_STAFF, department_id="department-a"))

    response = client.get("/uc16/payments")

    assert response.status_code == 200
    records = response.json()
    assert records
    assert any(entry["event"] == "read" for record in records for entry in record["audit_log"])


def test_AC_PAY_05_detail_request_records_audit_event(client: TestClient) -> None:
    set_principal(Principal(role=Role.DEPARTMENT_STAFF, department_id="department-a"))

    response = client.get("/uc16/payments/payment-001")

    assert response.status_code == 200
    record = response.json()
    assert record["audit_log"]
    assert any(entry["event"] == "read" for entry in record["audit_log"])
