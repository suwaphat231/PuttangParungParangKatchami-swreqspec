from collections.abc import Iterable
from dataclasses import dataclass
from datetime import date, datetime, timezone
from enum import Enum

from pydantic import BaseModel

from app.authorization import Course, Principal, visible_courses


class WorkerStatus(str, Enum):
    SELECTED = "คัดเลือกแล้ว"
    WORKING = "กำลังปฏิบัติงาน"
    COMPLETED = "ปฏิบัติงานเสร็จสิ้น"
    CANCELLED = "ยกเลิก/พ้นสภาพ"


# Supports FR-WKS-01, FR-WKS-02, and FR-WKS-03 for the UC-13 in-memory source.
class WorkerRecord(BaseModel):
    worker_id: str
    student_id: str
    full_name: str
    department_id: str
    course_id: str
    semester: str
    academic_year: str
    work_period_start: date
    work_period_end: date
    status: WorkerStatus
    last_updated_at: datetime


# Supports FR-WKS-02 by defining all searchable and filterable criteria.
@dataclass(frozen=True)
class WorkerFilters:
    student_id: str | None = None
    full_name: str | None = None
    course_id: str | None = None
    semester: str | None = None
    academic_year: str | None = None
    work_period_from: date | None = None
    work_period_to: date | None = None
    status: WorkerStatus | None = None


# Supports FR-WKS-01 and FR-WKS-03 with deterministic, replaceable demo data.
class WorkerStatusStore:
    def __init__(self, records: Iterable[WorkerRecord] = ()) -> None:
        self._records = {record.worker_id: record for record in records}

    def all(self) -> tuple[WorkerRecord, ...]:
        return tuple(self._records.values())

    def get(self, worker_id: str) -> WorkerRecord | None:
        return self._records.get(worker_id)

    def update_status(
        self,
        worker_id: str,
        status: WorkerStatus,
        updated_at: datetime | None = None,
    ) -> WorkerRecord:
        record = self._records.get(worker_id)
        if record is None:
            raise KeyError(worker_id)

        new_status = WorkerStatus(status)
        if record.status is new_status:
            return record

        timestamp = updated_at or datetime.now(timezone.utc)
        if timestamp.tzinfo is None:
            timestamp = timestamp.replace(tzinfo=timezone.utc)
        updated_record = record.model_copy(
            update={"status": new_status, "last_updated_at": timestamp}
        )
        self._records[worker_id] = updated_record
        return updated_record

    # Supports ASM-02 by transitioning non-cancelled records at work-period boundaries.
    def refresh_automatic_statuses(
        self,
        now: datetime | None = None,
    ) -> tuple[WorkerRecord, ...]:
        timestamp = now or datetime.now(timezone.utc)
        today = timestamp.astimezone(timezone.utc).date()
        changed_records = []
        for record in self.all():
            if record.status is WorkerStatus.CANCELLED:
                continue
            if today < record.work_period_start:
                expected_status = WorkerStatus.SELECTED
            elif today > record.work_period_end:
                expected_status = WorkerStatus.COMPLETED
            else:
                expected_status = WorkerStatus.WORKING
            if record.status is not expected_status:
                changed_records.append(
                    self.update_status(record.worker_id, expected_status, timestamp)
                )
        return tuple(changed_records)


