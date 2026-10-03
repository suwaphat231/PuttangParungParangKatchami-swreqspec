import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from datetime import date, datetime, timezone
from time import perf_counter

from app.authorization import Course, Principal, Role, get_current_principal
from app.main import app
from app.router import get_available_courses, get_worker_store
from app.worker_status import (
    DEMO_STORE,
    WorkerFilters,
    WorkerRecord,
    WorkerStatus,
    WorkerStatusStore,
    search_workers,
    summarize_statuses,
)


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


def test_demo_principal_is_disabled_in_production(
    client: TestClient,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("UC13_AUTH_MODE", "demo")
    monkeypatch.setenv("APP_ENV", "production")

    response = client.get("/uc13/workers")

    assert response.status_code == 401


def test_AC_WKS_01_status_list_returns_latest_statuses_with_role_scope(
    client: TestClient,
) -> None:
    principal = Principal(
        role=Role.DEPARTMENT_STAFF,
        department_id="department-a",
    )
    app.dependency_overrides[get_current_principal] = lambda: principal
    app.dependency_overrides[get_worker_store] = lambda: DEMO_STORE

    response = client.get("/uc13/workers")

    assert response.status_code == 200
    records = response.json()
    assert records
    assert all(record["department_id"] == "department-a" for record in records)
    assert {record["status"] for record in records} <= {
        status.value for status in WorkerStatus
    }


def test_AC_WKS_02_partial_search_and_selected_filters_use_or() -> None:
    principal = Principal(role=Role.ADMIN)
    records = DEMO_STORE.all()
    partial_id_results = search_workers(
        records,
        principal,
        WorkerFilters(student_id="001"),
    )
    partial_name_results = search_workers(
        records,
        principal,
        WorkerFilters(full_name="ใจดี"),
    )
    or_results = search_workers(
        records,
        principal,
        WorkerFilters(
            student_id="66010001",
            course_id="course-c",
            semester="9",
        ),
    )

    assert [record.worker_id for record in partial_id_results] == ["worker-001"]
    assert [record.worker_id for record in partial_name_results] == ["worker-001"]
    assert {record.worker_id for record in or_results} == {
        "worker-001",
        "worker-003",
        "worker-006",
    }


def test_AC_WKS_02_work_period_filter_matches_overlapping_periods() -> None:
    principal = Principal(role=Role.ADMIN)
    results = search_workers(
        DEMO_STORE.all(),
        principal,
        WorkerFilters(
            work_period_from=date(2026, 5, 1),
            work_period_to=date(2026, 5, 31),
        ),
    )

    assert {record.worker_id for record in results} == {
        "worker-001",
        "worker-004",
        "worker-006",
    }


def test_AC_WKS_03_status_change_updates_full_timestamp() -> None:
    original = DEMO_STORE.get("worker-001")
    assert original is not None
    store = WorkerStatusStore([original.model_copy(deep=True)])
    updated_at = datetime(2026, 10, 3, 8, 45, tzinfo=timezone.utc)

    updated = store.update_status(
        original.worker_id,
        WorkerStatus.WORKING,
        updated_at,
    )

    assert updated.status is WorkerStatus.WORKING
    assert updated.last_updated_at == updated_at
    assert updated.last_updated_at.isoformat() == "2026-10-03T08:45:00+00:00"


def test_AC_WKS_03_automatic_status_transition_updates_timestamp() -> None:
    selected_record = DEMO_STORE.get("worker-003")
    assert selected_record is not None
    store = WorkerStatusStore([selected_record.model_copy(deep=True)])
    transition_time = datetime(2026, 11, 1, 0, 0, tzinfo=timezone.utc)

    changed = store.refresh_automatic_statuses(transition_time)

    assert len(changed) == 1
    assert changed[0].status is WorkerStatus.WORKING
    assert changed[0].last_updated_at == transition_time


def test_AC_WKS_04_report_counts_latest_status_for_requested_work_period() -> None:
    principal = Principal(role=Role.ADMIN)
    summary = summarize_statuses(
        DEMO_STORE.all(),
        principal,
        date(2026, 1, 1),
        date(2026, 6, 30),
    )

    assert summary[WorkerStatus.COMPLETED.value] == 2
    assert summary[WorkerStatus.CANCELLED.value] == 1
    assert sum(summary.values()) == 3


def test_AC_WKS_01_api_statuses_respect_each_role_scope(client: TestClient) -> None:
    app.dependency_overrides[get_worker_store] = lambda: DEMO_STORE

    department_staff = Principal(
        role=Role.DEPARTMENT_STAFF,
        department_id="department-a",
    )
    app.dependency_overrides[get_current_principal] = lambda: department_staff
    staff_response = client.get("/uc13/workers")
    assert staff_response.status_code == 200
    assert all(row["department_id"] == "department-a" for row in staff_response.json())

    instructor = Principal(
        role=Role.INSTRUCTOR,
        taught_course_ids=frozenset({"course-c"}),
    )
    app.dependency_overrides[get_current_principal] = lambda: instructor
    instructor_response = client.get("/uc13/workers")
    assert instructor_response.status_code == 200
    assert {row["course_id"] for row in instructor_response.json()} == {"course-c"}

    admin = Principal(role=Role.ADMIN)
    app.dependency_overrides[get_current_principal] = lambda: admin
    all_response = client.get("/uc13/workers")
    selected_department = client.get(
        "/uc13/workers",
        params={"department_id": "department-b"},
    )
    assert all_response.status_code == 200
    assert {row["status"] for row in all_response.json()} == {
        status.value for status in WorkerStatus
    }
    assert all(row["department_id"] == "department-b" for row in selected_department.json())


def test_AC_WKS_02_api_supports_partial_filters_or_and_no_results(
    client: TestClient,
) -> None:
    app.dependency_overrides[get_current_principal] = lambda: Principal(role=Role.ADMIN)
    app.dependency_overrides[get_worker_store] = lambda: DEMO_STORE

    partial_id = client.get("/uc13/workers", params={"student_id": "001"})
    partial_name = client.get("/uc13/workers", params={"full_name": "มาลี"})
    course_filter = client.get("/uc13/workers", params={"course_id": "course-c"})
    semester_filter = client.get("/uc13/workers", params={"semester": "1"})
    year_filter = client.get("/uc13/workers", params={"academic_year": "2026"})
    status_filter = client.get(
        "/uc13/workers",
        params={"status": WorkerStatus.SELECTED.value},
    )
    or_results = client.get(
        "/uc13/workers",
        params={
            "student_id": "66010001",
            "course_id": "course-c",
            "semester": "9",
            "academic_year": "9",
            "status": "คัดเลือกแล้ว",
        },
    )
    period_results = client.get(
        "/uc13/workers",
        params={
            "work_period_from": "2026-05-01",
            "work_period_to": "2026-05-31",
        },
    )
    no_results = client.get("/uc13/workers", params={"student_id": "not-found"})

    assert [row["worker_id"] for row in partial_id.json()] == ["worker-001"]
    assert [row["worker_id"] for row in partial_name.json()] == ["worker-003"]
    assert {row["course_id"] for row in course_filter.json()} == {"course-c"}
    assert all(row["semester"] == "1" for row in semester_filter.json())
    assert all(row["academic_year"] == "2026" for row in year_filter.json())
    assert all(row["status"] == WorkerStatus.SELECTED.value for row in status_filter.json())
    assert {row["worker_id"] for row in or_results.json()} == {
        "worker-001",
        "worker-003",
        "worker-006",
    }
    assert {row["worker_id"] for row in period_results.json()} == {
        "worker-001",
        "worker-004",
        "worker-006",
    }
    assert no_results.status_code == 200
    assert no_results.json() == []


def test_AC_WKS_03_api_detail_returns_full_timestamp(client: TestClient) -> None:
    app.dependency_overrides[get_current_principal] = lambda: Principal(role=Role.ADMIN)
    app.dependency_overrides[get_worker_store] = lambda: DEMO_STORE

    response = client.get("/uc13/workers/worker-001")

    assert response.status_code == 200
    assert response.json()["last_updated_at"].startswith("2026-06-01T09:30:00")


def test_AC_WKS_04_api_report_summarizes_latest_status_for_period(
    client: TestClient,
) -> None:
    app.dependency_overrides[get_current_principal] = lambda: Principal(role=Role.ADMIN)
    app.dependency_overrides[get_worker_store] = lambda: DEMO_STORE

    response = client.get(
        "/uc13/reports/status",
        params={"period_from": "2026-01-01", "period_to": "2026-06-30"},
    )

    assert response.status_code == 200
    assert response.json()["total"] == 3
    assert response.json()["by_status"][WorkerStatus.COMPLETED.value] == 2
    assert response.json()["by_status"][WorkerStatus.CANCELLED.value] == 1


def test_AC_PERF_01_search_and_filter_10k_records_under_two_seconds(
    client: TestClient,
) -> None:
    timestamp = datetime(2026, 1, 1, tzinfo=timezone.utc)
    records = [
        WorkerRecord(
            worker_id=f"perf-{index:05d}",
            student_id=f"student-{index:05d}",
            full_name=f"Demo Worker {index:05d}",
            department_id="department-a",
            course_id=f"course-{index % 4}",
            semester=str(index % 2 + 1),
            academic_year="2026",
            work_period_start=date(2026, 1, 1),
            work_period_end=date(2026, 12, 31),
            status=tuple(WorkerStatus)[index % len(WorkerStatus)],
            last_updated_at=timestamp,
        )
        for index in range(10_000)
    ]
    store = WorkerStatusStore(records)
    app.dependency_overrides[get_current_principal] = lambda: Principal(role=Role.ADMIN)
    app.dependency_overrides[get_worker_store] = lambda: store

    started_at = perf_counter()
    response = client.get(
        "/uc13/workers",
        params={"student_id": "09999", "course_id": "not-a-course"},
    )
    elapsed_seconds = perf_counter() - started_at

    print(f"AC-PERF-01: {elapsed_seconds:.4f}s for 10,000 records")
    assert response.status_code == 200
    assert len(records) == 10_000
    assert [record["worker_id"] for record in response.json()] == ["perf-09999"]
    assert elapsed_seconds <= 2.0