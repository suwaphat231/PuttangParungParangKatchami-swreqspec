from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import HTTPException

from app.authorization import Principal, Role

REQUIRED_PUBLISH_FIELDS = (
    "title",
    "course_id",
    "quota",
    "start_date",
    "end_date",
    "qualifications",
    "required_documents",
)


@dataclass
class AnnouncementRecord:
    announcement_id: str
    title: str = ""
    course_id: str = ""
    department_id: str = ""
    quota: int | None = None
    description: str = ""
    qualifications: str = ""
    start_date: str | None = None
    end_date: str | None = None
    required_documents: list[str] = field(default_factory=list)
    status: str = "Draft"
    created_by: str | None = None
    published_by: str | None = None
    published_at: str | None = None
    created_at: str | None = None
    updated_at: str | None = None
    audit_log: list[dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return {
            "announcement_id": self.announcement_id,
            "title": self.title,
            "course_id": self.course_id,
            "department_id": self.department_id,
            "quota": self.quota,
            "description": self.description,
            "qualifications": self.qualifications,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "required_documents": list(self.required_documents),
            "status": self.status,
            "created_by": self.created_by,
            "published_by": self.published_by,
            "published_at": self.published_at,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "audit_log": [dict(entry) for entry in self.audit_log],
        }


class AnnouncementStore:
    def __init__(self, records: list[AnnouncementRecord] | None = None) -> None:
        self._records: dict[str, AnnouncementRecord] = {}
        for record in records or ():
            self._records[record.announcement_id] = record

    def all(self) -> tuple[AnnouncementRecord, ...]:
        return tuple(self._records.values())

    def get(self, announcement_id: str) -> AnnouncementRecord | None:
        return self._records.get(announcement_id)

    def create(self, record: AnnouncementRecord) -> AnnouncementRecord:
        self._records[record.announcement_id] = record
        return record

    def update(self, record: AnnouncementRecord) -> AnnouncementRecord:
        self._records[record.announcement_id] = record
        return record

    def refresh_expired(self, now: datetime | None = None) -> tuple[AnnouncementRecord, ...]:
        timestamp = now or datetime.now(timezone.utc)
        today = timestamp.astimezone(timezone.utc).date()
        changed: list[AnnouncementRecord] = []
        for record in self.all():
            if record.status != "Published":
                continue
            if record.end_date is None:
                continue
            try:
                end_date = date.fromisoformat(record.end_date)
            except ValueError:
                continue
            if today <= end_date:
                continue
            record.status = "Expired"
            record.updated_at = timestamp.isoformat()
            record.audit_log = list(record.audit_log) + [{
                "action": "expired",
                "operator_id": "system",
                "operator_role": "System",
                "timestamp": timestamp.isoformat(),
                "changed_fields": ["status"],
            }]
            changed.append(record)
        return tuple(changed)


ANNOUNCEMENT_STORE = AnnouncementStore()


def normalise_announcement_payload(payload: dict[str, Any]) -> dict[str, Any]:
    normalised: dict[str, Any] = {}
    for key, value in payload.items():
        if key == "required_documents":
            if isinstance(value, str):
                documents = [part.strip() for part in value.split(',') if part.strip()]
            elif isinstance(value, list):
                documents = [str(part).strip() for part in value if str(part).strip()]
            else:
                documents = []
            normalised[key] = documents
        elif key == "quota":
            try:
                normalised[key] = int(value)
            except (TypeError, ValueError):
                normalised[key] = value
        else:
            normalised[key] = value
    return normalised


def list_missing_publish_fields(candidate: dict[str, Any]) -> list[str]:
    missing: list[str] = []
    for field_name in REQUIRED_PUBLISH_FIELDS:
        value = candidate.get(field_name)
        if field_name == "required_documents":
            documents = value if isinstance(value, list) else []
            if not documents or not any(str(item).strip() for item in documents):
                missing.append(field_name)
            continue
        if field_name == "quota":
            try:
                if value is None or int(value) <= 0:
                    missing.append(field_name)
            except (TypeError, ValueError):
                missing.append(field_name)
            continue
        if value is None or str(value).strip() == "":
            missing.append(field_name)
    if missing:
        missing = list(dict.fromkeys(["title", *missing]))
    return missing


def principal_identifier(principal: Principal) -> str:
    if principal.role is Role.ADMIN:
        return "admin-001"
    if principal.role is Role.DEPARTMENT_STAFF:
        return "department-staff-001"
    if principal.role is Role.INSTRUCTOR:
        return "instructor-001"
    if principal.role is Role.STUDENT:
        return principal.student_id or "student-001"
    return "operator-001"


def append_audit_log(
    record: AnnouncementRecord,
    action: str,
    principal: Principal,
    changed_fields: list[str] | None = None,
) -> None:
    timestamp = datetime.now(timezone.utc).isoformat()
    record.audit_log = list(record.audit_log) + [{
        "action": action,
        "operator_id": principal_identifier(principal),
        "operator_role": principal.role.value,
        "timestamp": timestamp,
        "changed_fields": list(changed_fields or []),
    }]
    record.updated_at = timestamp


def create_announcement_record(payload: dict[str, Any], principal: Principal) -> AnnouncementRecord:
    cleaned = normalise_announcement_payload(payload)
    timestamp = datetime.now(timezone.utc).isoformat()
    record = AnnouncementRecord(
        announcement_id=f"announcement-{uuid4().hex[:8]}",
        title=str(cleaned.get("title", "")).strip(),
        course_id=str(cleaned.get("course_id", "")).strip(),
        department_id=str(cleaned.get("department_id") or principal.department_id or "").strip(),
        quota=cleaned.get("quota"),
        description=str(cleaned.get("description", "")).strip(),
        qualifications=str(cleaned.get("qualifications", "")).strip(),
        start_date=str(cleaned.get("start_date") or "").strip() or None,
        end_date=str(cleaned.get("end_date") or "").strip() or None,
        required_documents=cleaned.get("required_documents", []),
        status=str(cleaned.get("status", "Draft") or "Draft").strip() or "Draft",
        created_by=principal_identifier(principal),
        created_at=timestamp,
        updated_at=timestamp,
    )
    if record.status == "Published":
        missing = list_missing_publish_fields(record.to_dict())
        if missing:
            raise HTTPException(status_code=422, detail={"missing_fields": missing})
        record.published_by = principal_identifier(principal)
        record.published_at = timestamp
    append_audit_log(record, "created", principal, ["announcement_id", "status"])
    return record


def ensure_access(principal: Principal, record: AnnouncementRecord) -> None:
    if principal.role is Role.ADMIN:
        return
    if principal.role is Role.DEPARTMENT_STAFF:
        if record.department_id == principal.department_id:
            return
    if principal.role is Role.STUDENT:
        if record.status == "Published":
            return
    raise HTTPException(status_code=403, detail="Announcement access denied")


def is_publishable(record: AnnouncementRecord) -> list[str]:
    return list_missing_publish_fields(record.to_dict())


def update_announcement_record(
    record: AnnouncementRecord,
    payload: dict[str, Any],
    principal: Principal,
) -> AnnouncementRecord:
    cleaned = normalise_announcement_payload(payload)
    original_status = record.status
    changed_fields: list[str] = []
    for key in (
        "title",
        "course_id",
        "department_id",
        "quota",
        "description",
        "qualifications",
        "start_date",
        "end_date",
        "required_documents",
    ):
        if key not in cleaned:
            continue
        previous = getattr(record, key)
        new_value = getattr(type(record), key).default if key == "required_documents" and not cleaned[key] else cleaned[key]
        if key == "required_documents":
            new_value = cleaned[key]
        if key == "quota" and isinstance(new_value, str):
            try:
                new_value = int(new_value)
            except ValueError:
                new_value = previous
        if key == "department_id" and principal.role is Role.DEPARTMENT_STAFF:
            if str(new_value) != principal.department_id:
                raise HTTPException(status_code=403, detail="Department staff can only edit their own department")
        if key == "title":
            new_value = str(new_value).strip()
        setattr(record, key, new_value)
        if previous != new_value:
            changed_fields.append(key)
    if "status" in cleaned:
        new_status = str(cleaned["status"]).strip() or original_status
        if new_status != record.status:
            record.status = new_status
            changed_fields.append("status")
    if record.status == "Published":
        missing = is_publishable(record)
        if missing:
            raise HTTPException(status_code=422, detail={"missing_fields": missing})
        if not record.published_by:
            record.published_by = principal_identifier(principal)
        if not record.published_at:
            record.published_at = datetime.now(timezone.utc).isoformat()
    if changed_fields:
        append_audit_log(record, "updated" if record.status == original_status else "published", principal, changed_fields)
    return record