# Supports NFR-SEC-01 by scoping workers before applying user-selected filters.
def search_workers(
    records: Iterable[WorkerRecord],
    principal: Principal,
    filters: WorkerFilters,
    selected_department_id: str | None = None,
) -> tuple[WorkerRecord, ...]:
    records = tuple(records)
    courses_by_key = {
        (record.course_id, record.department_id): Course(
            course_id=record.course_id,
            department_id=record.department_id,
        )
        for record in records
    }
    allowed_courses = visible_courses(
        principal,
        courses_by_key.values(),
        selected_department_id,
    )
    allowed_course_keys = {
        (course.course_id, course.department_id) for course in allowed_courses
    }
    visible_records = tuple(
        record
        for record in records
        if (record.course_id, record.department_id) in allowed_course_keys
    )

    criteria = []
    if filters.student_id:
        needle = filters.student_id.casefold()
        criteria.append(lambda record: needle in record.student_id.casefold())
    if filters.full_name:
        needle = filters.full_name.casefold()
        criteria.append(lambda record: needle in record.full_name.casefold())
    if filters.course_id:
        criteria.append(lambda record: record.course_id == filters.course_id)
    if filters.semester:
        criteria.append(lambda record: record.semester == filters.semester)
    if filters.academic_year:
        criteria.append(lambda record: record.academic_year == filters.academic_year)
    if filters.work_period_from or filters.work_period_to:
        criteria.append(
            lambda record: (
                filters.work_period_from is None
                or record.work_period_end >= filters.work_period_from
            )
            and (
                filters.work_period_to is None
                or record.work_period_start <= filters.work_period_to
            )
        )
    if filters.status:
        criteria.append(lambda record: record.status is filters.status)

    if not criteria:
        return visible_records
    return tuple(
        record for record in visible_records if any(test(record) for test in criteria)
    )


# Supports Q-01 and AC-WKS-04 by counting latest statuses for overlapping work periods.
def summarize_statuses(
    records: Iterable[WorkerRecord],
    principal: Principal,
    period_from: date,
    period_to: date,
    selected_department_id: str | None = None,
) -> dict[str, int]:
    matching_records = search_workers(
        records,
        principal,
        WorkerFilters(
            work_period_from=period_from,
            work_period_to=period_to,
        ),
        selected_department_id,
    )
    summary = {status.value: 0 for status in WorkerStatus}
    for record in matching_records:
        summary[record.status.value] += 1
    return summary


def create_demo_store() -> WorkerStatusStore:
    records = (
        WorkerRecord(
            worker_id="worker-001",
            student_id="66010001",
            full_name="อรทัย ใจดี",
            department_id="department-a",
            course_id="course-a",
            semester="1",
            academic_year="2026",
            work_period_start="2026-01-05",
            work_period_end="2026-05-30",
            status=WorkerStatus.COMPLETED,
            last_updated_at="2026-06-01T09:30:00+00:00",
        ),
        WorkerRecord(
            worker_id="worker-002",
            student_id="66010002",
            full_name="กิตติพงษ์ รักเรียน",
            department_id="department-a",
            course_id="course-b",
            semester="2",
            academic_year="2026",
            work_period_start="2026-08-01",
            work_period_end="2026-12-20",
            status=WorkerStatus.WORKING,
            last_updated_at="2026-09-25T13:15:00+00:00",
        ),
        WorkerRecord(
            worker_id="worker-003",
            student_id="66010003",
            full_name="มาลี แสงทอง",
            department_id="department-b",
            course_id="course-c",
            semester="2",
            academic_year="2026",
            work_period_start="2026-11-01",
            work_period_end="2027-03-15",
            status=WorkerStatus.SELECTED,
            last_updated_at="2026-09-27T08:00:00+00:00",
        ),
        WorkerRecord(
            worker_id="worker-004",
            student_id="66010004",
            full_name="ธนา พูนผล",
            department_id="department-b",
            course_id="course-d",
            semester="1",
            academic_year="2026",
            work_period_start="2026-02-01",
            work_period_end="2026-06-30",
            status=WorkerStatus.CANCELLED,
            last_updated_at="2026-03-12T10:20:00+00:00",
        ),
        WorkerRecord(
            worker_id="worker-005",
            student_id="66010005",
            full_name="ศิริพร ใจกล้า",
            department_id="department-a",
            course_id="course-a",
            semester="2",
            academic_year="2026",
            work_period_start="2026-07-01",
            work_period_end="2026-12-15",
            status=WorkerStatus.WORKING,
            last_updated_at="2026-09-29T11:45:00+00:00",
        ),
        WorkerRecord(
            worker_id="worker-006",
            student_id="66010006",
            full_name="ปรีชา ตั้งใจ",
            department_id="department-b",
            course_id="course-c",
            semester="1",
            academic_year="2026",
            work_period_start="2026-01-15",
            work_period_end="2026-06-15",
            status=WorkerStatus.COMPLETED,
            last_updated_at="2026-06-16T16:05:00+00:00",
        ),
    )
    return WorkerStatusStore(records)


DEMO_STORE = create_demo_store()