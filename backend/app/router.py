from collections.abc import Iterable
from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query

from app.authorization import Course, Principal, Role, get_current_principal, visible_courses
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

UC14_APPLICATIONS = {
    "application-001": {
        "application_id": "application-001",
        "student_id": "std-123",
        "student_name": "นางสาวสมใจ ใจดี",
        "department_id": "department-a",
        "course_id": "course-a",
        "announcement_id": "announcement-001",
        "required_documents": [
            "สำเนาบัตรประชาชน",
            "Transcript",
            "รูปถ่าย",
        ],
        "current_status": "รอตรวจสอบ",
        "last_updated_at": "2026-09-20T09:30:00+00:00",
        "last_review_reason": "",
        "problem_documents": [],
        "audit_log": [],
    }
}


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


# Supports FR-OFC-01 and NFR-SEC-01 by returning only the worker's allowed application checklist.
def get_application_or_404(application_id: str) -> dict[str, object]:
    record = UC14_APPLICATIONS.get(application_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return record


# Supports FR-OFC-03 and NFR-SEC-01 by enforcing role-scoped access to review data.
def ensure_application_access(principal: Principal, application: dict[str, object]) -> None:
    if principal.role is Role.ADMIN:
        return
    if principal.role is Role.DEPARTMENT_STAFF:
        if principal.department_id == application["department_id"]:
            return
    elif principal.role is Role.INSTRUCTOR:
        if application["course_id"] in principal.taught_course_ids:
            return
    elif principal.role is Role.STUDENT:
        if principal.student_id == application["student_id"]:
            return
    raise HTTPException(status_code=403, detail="Application access denied")


# Supports FR-OFC-03 by creating the notification payload required by the contract.
def build_notifications(application_id: str, reason: str, problem_documents: list[str]) -> dict[str, dict[str, object]]:
    message = (
        f"เอกสารของใบสมัคร {application_id} ต้องได้รับการแก้ไข: "
        f"{', '.join(problem_documents) if problem_documents else 'ตรวจสอบเอกสาร'}"
    )
    return {
        "in_app": {"created": True, "message": message},
        "email": {
            "created": True,
            "recipient": "student@example.com",
            "subject": "แจ้งให้แก้ไขเอกสาร_submission",
            "message": f"{reason} | {message}",
        },
    }


# Supports FR-OFC-01 by exposing the recruitment checklist that is the single source of truth.
@router.get("/uc14/applications/{application_id}/document-checklist")
def get_document_checklist(
    application_id: str,
    principal: Principal = Depends(get_current_principal),
) -> dict[str, object]:
    application = get_application_or_404(application_id)
    ensure_application_access(principal, application)
    return {
        "application_id": application["application_id"],
        "student_name": application["student_name"],
        "department_id": application["department_id"],
        "announcement_id": application["announcement_id"],
        "required_documents": list(application["required_documents"]),
        "current_status": application["current_status"],
        "last_updated_at": application["last_updated_at"],
        "last_review_reason": application["last_review_reason"],
        "problem_documents": list(application["problem_documents"]),
        "audit_log": [dict(entry) for entry in application["audit_log"]],
    }


# Supports FR-OFC-02 and FR-OFC-03 by recording, validating, and persisting the outcome.
@router.post("/uc14/applications/{application_id}/reviews")
def submit_review(
    application_id: str,
    payload: dict[str, object],
    principal: Principal = Depends(get_current_principal),
) -> dict[str, object]:
    application = get_application_or_404(application_id)
    ensure_application_access(principal, application)
    if principal.role is Role.STUDENT:
        raise HTTPException(status_code=403, detail="Students cannot submit document reviews")

    review_status = str(payload.get("review_status", "")).strip()
    reason = str(payload.get("reason", "")).strip()
    problem_documents = [
        str(item).strip() for item in payload.get("problem_documents", []) or []
    ]
    problem_documents = [item for item in problem_documents if item]

    if review_status == "ส่งกลับเพื่อแก้ไข":
        if not problem_documents or not reason:
            raise HTTPException(
                status_code=422,
                detail="ต้องระบุเอกสารที่มีปัญหาและเหตุผลก่อนส่งกลับแก้ไข",
            )
    elif review_status == "ไม่ผ่าน" and not reason:
        raise HTTPException(status_code=422, detail="ต้องระบุเหตุผลเมื่อผลตรวจสอบไม่ผ่าน")

    if review_status not in {"ผ่าน", "ไม่ผ่าน", "ส่งกลับเพื่อแก้ไข"}:
        raise HTTPException(status_code=422, detail="Invalid review status")

    application["last_review_reason"] = reason
    application["problem_documents"] = list(problem_documents)
    application["current_status"] = review_status
    application["last_updated_at"] = datetime.now(timezone.utc).isoformat()

    reviewer_id = principal.student_id or {
        Role.STUDENT: "student-001",
        Role.DEPARTMENT_STAFF: "department-staff-001",
        Role.INSTRUCTOR: "instructor-001",
        Role.ADMIN: "admin-001",
    }.get(principal.role, "staff-001")

    audit_entry = {
        "reviewed_at": application["last_updated_at"],
        "reviewer_id": reviewer_id,
        "reviewer_name": principal.role.value,
        "status": review_status,
        "problem_documents": list(problem_documents),
        "reason": reason,
        "application_status": "ส่งกลับแก้ไข" if review_status == "ส่งกลับเพื่อแก้ไข" else review_status,
    }
    application["audit_log"] = list(application["audit_log"]) + [audit_entry]

    notifications = {
        "in_app": {"created": False},
        "email": {"created": False},
    }
    if review_status == "ส่งกลับเพื่อแก้ไข":
        notifications = build_notifications(application_id, reason, problem_documents)

    return {
        "application_id": application_id,
        "status": review_status,
        "application_status": audit_entry["application_status"],
        "last_updated_at": application["last_updated_at"],
        "reason": reason,
        "problem_documents": list(problem_documents),
        "result": {
            "reviewer_id": audit_entry["reviewer_id"],
            "reviewer_name": audit_entry["reviewer_name"],
            "problem_documents": list(problem_documents),
            "reason": reason,
        },
        "audit_log": list(application["audit_log"]),
        "notifications": notifications,
    }


# Supports NFR-SEC-01 without introducing database access in T-01.
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