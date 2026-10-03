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


def test_AC_OFC_01(client: TestClient) -> None:
    set_principal(Principal(role=Role.DEPARTMENT_STAFF, department_id="department-a"))

    response = client.get("/uc14/applications/application-001/document-checklist")

    assert response.status_code == 200
    payload = response.json()
    assert payload["application_id"] == "application-001"
    assert payload["required_documents"] == [
        "สำเนาบัตรประชาชน",
        "Transcript",
        "รูปถ่าย",
    ]


def test_T04_application_access_is_role_scoped(client: TestClient) -> None:
    checklist_url = "/uc14/applications/application-001/document-checklist"
    review_url = "/uc14/applications/application-001/reviews"

    app.dependency_overrides[get_current_principal] = lambda: Principal(
        role=Role.DEPARTMENT_STAFF,
        department_id="department-b",
    )
    assert client.get(checklist_url).status_code == 403

    app.dependency_overrides[get_current_principal] = lambda: Principal(
        role=Role.INSTRUCTOR,
        taught_course_ids=frozenset({"course-b"}),
    )
    assert client.get(checklist_url).status_code == 403

    app.dependency_overrides[get_current_principal] = lambda: Principal(
        role=Role.STUDENT,
        student_id="std-other",
    )
    assert client.get(checklist_url).status_code == 403

    app.dependency_overrides[get_current_principal] = lambda: Principal(
        role=Role.STUDENT,
        student_id="std-123",
    )
    assert client.get(checklist_url).status_code == 200
    assert client.post(review_url, json={"review_status": "ผ่าน"}).status_code == 403

    app.dependency_overrides[get_current_principal] = lambda: Principal(role=Role.ADMIN)
    assert client.get(checklist_url).status_code == 200


def test_AC_OFC_02(client: TestClient) -> None:
    set_principal(Principal(role=Role.DEPARTMENT_STAFF, department_id="department-a"))
    prior_log = client.get("/uc14/applications/application-001/document-checklist").json()["audit_log"]

    response = client.post(
        "/uc14/applications/application-001/reviews",
        json={
            "review_status": "ผ่าน",
            "reason": "เอกสารครบถ้วน",
            "problem_documents": [],
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ผ่าน"
    assert payload["result"]["reviewer_id"] == "department-staff-001"
    assert payload["result"]["problem_documents"] == []
    assert payload["audit_log"]
    assert len(payload["audit_log"]) == len(prior_log) + 1
    assert payload["audit_log"][-1]["status"] == "ผ่าน"
    assert payload["audit_log"][-1]["reviewed_at"]

    missing_reason = client.post(
        "/uc14/applications/application-001/reviews",
        json={"review_status": "ไม่ผ่าน", "reason": "", "problem_documents": []},
    )
    assert missing_reason.status_code == 422


def test_AC_OFC_03(client: TestClient) -> None:
    set_principal(Principal(role=Role.DEPARTMENT_STAFF, department_id="department-a"))

    missing_documents = client.post(
        "/uc14/applications/application-001/reviews",
        json={
            "review_status": "ส่งกลับเพื่อแก้ไข",
            "reason": "",
            "problem_documents": [],
        },
    )
    assert missing_documents.status_code == 422
    assert missing_documents.json()["detail"] == "ต้องระบุเอกสารที่มีปัญหาและเหตุผลก่อนส่งกลับแก้ไข"

    missing_reason = client.post(
        "/uc14/applications/application-001/reviews",
        json={
            "review_status": "ส่งกลับเพื่อแก้ไข",
            "reason": "",
            "problem_documents": ["Transcript"],
        },
    )
    assert missing_reason.status_code == 422
    assert missing_reason.json()["detail"] == "ต้องระบุเอกสารที่มีปัญหาและเหตุผลก่อนส่งกลับแก้ไข"

    approved = client.post(
        "/uc14/applications/application-001/reviews",
        json={
            "review_status": "ส่งกลับเพื่อแก้ไข",
            "reason": "เอกสาร Transcript ไม่ชัดเจน",
            "problem_documents": ["Transcript"],
        },
    )

    assert approved.status_code == 200
    payload = approved.json()
    assert payload["status"] == "ส่งกลับเพื่อแก้ไข"
    assert payload["application_status"] == "ส่งกลับแก้ไข"
    assert payload["notifications"]["in_app"]["created"] is True
    assert payload["notifications"]["email"]["created"] is True
    assert payload["audit_log"][-1]["problem_documents"] == ["Transcript"]
