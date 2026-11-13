from datetime import datetime, timedelta

import pytest
from zoneinfo import ZoneInfo

from app.models.application import ApplicationStatus, LabBoyApplication
from app.services.withdraw_service import ApplicationWithdrawService

BANGKOK_TZ = ZoneInfo("Asia/Bangkok")


def test_AC_LB_07_withdraws_before_close_time_and_blocks_after_close():
    submitted_at = datetime(2026, 11, 5, 9, 0, tzinfo=BANGKOK_TZ)
    application = LabBoyApplication(
        application_id="LB-001",
        student_id="6501234567",
        student_name="นักศึกษา A",
        announcement_id="ann-001",
        status=ApplicationStatus.SUBMITTED,
        submitted_at=submitted_at,
        created_at=submitted_at,
        updated_at=submitted_at,
    )

    withdrawn = ApplicationWithdrawService.withdraw(
        application,
        closed_at=datetime(2026, 11, 12, 23, 59, tzinfo=BANGKOK_TZ),
        when=datetime(2026, 11, 10, 8, 0, tzinfo=BANGKOK_TZ),
    )
    assert withdrawn.status == ApplicationStatus.WITHDRAWN

    with pytest.raises(ValueError, match="application is no longer withdrawable"):
        ApplicationWithdrawService.withdraw(
            withdrawn,
            closed_at=datetime(2026, 11, 12, 23, 59, tzinfo=BANGKOK_TZ),
            when=datetime(2026, 11, 13, 8, 0, tzinfo=BANGKOK_TZ),
        )


def test_AC_LB_08_reapply_after_withdraw_has_new_application_id():
    submitted_at = datetime(2026, 11, 5, 9, 0, tzinfo=BANGKOK_TZ)
    original = LabBoyApplication(
        application_id="LB-001",
        student_id="6501234567",
        student_name="นักศึกษา A",
        announcement_id="ann-001",
        status=ApplicationStatus.WITHDRAWN,
        submitted_at=submitted_at,
        created_at=submitted_at,
        updated_at=submitted_at,
    )

    reapplied = ApplicationWithdrawService.reapply(
        original,
        when=datetime(2026, 11, 11, 10, 0, tzinfo=BANGKOK_TZ),
        new_application_id="LB-002",
    )

    assert reapplied.status == ApplicationStatus.SUBMITTED
    assert reapplied.application_id == "LB-002"
    assert reapplied.student_id == original.student_id
    assert reapplied.announcement_id == original.announcement_id
