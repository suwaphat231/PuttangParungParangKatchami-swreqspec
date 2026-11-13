import atexit
from datetime import date, datetime, timezone
from typing import Any

import httpx
from pydantic import ValidationError

from app.models.calendar_snapshot import (
    CalendarPeriod,
    CalendarSnapshot,
    ThailandHolidayResponse,
)
from app.schemas.calendar_check_request import CalendarCheckRequest

THAILAND_HOLIDAYS_API = "https://thailandformats.com/api/v1/holidays"
ACADEMIC_CALENDAR_URL = (
    "https://reg5.su.ac.th/Download/ruleAttachment/calendar2569.pdf"
)
ACADEMIC_CALENDAR_VERSION = "Silpakorn undergraduate academic calendar 2569"
ACADEMIC_CALENDAR_EFFECTIVE_DATE = date(2025, 11, 18)
ACADEMIC_CALENDAR_COVERAGE_START = date(2026, 6, 22)
ACADEMIC_CALENDAR_COVERAGE_END = date(2027, 7, 5)

# Reuse HTTP connections without caching holiday data; each check still fetches live data.
_DEFAULT_HTTP_CLIENT = httpx.Client()
atexit.register(_DEFAULT_HTTP_CLIENT.close)

_ACADEMIC_PERIODS = (
    CalendarPeriod(
        title="Registration/add-drop period (first semester)",
        category="registration",
        start_date=date(2026, 7, 6),
        end_date=date(2026, 7, 20),
        source=ACADEMIC_CALENDAR_URL,
    ),
    CalendarPeriod(
        title="Registration/add-drop period (second semester)",
        category="registration",
        start_date=date(2026, 11, 30),
        end_date=date(2026, 12, 14),
        source=ACADEMIC_CALENDAR_URL,
    ),
    CalendarPeriod(
        title="Registration/add-drop period (summer semester)",
        category="registration",
        start_date=date(2027, 4, 19),
        end_date=date(2027, 4, 26),
        source=ACADEMIC_CALENDAR_URL,
    ),
    CalendarPeriod(
        title="Midterm examination period (first semester)",
        category="exam",
        start_date=date(2026, 8, 22),
        end_date=date(2026, 9, 5),
        source=ACADEMIC_CALENDAR_URL,
    ),
    CalendarPeriod(
        title="Midterm examination period (second semester)",
        category="exam",
        start_date=date(2027, 1, 16),
        end_date=date(2027, 1, 30),
        source=ACADEMIC_CALENDAR_URL,
    ),
    CalendarPeriod(
        title="Final examination period (first semester)",
        category="exam",
        start_date=date(2026, 10, 26),
        end_date=date(2026, 11, 7),
        source=ACADEMIC_CALENDAR_URL,
    ),
    CalendarPeriod(
        title="Final examination period (second semester)",
        category="exam",
        start_date=date(2027, 3, 22),
        end_date=date(2027, 4, 3),
        source=ACADEMIC_CALENDAR_URL,
    ),
    CalendarPeriod(
        title="Final examination period (summer semester)",
        category="exam",
        start_date=date(2027, 6, 14),
        end_date=date(2027, 6, 19),
        source=ACADEMIC_CALENDAR_URL,
    ),
    CalendarPeriod(
        title="Semester closure (first semester)",
        category="academic_closure",
        start_date=date(2026, 11, 8),
        end_date=date(2026, 11, 8),
        source=ACADEMIC_CALENDAR_URL,
    ),
    CalendarPeriod(
        title="Semester closure (second semester)",
        category="academic_closure",
        start_date=date(2027, 4, 4),
        end_date=date(2027, 4, 4),
        source=ACADEMIC_CALENDAR_URL,
    ),
    CalendarPeriod(
        title="Semester closure (summer semester)",
        category="academic_closure",
        start_date=date(2027, 6, 20),
        end_date=date(2027, 6, 20),
        source=ACADEMIC_CALENDAR_URL,
    ),
)


# รองรับ FR-CAL-02, FR-CAL-04, AC-CAL-03 และ NFR-REL-01
class CalendarSourceUnavailable(RuntimeError):
    """แหล่งปฏิทินขาดข้อมูลที่ตรวจสอบและยอมรับได้."""


# รองรับ FR-CAL-02, FR-CAL-04, AC-CAL-03 และ NFR-REL-01
def load_calendar_snapshot(
    request: CalendarCheckRequest,
    client: httpx.Client | None = None,
) -> CalendarSnapshot:
    """โหลดปฏิทินมหาวิทยาลัยที่ครอบคลุมคำขอและวันหยุดไทยตามปี ค.ศ."""
    start_date = request.start_date.date()
    end_date = request.end_date.date()
    if end_date < start_date:
        raise ValueError("The requested period end must not precede its start.")
    if (
        start_date < ACADEMIC_CALENDAR_COVERAGE_START
        or end_date > ACADEMIC_CALENDAR_COVERAGE_END
    ):
        raise CalendarSourceUnavailable(
            "The requested period is outside the available academic calendar."
        )

    http_client = client if client is not None else _DEFAULT_HTTP_CLIENT
    years = tuple(range(start_date.year, end_date.year + 1))
    holidays = tuple(
        period
        for year in years
        for period in _load_public_holidays(http_client, year)
    )

    return CalendarSnapshot(
        academic_calendar_version=ACADEMIC_CALENDAR_VERSION,
        academic_calendar_effective_date=ACADEMIC_CALENDAR_EFFECTIVE_DATE,
        academic_calendar_source=ACADEMIC_CALENDAR_URL,
        academic_periods=_ACADEMIC_PERIODS,
        public_holiday_years=years,
        public_holidays=holidays,
        retrieved_at=datetime.now(timezone.utc),
    )


# รองรับ FR-CAL-02, FR-CAL-04, AC-CAL-03 และ NFR-REL-01
def _load_public_holidays(
    client: httpx.Client,
    year: int,
) -> tuple[CalendarPeriod, ...]:
    try:
        response = client.get(f"{THAILAND_HOLIDAYS_API}/{year}")
        response.raise_for_status()
        payload: Any = response.json()
        holiday_response = ThailandHolidayResponse.model_validate(payload)
    except (httpx.HTTPError, ValueError, ValidationError) as error:
        raise CalendarSourceUnavailable(
            f"Thailand public holiday data for {year} is unavailable or invalid."
        ) from error

    if holiday_response.year != year:
        raise CalendarSourceUnavailable(
            f"Thailand public holiday response year does not match {year}."
        )

    year_start = date(year, 1, 1)
    year_end = date(year, 12, 31)
    if any(
        holiday.end_date < year_start or holiday.start_date > year_end
        for holiday in holiday_response.holidays
    ):
        raise CalendarSourceUnavailable(
            f"Thailand public holiday records do not match {year}."
        )

    return tuple(
        CalendarPeriod(
            title=holiday.title,
            category="public_holiday",
            start_date=holiday.start_date,
            end_date=holiday.end_date,
            source=f"{THAILAND_HOLIDAYS_API}/{year}",
        )
        for holiday in holiday_response.holidays
    )
