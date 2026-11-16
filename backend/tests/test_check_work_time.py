from datetime import datetime
from time import perf_counter

import httpx
import pytest
from pydantic import ValidationError

from app.models.calendar_snapshot import (
    CalendarPeriod,
    CalendarSnapshot,
)
from app.services.calendar_source import (
    CalendarSourceUnavailable,
    load_calendar_snapshot,
)
from app.services.calendar_check_service import (
    build_calendar_check_response,
    parse_calendar_check_request,
)
from app.services.calendar_overlap_service import check_calendar_overlap


# รองรับ AC-CAL-01
def test_AC_CAL_01_accepts_start_and_end_dates():
    request = parse_calendar_check_request(
        {
            "startDate": "2026-09-21T09:00:00",
            "endDate": "2026-09-21T17:00:00",
        }
    )

    assert request.start_date == datetime(2026, 9, 21, 9, 0)
    assert request.end_date == datetime(2026, 9, 21, 17, 0)


# รองรับ AC-CAL-01
@pytest.mark.parametrize(
    "payload",
    [
        {"endDate": "2026-09-21T17:00:00"},
        {"startDate": "2026-09-21T09:00:00"},
        {"startDate": "not-a-date", "endDate": "2026-09-21T17:00:00"},
        {"startDate": "2026-09-21T09:00:00", "endDate": "not-a-date"},
    ],
)
def test_AC_CAL_01_rejects_missing_or_malformed_dates(payload):
    with pytest.raises(ValidationError):
        parse_calendar_check_request(payload)


# รองรับ FR-CAL-02, FR-CAL-04, AC-CAL-03 และ NFR-REL-01
def test_T02_loads_current_calendar_sources_for_each_requested_year():
    def respond(request):
        year = int(request.url.path.rsplit("/", maxsplit=1)[-1])
        return httpx.Response(
            200,
            json={
                "year": year,
                "count": 1,
                "holidays": [
                    {
                        "title": "New Year's Day",
                        "start_date": f"{year}-01-01",
                        "end_date": f"{year}-01-01",
                    }
                ],
            },
        )

    request = parse_calendar_check_request(
        {
            "startDate": "2026-12-31T09:00:00",
            "endDate": "2027-01-02T17:00:00",
        }
    )

    with httpx.Client(transport=httpx.MockTransport(respond)) as client:
        snapshot = load_calendar_snapshot(request, client)

    assert snapshot.public_holiday_years == (2026, 2027)
    assert len(snapshot.public_holidays) == 2
    assert snapshot.academic_calendar_version.endswith("2569")
    assert snapshot.academic_periods
    assert snapshot.retrieved_at.utcoffset() is not None


# รองรับ FR-CAL-04, AC-CAL-03 และ NFR-REL-01
def test_AC_CAL_03_rejects_unavailable_public_holiday_source():
    client = httpx.Client(
        transport=httpx.MockTransport(
            lambda request: httpx.Response(503, json={"error": "unavailable"})
        )
    )
    request = parse_calendar_check_request(
        {
            "startDate": "2026-07-06T09:00:00",
            "endDate": "2026-07-06T17:00:00",
        }
    )

    with client:
        with pytest.raises(CalendarSourceUnavailable):
            load_calendar_snapshot(request, client)


# รองรับ FR-CAL-04, AC-CAL-03 และ NFR-REL-01
@pytest.mark.parametrize(
    "payload",
    [
        {"year": 2025, "count": 0, "holidays": []},
        {"year": 2026, "count": 1, "holidays": []},
        {
            "year": 2026,
            "count": 1,
            "holidays": [
                {
                    "title": "New Year's Day",
                    "start_date": "2025-01-01",
                    "end_date": "2025-01-01",
                }
            ],
        },
    ],
)
def test_AC_CAL_03_rejects_unverified_public_holiday_data(payload):
    client = httpx.Client(
        transport=httpx.MockTransport(
            lambda request: httpx.Response(200, json=payload)
        )
    )
    request = parse_calendar_check_request(
        {
            "startDate": "2026-07-06T09:00:00",
            "endDate": "2026-07-06T17:00:00",
        }
    )

    with client:
        with pytest.raises(CalendarSourceUnavailable):
            load_calendar_snapshot(request, client)


# รองรับ FR-CAL-04, AC-CAL-03 และ NFR-REL-01
@pytest.mark.parametrize(
    ("start_date", "end_date"),
    [
        ("2026-06-21T09:00:00", "2026-06-21T17:00:00"),
        ("2027-07-06T09:00:00", "2027-07-06T17:00:00"),
    ],
)
def test_AC_CAL_03_rejects_dates_without_an_available_academic_calendar(
    start_date, end_date
):
    request = parse_calendar_check_request(
        {"startDate": start_date, "endDate": end_date}
    )

    with pytest.raises(CalendarSourceUnavailable):
        load_calendar_snapshot(request)


