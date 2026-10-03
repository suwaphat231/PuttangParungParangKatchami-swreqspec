import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.authorization import Course, Principal, Role, get_current_principal
from app.main import app
from app.router import get_available_courses


MOCK_COURSES = (
    Course(course_id="course-a", department_id="department-a"),
    Course(course_id="course-b", department_id="department-a"),
    Course(course_id="course-c", department_id="department-b"),
)


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_app_imports() -> None:
    assert isinstance(app, FastAPI)


def test_AC_WKS_01_department_staff_only_sees_own_department_courses(
    client: TestClient,
) -> None:
    principal = Principal(
        role=Role.DEPARTMENT_STAFF,
        department_id="department-a",
    )
    app.dependency_overrides[get_current_principal] = lambda: principal
    app.dependency_overrides[get_available_courses] = lambda: MOCK_COURSES

    response = client.get(
        "/uc13/course-scope",
        params={"department_id": "department-b"},
    )

    assert response.status_code == 200
    assert response.json() == ["course-a", "course-b"]


def test_AC_WKS_01_instructor_only_sees_taught_courses(client: TestClient) -> None:
    principal = Principal(
        role=Role.INSTRUCTOR,
        taught_course_ids=frozenset({"course-b"}),
    )
    app.dependency_overrides[get_current_principal] = lambda: principal
    app.dependency_overrides[get_available_courses] = lambda: MOCK_COURSES

    response = client.get("/uc13/course-scope")

    assert response.status_code == 200
    assert response.json() == ["course-b"]


def test_AC_WKS_01_admin_sees_all_departments_and_can_switch_department(
    client: TestClient,
) -> None:
    principal = Principal(role=Role.ADMIN)
    app.dependency_overrides[get_current_principal] = lambda: principal
    app.dependency_overrides[get_available_courses] = lambda: MOCK_COURSES

    all_visible = client.get("/uc13/course-scope")
    selected_department = client.get(
        "/uc13/course-scope",
        params={"department_id": "department-b"},
    )

    assert all_visible.status_code == 200
    assert all_visible.json() == ["course-a", "course-b", "course-c"]
    assert selected_department.status_code == 200
    assert selected_department.json() == ["course-c"]


def test_course_scope_rejects_requests_without_principal(client: TestClient) -> None:
    response = client.get("/uc13/course-scope")

    assert response.status_code == 401