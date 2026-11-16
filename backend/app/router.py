from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.schemas.calendar_check_request import CalendarCheckRequest
from app.services.calendar_check_service import (
    CalendarCheckResponse,
    build_calendar_check_response,
)
from app.services.calendar_overlap_service import check_calendar_overlap
from app.services.calendar_source import (
    CalendarSourceUnavailable,
    load_calendar_snapshot,
)

router = APIRouter(tags=["calendar"])


# รองรับ FR-CAL-01, FR-CAL-04, FR-CAL-05, AC-CAL-03 และ NFR-INT-01
def _calendar_source_failure_response(reason: str) -> CalendarCheckResponse:
    """สร้างผล FAIL เมื่อไม่มี snapshot ที่ตรวจสอบความพร้อมได้."""
    attempted_at = datetime.now(timezone.utc)
    return CalendarCheckResponse(
        status="FAIL",
        reason=reason,
        calendar_version=attempted_at.strftime("%d.%m.%Y"),
        effective_date=attempted_at,
    )


# รองรับ FR-CAL-01, FR-CAL-05, AC-CAL-03, AC-CAL-04, AC-CAL-05 และ NFR-INT-01
@router.post(
    "/calendar/check",
    response_model=CalendarCheckResponse,
    response_model_by_alias=True,
)
def check_work_time(request: CalendarCheckRequest) -> dict[str, str] | CalendarCheckResponse:
    """ตรวจช่วงเวลาจาก UC-09 และคืนผล JSON ตามสัญญา."""
    try:
        snapshot = load_calendar_snapshot(request)
    except CalendarSourceUnavailable as error:
        return _calendar_source_failure_response(str(error))
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error

    result = check_calendar_overlap(request, snapshot)
    return build_calendar_check_response(result, snapshot)
