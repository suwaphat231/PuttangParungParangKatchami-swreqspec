from collections.abc import Iterable

from fastapi import APIRouter, Depends, HTTPException, Query

from app.authorization import Course, Principal, get_current_principal, visible_courses

router = APIRouter()


# Supports NFR-SEC-01 without introducing database access in T-01.
def get_available_courses() -> tuple[Course, ...]:
    raise HTTPException(status_code=503, detail="Course data source is unavailable")


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