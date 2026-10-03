from collections.abc import Iterable
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query

from app.authorization import Course, Principal, get_current_principal, visible_courses
from app.worker_status import (
    DEMO_STORE,
    WorkerFilters,
    WorkerRecord,
    WorkerStatus,
    WorkerStatusStore,
    search_workers,
    summarize_statuses,
)

router = APIRouter()


# Supports NFR-SEC-01 without introducing database access in T-01.
def get_available_courses() -> tuple[Course, ...]:
    unique_courses = {
        (record.course_id, record.department_id): Course(
            course_id=record.course_id,
            department_id=record.department_id,
        )
        for record in DEMO_STORE.all()
    }
    return tuple(unique_courses.values())


# Supports FR-WKS-01, FR-WKS-02, and FR-WKS-03 with the approved demo source.
def get_worker_store() -> WorkerStatusStore:
    DEMO_STORE.refresh_automatic_statuses()
    return DEMO_STORE


# Supports NFR-SEC-01 at the API boundary before a route uses course-scoped data.
def apply_course_scope(
    principal: Principal,
    courses: Iterable[Course],
    selected_department_id: str | None = None,
) -> tuple[Course, ...]:
    return visible_courses(principal, courses, selected_department_id)


# Supports NFR-SEC-01 by exposing only the requester's authorized course scope.
@router.get("/uc13/course-scope", response_model=list[str])
def get_course_scope(
    department_id: str | None = Query(default=None),
    principal: Principal = Depends(get_current_principal),
    courses: tuple[Course, ...] = Depends(get_available_courses),
) -> list[str]:
    return [
        course.course_id
        for course in apply_course_scope(principal, courses, department_id)
    ]


# Supports NFR-SEC-01 by reporting only the current principal's course scope.
@router.get("/uc13/context")
def get_uc13_context(
    principal: Principal = Depends(get_current_principal),
    courses: tuple[Course, ...] = Depends(get_available_courses),
) -> dict[str, object]:
    visible = visible_courses(principal, courses)
    return {
        "role": principal.role.value,
        "department_id": principal.department_id,
        "departments": sorted({course.department_id for course in visible}),
        "courses": [
            {"course_id": course.course_id, "department_id": course.department_id}
            for course in visible
        ],
    }


# Supports FR-WKS-01, FR-WKS-02, and NFR-SEC-01 for the status list API.
@router.get("/uc13/workers", response_model=list[WorkerRecord])
def list_workers(
    student_id: str | None = Query(default=None),
    full_name: str | None = Query(default=None),
    course_id: str | None = Query(default=None),
    semester: str | None = Query(default=None),
    academic_year: str | None = Query(default=None),
    work_period_from: date | None = Query(default=None),
    work_period_to: date | None = Query(default=None),
    status: WorkerStatus | None = Query(default=None),
    department_id: str | None = Query(default=None),
    principal: Principal = Depends(get_current_principal),
    store: WorkerStatusStore = Depends(get_worker_store),
) -> tuple[WorkerRecord, ...]:
    filters = WorkerFilters(
        student_id=student_id,
        full_name=full_name,
        course_id=course_id,
        semester=semester,
        academic_year=academic_year,
        work_period_from=work_period_from,
        work_period_to=work_period_to,
        status=status,
    )
    return search_workers(store.all(), principal, filters, department_id)


# Supports FR-WKS-03 and NFR-SEC-01 for worker detail access.
@router.get("/uc13/workers/{worker_id}", response_model=WorkerRecord)
def get_worker_detail(
    worker_id: str,
    department_id: str | None = Query(default=None),
    principal: Principal = Depends(get_current_principal),
    store: WorkerStatusStore = Depends(get_worker_store),
) -> WorkerRecord:
    visible_worker_ids = {
        record.worker_id
        for record in search_workers(
            store.all(), principal, WorkerFilters(), department_id
        )
    }
    record = store.get(worker_id)
    if record is None or worker_id not in visible_worker_ids:
        raise HTTPException(status_code=404, detail="Worker not found")
    return record


# Supports Q-01 and AC-WKS-04 with current status over overlapping work periods.
@router.get("/uc13/reports/status")
def get_status_report(
    period_from: date,
    period_to: date,
    department_id: str | None = Query(default=None),
    principal: Principal = Depends(get_current_principal),
    store: WorkerStatusStore = Depends(get_worker_store),
) -> dict[str, object]:
    if period_from > period_to:
        raise HTTPException(status_code=422, detail="Invalid report period")
    counts = summarize_statuses(
        store.all(), principal, period_from, period_to, department_id
    )
    return {
        "period_from": period_from,
        "period_to": period_to,
        "total": sum(counts.values()),
        "by_status": counts,
    }