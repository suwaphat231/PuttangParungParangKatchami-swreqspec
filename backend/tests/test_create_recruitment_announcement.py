import pytest
from fastapi.testclient import TestClient

from app.authorization import Principal, Role, get_current_principal
from app.main import app


@pytest.fixture
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def set_principal(principal: Principal) -> None:
    app.dependency_overrides[get_current_principal] = lambda: principal


def test_AC_ANN_01(client: TestClient) -> None:
    set_principal(Principal(role=Role.DEPARTMENT_STAFF, department_id="department-a"))

    response = client.post(
        "/uc15/announcements",
        json={
            "title": "ประกาศรับสมัคร Lab Boy ภาควิชา A",
            "course_id": "course-a",
            "department_id": "department-a",
            "description": "รายละเอียดประกาศ",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "Draft"
    assert payload["title"] == "ประกาศรับสมัคร Lab Boy ภาควิชา A"
    assert payload["department_id"] == "department-a"
    assert payload["audit_log"]


def test_AC_ANN_02(client: TestClient) -> None:
    set_principal(Principal(role=Role.DEPARTMENT_STAFF, department_id="department-a"))

    draft = client.post(
        "/uc15/announcements",
        json={
            "title": "ประกาศรับสมัคร Lab Boy ภาควิชา A",
            "course_id": "course-a",
            "department_id": "department-a",
        },
    ).json()

    missing = client.post(
        f"/uc15/announcements/{draft['announcement_id']}/publish",
        json={},
    )

    assert missing.status_code == 422
    assert missing.json()["detail"]["missing_fields"]
    assert "title" in missing.json()["detail"]["missing_fields"]


def test_AC_ANN_03(client: TestClient) -> None:
    set_principal(Principal(role=Role.DEPARTMENT_STAFF, department_id="department-a"))

    draft = client.post(
        "/uc15/announcements",
        json={
            "title": "ประกาศรับสมัคร Lab Boy ภาควิชา A",
            "course_id": "course-a",
            "department_id": "department-a",
        },
    ).json()

    complete = client.put(
        f"/uc15/announcements/{draft['announcement_id']}",
        json={
            "title": "ประกาศรับสมัคร Lab Boy ภาควิชา A",
            "course_id": "course-a",
            "department_id": "department-a",
            "quota": 5,
            "description": "ต้องผ่านเข้าร่วมกิจกรรม",
            "qualifications": "นักศึกษาชั้นปี 2 ขึ้นไป",
            "start_date": "2026-10-01",
            "end_date": "2026-10-31",
            "required_documents": ["สำเนาบัตรประชาชน", "Transcript"],
        },
    )
    assert complete.status_code == 200

    publish = client.post(f"/uc15/announcements/{draft['announcement_id']}/publish")
    assert publish.status_code == 200
    payload = publish.json()
    assert payload["status"] == "Published"
    assert payload["published_by"] == "department-staff-001"
    assert payload["published_at"]
    assert payload["audit_log"][-1]["action"] == "published"
    assert payload["audit_log"][-1]["operator_role"] == "Department Staff"


def test_UC15_role_scope_and_student_visibility(client: TestClient) -> None:
    department_staff = Principal(role=Role.DEPARTMENT_STAFF, department_id="department-a")
    admin = Principal(role=Role.ADMIN, department_id="department-a")
    student = Principal(role=Role.STUDENT, student_id="std-123")

    set_principal(department_staff)
    created = client.post(
        "/uc15/announcements",
        json={
            "title": "Draft A",
            "course_id": "course-a",
            "department_id": "department-a",
        },
    )
    assert created.status_code == 200
    draft_id = created.json()["announcement_id"]

    set_principal(student)
    listing = client.get("/uc15/announcements")
    assert listing.status_code == 200
    assert all(item["status"] == "Published" for item in listing.json())

    set_principal(admin)
    admin_list = client.get("/uc15/announcements")
    assert admin_list.status_code == 200
    assert any(item["announcement_id"] == draft_id for item in admin_list.json())


def test_UC15_expiry_lifecycle(client: TestClient) -> None:
    set_principal(Principal(role=Role.ADMIN, department_id="department-a"))
    announcement = client.post(
        "/uc15/announcements",
        json={
            "title": "ประกาศหมดอายุ",
            "course_id": "course-a",
            "department_id": "department-a",
            "quota": 3,
            "qualifications": "นักศึกษา",
            "start_date": "2026-09-01",
            "end_date": "2026-09-05",
            "required_documents": ["Transcript"],
            "status": "Published",
        },
    ).json()

    refresh = client.get(f"/uc15/announcements/{announcement['announcement_id']}")
    assert refresh.status_code == 200
    assert refresh.json()["status"] in {"Published", "Expired"}
