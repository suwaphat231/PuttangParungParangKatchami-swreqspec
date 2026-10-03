from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from app.authorization import Principal, Role


_PAYMENT_STATUS_VALUES = {"จ่ายแล้ว", "ยังไม่จ่าย", "ข้อมูลผิดปกติ"}


@dataclass
class PaymentRecord:
    payment_id: str
    student_id: str
    full_name: str
    department_id: str
    course_id: str
    semester: str
    academic_year: str
    amount: int
    status: str
    last_updated_at: str
    audit_log: list[dict[str, Any]] = field(default_factory=list)

    @property
    def needs_action(self) -> bool:
        return self.status in {"ยังไม่จ่าย", "ข้อมูลผิดปกติ"}

    def to_dict(self) -> dict[str, Any]:
        return {
            "payment_id": self.payment_id,
            "student_id": self.student_id,
            "full_name": self.full_name,
            "department_id": self.department_id,
            "course_id": self.course_id,
            "semester": self.semester,
            "academic_year": self.academic_year,
            "amount": self.amount,
            "status": self.status,
            "needs_action": self.needs_action,
            "last_updated_at": self.last_updated_at,
            "audit_log": [dict(entry) for entry in self.audit_log],
        }


def normalize_payment_status(status: str | None) -> str:
    value = (status or "").strip()
    if value in _PAYMENT_STATUS_VALUES:
        return value
    return "ข้อมูลผิดปกติ"


def append_audit_entry(record: PaymentRecord, principal: Principal, *, event: str = "read") -> None:
    record.audit_log.append(
        {
            "event": event,
            "actor_role": principal.role.value,
            "actor_id": principal.student_id or principal.department_id or "system-user",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "payment_id": record.payment_id,
        }
    )


def build_demo_payment_store() -> list[PaymentRecord]:
    now = datetime(2026, 9, 20, 8, 30, tzinfo=timezone.utc).isoformat()
    return [
        PaymentRecord(
            payment_id="payment-001",
            student_id="std-123",
            full_name="สมใจ ใจดี",
            department_id="department-a",
            course_id="course-a",
            semester="1",
            academic_year="2026",
            amount=12000,
            status="จ่ายแล้ว",
            last_updated_at=now,
            audit_log=[{"event": "read", "actor_role": "Department Staff", "actor_id": "department-a", "timestamp": now, "payment_id": "payment-001"}],
        ),
        PaymentRecord(
            payment_id="payment-002",
            student_id="std-456",
            full_name="กิตติพงษ์ รักเรียน",
            department_id="department-a",
            course_id="course-b",
            semester="1",
            academic_year="2026",
            amount=8000,
            status="ยังไม่จ่าย",
            last_updated_at="2026-09-21T08:30:00+00:00",
            audit_log=[{"event": "read", "actor_role": "Department Staff", "actor_id": "department-a", "timestamp": "2026-09-21T08:30:00+00:00", "payment_id": "payment-002"}],
        ),
        PaymentRecord(
            payment_id="payment-003",
            student_id="std-789",
            full_name="มาลี แสงทอง",
            department_id="department-b",
            course_id="course-c",
            semester="2",
            academic_year="2026",
            amount=15000,
            status="ข้อมูลผิดปกติ",
            last_updated_at="2026-09-22T09:10:00+00:00",
            audit_log=[{"event": "read", "actor_role": "Admin", "actor_id": "admin-001", "timestamp": "2026-09-22T09:10:00+00:00", "payment_id": "payment-003"}],
        ),
    ]


PAYMENT_STORE = build_demo_payment_store()


def matches_display_scope(record: PaymentRecord, principal: Principal, department_id: str | None = None) -> bool:
    if principal.role is Role.ADMIN:
        return department_id is None or record.department_id == department_id
    if principal.role is Role.DEPARTMENT_STAFF:
        return principal.department_id is not None and record.department_id == principal.department_id
    if principal.role is Role.INSTRUCTOR:
        return record.course_id in principal.taught_course_ids
    if principal.role is Role.STUDENT:
        return record.student_id == principal.student_id
    return False


def filter_payment_records(
    records: list[PaymentRecord],
    principal: Principal,
    *,
    student_id: str | None = None,
    full_name: str | None = None,
    course_id: str | None = None,
    semester: str | None = None,
    academic_year: str | None = None,
    status: str | None = None,
    department_id: str | None = None,
) -> list[PaymentRecord]:
    visible = [record for record in records if matches_display_scope(record, principal, department_id)]
    filtered: list[PaymentRecord] = []
    for record in visible:
        if student_id and record.student_id != student_id:
            continue
        if full_name and full_name.lower() not in record.full_name.lower():
            continue
        if course_id and record.course_id != course_id:
            continue
        if semester and record.semester != semester:
            continue
        if academic_year and record.academic_year != academic_year:
            continue
        if status and record.status != status:
            continue
        filtered.append(record)
    return sorted(filtered, key=lambda item: item.last_updated_at, reverse=True)
