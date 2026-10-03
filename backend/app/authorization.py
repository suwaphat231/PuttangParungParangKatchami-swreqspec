from dataclasses import dataclass
from enum import Enum
from collections.abc import Iterable

from fastapi import HTTPException, Request


# Supports NFR-SEC-01.
class Role(str, Enum):
    DEPARTMENT_STAFF = "Department Staff"
    INSTRUCTOR = "Instructor"
    ADMIN = "Admin"


# Supports NFR-SEC-01 by carrying the user's authorized department or courses.
@dataclass(frozen=True)
class Principal:
    role: Role
    department_id: str | None = None
    taught_course_ids: frozenset[str] = frozenset()


# Supports NFR-SEC-01 by representing the course boundary used for visibility.
@dataclass(frozen=True)
class Course:
    course_id: str
    department_id: str


# Supports NFR-SEC-01 by accepting identity only from trusted request state.
def get_current_principal(request: Request) -> Principal:
    principal = getattr(request.state, "principal", None)
    if not isinstance(principal, Principal):
        raise HTTPException(status_code=401, detail="Authenticated principal required")
    return principal


# Supports NFR-SEC-01 by restricting visible courses according to the user's role.
def visible_courses(
    principal: Principal,
    courses: Iterable[Course],
    selected_department_id: str | None = None,
) -> tuple[Course, ...]:
    if principal.role is Role.ADMIN:
        return tuple(
            course
            for course in courses
            if selected_department_id is None
            or course.department_id == selected_department_id
        )

    if principal.role is Role.DEPARTMENT_STAFF:
        return tuple(
            course
            for course in courses
            if principal.department_id is not None
            and course.department_id == principal.department_id
        )

    if principal.role is Role.INSTRUCTOR:
        return tuple(
            course
            for course in courses
            if course.course_id in principal.taught_course_ids
        )

    return ()