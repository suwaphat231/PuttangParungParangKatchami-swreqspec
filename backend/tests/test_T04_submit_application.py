from __future__ import annotations

from datetime import datetime, timedelta

import pytest
from zoneinfo import ZoneInfo

from app.models.application import ApplicationStatus, LabBoyApplication
from app.models.recruitment import RecruitmentAnnouncement
from app.repositories.application_repository import ApplicationRepository
from app.services.application_submit_service import ApplicationSubmitService


BANGKOK_TZ = ZoneInfo("Asia/Bangkok")


def build_announcement() -> RecruitmentAnnouncement:
    now = datetime.now(BANGKOK_TZ)
    return RecruitmentAnnouncement(
        announcement_id="ann-001",
        title="Lab Boy",
        teacher_name="อาจารย์ A",
        office_room="B-101",
        open_at=now - timedelta(days=1),
        close_at=now + timedelta(days=3),
        capacity=10,
        requirements=["นักศึกษาปกติ"],
    )


def test_AC_LB_01_submits_valid_application_and_keeps_single_record():
    repository = ApplicationRepository()
    service = ApplicationSubmitService(repository)
    announcement = build_announcement()

    saved = service.submit(
        announcement,
        "std-001",
        "นักศึกษา A",
    )

    assert saved.application_id is not None
    assert saved.status == ApplicationStatus.SUBMITTED
    assert saved.announcement_id == announcement.announcement_id
    assert len(repository.list()) == 1
    assert repository.find_by_student_and_announcement("std-001", announcement.announcement_id) == [saved]


def test_AC_LB_05_save_failure_leaves_no_incomplete_application():
    repository = ApplicationRepository()
    announcement = build_announcement()

    def fail_on_save(application: LabBoyApplication):
        raise RuntimeError("database write failed")

    repository.save = fail_on_save  # type: ignore[assignment]
    service = ApplicationSubmitService(repository)

    with pytest.raises(RuntimeError, match="database write failed"):
        service.submit(
            announcement,
            "std-002",
            "นักศึกษา B",
        )

    assert repository.list() == []
