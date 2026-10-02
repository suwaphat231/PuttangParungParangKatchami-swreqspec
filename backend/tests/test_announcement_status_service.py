from datetime import datetime, timedelta

from app.models.announcement import Announcement
from app.services.announcement_status_service import AnnouncementStatusService


def test_open_announcement_is_listable_and_open():
    now = datetime(2026, 1, 10, 12, 0, 0)
    announcement = Announcement(
        id="ANN-001",
        title="Lab Boy ทวิภาค 1",
        description="รับสมัครนักศึกษาร่วมงานในห้องปฏิบัติการ",
        published=True,
        open_at=now - timedelta(days=2),
        close_at=now + timedelta(days=7),
        capacity=10,
        current_applicants=3,
        subject="CS101",
        semester="2569/1",
        eligibility=["นักศึกษาชั้นปีที่ 2 ขึ้นไป"],
    )

    assert announcement.is_listable(now) is True
    assert AnnouncementStatusService.calculate_status(announcement, now) == AnnouncementStatusService.OPEN


def test_full_announcement_is_not_listable():
    now = datetime(2026, 1, 10, 12, 0, 0)
    announcement = Announcement(
        id="ANN-002",
        title="Lab Boy ทวิภาค 2",
        description="ประกาศที่มีผู้สมัครเต็มแล้ว",
        published=True,
        open_at=now - timedelta(days=1),
        close_at=now + timedelta(days=5),
        capacity=5,
        current_applicants=5,
    )

    assert announcement.is_listable(now) is False
    assert AnnouncementStatusService.calculate_status(announcement, now) == AnnouncementStatusService.FULL


def test_closed_or_unpublished_announcement_is_not_listable():
    now = datetime(2026, 1, 10, 12, 0, 0)
    closed = Announcement(
        id="ANN-003",
        title="ปิดรับสมัคร",
        description="ช่วงรับสมัครสิ้นสุดแล้ว",
        published=True,
        open_at=now - timedelta(days=10),
        close_at=now - timedelta(days=1),
        capacity=10,
        current_applicants=2,
    )
    unpublished = Announcement(
        id="ANN-004",
        title="ยังไม่เผยแพร่",
        description="ประกาศที่ยังไม่เผยแพร่",
        published=False,
        open_at=now - timedelta(days=1),
        close_at=now + timedelta(days=3),
        capacity=10,
        current_applicants=1,
    )

    assert announcement_is_not_listable_helper(closed, now) is True
    assert announcement_is_not_listable_helper(unpublished, now) is True
    assert AnnouncementStatusService.calculate_status(closed, now) == AnnouncementStatusService.CLOSED
    assert AnnouncementStatusService.calculate_status(unpublished, now) == AnnouncementStatusService.CLOSED


def announcement_is_not_listable_helper(announcement: Announcement, now: datetime) -> bool:
    return not announcement.is_listable(now)