# รองรับ FR-CAL-03 และ AC-CAL-02
def _calendar_snapshot(
    *,
    academic_periods: tuple[CalendarPeriod, ...] = (),
    public_holidays: tuple[CalendarPeriod, ...] = (),
):
    return CalendarSnapshot(
        academic_calendar_version="Silpakorn academic calendar 2569",
        academic_calendar_effective_date="2025-11-18",
        academic_calendar_source="https://reg5.su.ac.th/Download/ruleAttachment/calendar2569.pdf",
        academic_periods=tuple(academic_periods),
        public_holiday_years=(2026,),
        public_holidays=tuple(public_holidays),
        retrieved_at="2026-11-12T00:00:00Z",
    )


# รองรับ FR-CAL-03, AC-CAL-02 และ NFR-REL-01
def test_AC_CAL_02_fails_on_partial_overlap_with_academic_period():
    request = parse_calendar_check_request(
        {
            "startDate": "2026-08-21T23:00:00",
            "endDate": "2026-08-22T01:00:00",
        }
    )
    snapshot = _calendar_snapshot(
        academic_periods=(
            CalendarPeriod(
                title="Midterm examination period",
                category="exam",
                start_date="2026-08-22",
                end_date="2026-09-05",
                source="official academic calendar",
            ),
        )
    )

    result = check_calendar_overlap(request, snapshot)

    assert result.status == "FAIL"
    assert "Midterm examination period" in result.reason
    assert len(result.overlaps) == 1


# รองรับ FR-CAL-03, AC-CAL-02 และ NFR-REL-01
def test_AC_CAL_02_fails_for_a_part_day_public_holiday_overlap():
    request = parse_calendar_check_request(
        {
            "startDate": "2026-07-06T16:00:00",
            "endDate": "2026-07-06T17:00:00",
        }
    )
    snapshot = _calendar_snapshot(
        public_holidays=(
            CalendarPeriod(
                title="Public holiday",
                category="public_holiday",
                start_date="2026-07-06",
                end_date="2026-07-06",
                source="ThailandFormats API",
            ),
        )
    )

    result = check_calendar_overlap(request, snapshot)

    assert result.status == "FAIL"
    assert result.overlaps[0].category == "public_holiday"


# รองรับ FR-CAL-03, AC-CAL-02 และ NFR-REL-01
def test_AC_CAL_02_passes_when_request_does_not_overlap_blocked_periods():
    request = parse_calendar_check_request(
        {
            "startDate": "2026-07-21T09:00:00",
            "endDate": "2026-07-21T17:00:00",
        }
    )
    snapshot = _calendar_snapshot(
        academic_periods=(
            CalendarPeriod(
                title="Registration/add-drop period",
                category="registration",
                start_date="2026-07-06",
                end_date="2026-07-20",
                source="official academic calendar",
            ),
        )
    )

    result = check_calendar_overlap(request, snapshot)

    assert result.status == "PASS"
    assert result.overlaps == ()


# รองรับ FR-CAL-05, AC-CAL-04 และ NFR-INT-01
def test_AC_CAL_04_returns_pass_response_with_calendar_reference():
    request = parse_calendar_check_request(
        {
            "startDate": "2026-07-21T09:00:00",
            "endDate": "2026-07-21T17:00:00",
        }
    )
    snapshot = _calendar_snapshot()
    result = check_calendar_overlap(request, snapshot)

    response = build_calendar_check_response(result, snapshot)

    assert response["status"] == "PASS"
    assert response["reason"]
    assert "calendarVersion" in response
    assert response["calendarVersion"] == "12.11.2026"
    assert "effectiveDate" in response
    assert response["effectiveDate"] == "2026-11-12T00:00:00Z"


# รองรับ FR-CAL-05, AC-CAL-05 และ NFR-INT-01
def test_AC_CAL_05_serializes_fail_response_using_json_contract():
    request = parse_calendar_check_request(
        {
            "startDate": "2026-07-06T16:00:00",
            "endDate": "2026-07-06T17:00:00",
        }
    )
    snapshot = _calendar_snapshot(
        public_holidays=(
            CalendarPeriod(
                title="Public holiday",
                category="public_holiday",
                start_date="2026-07-06",
                end_date="2026-07-06",
                source="ThailandFormats API",
            ),
        )
    )
    result = check_calendar_overlap(request, snapshot)

    response = build_calendar_check_response(result, snapshot)

    assert set(response) == {"status", "reason", "calendarVersion", "effectiveDate"}
    assert response["status"] == "FAIL"
    assert "Public holiday" in response["reason"]
    assert response["calendarVersion"] == "12.11.2026"
    assert response["effectiveDate"] == "2026-11-12T00:00:00Z"


# รองรับ FR-CAL-01, FR-CAL-05 และ NFR-INT-01
def test_T05_calendar_endpoint_returns_response_json(client, monkeypatch):
    from app import router as calendar_router

    snapshot = _calendar_snapshot()
    monkeypatch.setattr(
        calendar_router,
        "load_calendar_snapshot",
        lambda request: snapshot,
    )

    response = client.post(
        "/calendar/check",
        json={
            "startDate": "2026-07-21T09:00:00",
            "endDate": "2026-07-21T17:00:00",
        },
    )

    assert response.status_code == 200
    assert set(response.json()) == {
        "status",
        "reason",
        "calendarVersion",
        "effectiveDate",
    }
    assert response.json()["status"] == "PASS"


