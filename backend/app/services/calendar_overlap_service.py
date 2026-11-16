from dataclasses import dataclass
from typing import Literal

from app.models.calendar_snapshot import CalendarPeriod, CalendarSnapshot
from app.schemas.calendar_check_request import CalendarCheckRequest


# รองรับ FR-CAL-03, NFR-REL-01 และ AC-CAL-02
@dataclass(frozen=True)
class CalendarOverlapResult:
    status: Literal["PASS", "FAIL"]
    reason: str
    overlaps: tuple[CalendarPeriod, ...]


# รองรับ FR-CAL-03, NFR-REL-01 และ AC-CAL-02
def check_calendar_overlap(
    request: CalendarCheckRequest,
    snapshot: CalendarSnapshot,
) -> CalendarOverlapResult:
    """ตรวจการทับซ้อนระดับวันกับช่วงห้ามจากปฏิทินทั้งสองแหล่ง."""
    request_start = request.start_date.date()
    request_end = request.end_date.date()
    if request_end < request_start:
        raise ValueError("The requested period end must not precede its start.")

    periods = (*snapshot.academic_periods, *snapshot.public_holidays)
    overlaps = tuple(
        period
        for period in periods
        if period.start_date <= request_end and period.end_date >= request_start
    )
    if not overlaps:
        return CalendarOverlapResult(
            status="PASS",
            reason="ช่วงเวลาที่ร้องขอไม่ทับซ้อนกับวันหรือช่วงเวลาที่ห้ามปฏิบัติงาน",
            overlaps=(),
        )

    details = "; ".join(
        f"{period.title} ({period.start_date.isoformat()} - {period.end_date.isoformat()})"
        for period in overlaps
    )
    return CalendarOverlapResult(
        status="FAIL",
        reason=f"ช่วงเวลาที่ร้องขอทับซ้อนกับวันหรือช่วงเวลาที่ไม่อนุญาต: {details}",
        overlaps=overlaps,
    )
