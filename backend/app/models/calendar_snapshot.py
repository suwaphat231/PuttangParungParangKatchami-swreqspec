from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


# รองรับ FR-CAL-02, FR-CAL-04 และ NFR-REL-01
class CalendarPeriod(BaseModel):
    model_config = ConfigDict(frozen=True)

    title: str
    category: Literal["registration", "exam", "academic_closure", "public_holiday"]
    start_date: date
    end_date: date
    source: str

    @model_validator(mode="after")
    def require_ordered_dates(self) -> "CalendarPeriod":
        if self.end_date < self.start_date:
            raise ValueError("calendar period end_date must not precede start_date")
        return self


# รองรับ FR-CAL-02, FR-CAL-04 และ NFR-REL-01
class ThailandHoliday(BaseModel):
    model_config = ConfigDict(frozen=True)

    title: str
    start_date: date
    end_date: date

    @model_validator(mode="after")
    def require_ordered_dates(self) -> "ThailandHoliday":
        if self.end_date < self.start_date:
            raise ValueError("holiday end_date must not precede start_date")
        return self


# รองรับ FR-CAL-02, FR-CAL-04 และ NFR-REL-01
class ThailandHolidayResponse(BaseModel):
    model_config = ConfigDict(frozen=True)

    year: int
    count: int = Field(ge=0)
    holidays: tuple[ThailandHoliday, ...]

    @model_validator(mode="after")
    def require_matching_count(self) -> "ThailandHolidayResponse":
        if self.count != len(self.holidays):
            raise ValueError("holiday count does not match the returned records")
        return self


# รองรับ FR-CAL-02, FR-CAL-04, AC-CAL-03 และ NFR-REL-01
class CalendarSnapshot(BaseModel):
    model_config = ConfigDict(frozen=True)

    academic_calendar_version: str
    academic_calendar_effective_date: date
    academic_calendar_source: str
    academic_periods: tuple[CalendarPeriod, ...]
    public_holiday_years: tuple[int, ...]
    public_holidays: tuple[CalendarPeriod, ...]
    retrieved_at: datetime

    @model_validator(mode="after")
    def require_timezone_aware_retrieval_time(self) -> "CalendarSnapshot":
        if self.retrieved_at.utcoffset() is None:
            raise ValueError("retrieved_at must include a timezone")
        return self