# รองรับ FR-CAL-04, FR-CAL-05, AC-CAL-03 และ NFR-REL-01
def test_T05_calendar_endpoint_returns_fail_when_source_is_unavailable(
    client, monkeypatch
):
    from app import router as calendar_router

    def unavailable(request):
        raise CalendarSourceUnavailable("calendar source unavailable")

    monkeypatch.setattr(calendar_router, "load_calendar_snapshot", unavailable)

    response = client.post(
        "/calendar/check",
        json={
            "startDate": "2026-07-21T09:00:00",
            "endDate": "2026-07-21T17:00:00",
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "FAIL"
    assert "calendar source unavailable" in response.json()["reason"]
    assert response.json()["calendarVersion"]
    assert response.json()["effectiveDate"]


# รองรับ FR-CAL-01 และ AC-CAL-01 ผ่าน API endpoint จริงของระบบ.
def test_AC_CAL_01_endpoint_accepts_and_processes_requested_period(client, monkeypatch):
    from app import router as calendar_router

    monkeypatch.setattr(
        calendar_router,
        "load_calendar_snapshot",
        lambda request: _calendar_snapshot(),
    )

    response = client.post(
        "/calendar/check",
        json={
            "startDate": "2026-07-21T09:00:00",
            "endDate": "2026-07-21T17:00:00",
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "PASS"


# รองรับ FR-CAL-03 และ AC-CAL-02 ผ่าน API endpoint จริงของระบบ.
def test_AC_CAL_02_endpoint_fails_for_an_overlapping_academic_period(
    client, monkeypatch
):
    from app import router as calendar_router

    snapshot = _calendar_snapshot(
        academic_periods=(
            CalendarPeriod(
                title="Examination period",
                category="exam",
                start_date="2026-07-21",
                end_date="2026-07-25",
                source="official academic calendar",
            ),
        )
    )
    monkeypatch.setattr(
        calendar_router,
        "load_calendar_snapshot",
        lambda request: snapshot,
    )

    response = client.post(
        "/calendar/check",
        json={
            "startDate": "2026-07-21T09:00:00",
            "endDate": "2026-07-21T17:00:00",
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "FAIL"
    assert "Examination period" in response.json()["reason"]


# รองรับ FR-CAL-04, AC-CAL-03 และ NFR-REL-01 ผ่าน API endpoint จริงของระบบ.
def test_AC_CAL_03_endpoint_never_passes_when_calendar_source_is_unavailable(
    client, monkeypatch
):
    from app import router as calendar_router

    def unavailable(request):
        raise CalendarSourceUnavailable("calendar source unavailable")

    monkeypatch.setattr(calendar_router, "load_calendar_snapshot", unavailable)

    response = client.post(
        "/calendar/check",
        json={
            "startDate": "2026-07-21T09:00:00",
            "endDate": "2026-07-21T17:00:00",
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "FAIL"
    assert response.json()["status"] != "PASS"
    assert "calendar source unavailable" in response.json()["reason"]


# รองรับ FR-CAL-03, FR-CAL-05, AC-CAL-04 และ NFR-INT-01.
def test_AC_CAL_04_endpoint_returns_pass_for_an_allowed_period(client, monkeypatch):
    from app import router as calendar_router

    monkeypatch.setattr(
        calendar_router,
        "load_calendar_snapshot",
        lambda request: _calendar_snapshot(),
    )

    response = client.post(
        "/calendar/check",
        json={
            "startDate": "2026-07-21T09:00:00",
            "endDate": "2026-07-21T17:00:00",
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "PASS"
    assert "ไม่ทับซ้อน" in response.json()["reason"]


# รองรับ FR-CAL-05, AC-CAL-05 และ NFR-INT-01 ผ่าน API endpoint จริงของระบบ.
def test_AC_CAL_05_endpoint_returns_the_json_contract(client, monkeypatch):
    from app import router as calendar_router

    monkeypatch.setattr(
        calendar_router,
        "load_calendar_snapshot",
        lambda request: _calendar_snapshot(),
    )

    response = client.post(
        "/calendar/check",
        json={
            "startDate": "2026-07-21T09:00:00",
            "endDate": "2026-07-21T17:00:00",
        },
    )

    assert response.status_code == 200
    assert set(response.json()) == {
        "status",
        "reason",
        "calendarVersion",
        "effectiveDate",
    }


# รองรับ NFR-PERF-01 ด้วย benchmark end-to-end รวม ThailandFormats API จริง.
@pytest.mark.parametrize("attempt", [1, 2, 3])
def test_NFR_PERF_01_live_calendar_check_completes_within_500ms(client, attempt):
    started_at = perf_counter()

    response = client.post(
        "/calendar/check",
        json={
            "startDate": "2026-07-21T09:00:00",
            "endDate": "2026-07-21T17:00:00",
        },
    )

    elapsed_ms = (perf_counter() - started_at) * 1000
    assert response.status_code == 200
    assert response.json()["status"] in {"PASS", "FAIL"}
    assert elapsed_ms <= 500, f"Live calendar check took {elapsed_ms:.1f} ms on attempt {attempt}"
