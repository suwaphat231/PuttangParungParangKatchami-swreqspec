from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from app.models.application import ApplicationStatus, LabBoyApplication
from app.models.recruitment import RecruitmentAnnouncement
from app.services.application_rules import ApplicationRules, DuplicateApplicationError


def test_T01_recruitment_has_timezone_aware_window_and_default_status():
    tz = ZoneInfo("Asia/Bangkok")
    now = datetime.now(tz)

    announcement = RecruitmentAnnouncement(
        announcement_id="ANN-001",
        title="Lab Boy Computer Programming",
        teacher_name="อาจารย์ คณิต",
        office_room="ห้อง 1227",
        open_at=now - timedelta(days=1),
        close_at=now + timedelta(days=3),
        capacity=10,
        requirements=["มีสถานะนักศึกษาปกติ"],
    )
    application = LabBoyApplication(
        student_id="6501234567",
        student_name="นักศึกษา A",
        announcement_id=announcement.announcement_id,
    )

    assert announcement.is_open_at(now)
    assert application.status == ApplicationStatus.SUBMITTED
    assert application.submitted_at.tzinfo is not None
    assert application.created_at.tzinfo == ZoneInfo("Asia/Bangkok")


def test_T01_duplicate_rule_blocks_same_student_same_announcement():
    tz = ZoneInfo("Asia/Bangkok")
    now = datetime.now(tz)
    announcement = RecruitmentAnnouncement(
        announcement_id="ANN-002",
        title="Lab Boy",
        teacher_name="อาจารย์ บี",
        office_room="ห้อง 1001",
        open_at=now - timedelta(hours=1),
        close_at=now + timedelta(days=2),
        capacity=5,
    )
    existing = LabBoyApplication(
        student_id="6501234567",
        student_name="นักศึกษา B",
        announcement_id=announcement.announcement_id,
        status=ApplicationStatus.SUBMITTED,
    )

    with pytest.raises(DuplicateApplicationError):
        ApplicationRules.ensure_unique_application(
            [existing],
            student_id="6501234567",
            announcement_id=announcement.announcement_id,
        )


def test_T01_withdrawn_application_is_not_active_for_reapplication():
    tz = ZoneInfo("Asia/Bangkok")
    now = datetime.now(tz)
    announcement = RecruitmentAnnouncement(
        announcement_id="ANN-003",
        title="Lab Boy",
        teacher_name="อาจารย์ ซี",
        office_room="ห้อง 1002",
        open_at=now - timedelta(hours=1),
        close_at=now + timedelta(days=2),
        capacity=5,
    )
    withdrawn = LabBoyApplication(
        student_id="6501234568",
        student_name="นักศึกษา C",
        announcement_id=announcement.announcement_id,
        status=ApplicationStatus.WITHDRAWN,
    )

    assert not ApplicationRules.has_active_application([withdrawn], "6501234568", announcement.announcement_id)
    assert ApplicationRules.can_submit(
        announcement,
        [withdrawn],
        student_id="6501234568",
        announcement_id=announcement.announcement_id,
        current_time=now,
    )
