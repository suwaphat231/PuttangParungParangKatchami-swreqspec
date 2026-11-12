from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# รองรับ FR-CAL-01 และ AC-CAL-01
class CalendarCheckRequest(BaseModel):
    model_config = ConfigDict(frozen=True, populate_by_name=True)

    start_date: datetime = Field(alias="startDate")
    end_date: datetime = Field(alias="endDate")
