from datetime import datetime
from decimal import Decimal
from enum import StrEnum
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


# รองรับ FR-PAY-02 และ ASM-01
class FinanceStatus(StrEnum):
    PAID = "PAID"
    UNPAID = "UNPAID"
    ABNORMAL = "ABNORMAL"


# รองรับ FR-PAY-01, FR-PAY-02 และ ASM-01
class PaymentRecord(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    payment_id: str
    worker_id: str
    worker_name: str
    payment_reference: str
    amount: Decimal = Field(ge=0)
    currency: str
    finance_status: FinanceStatus
    status_updated_at: datetime
    last_synced_at: datetime
    data_source: Literal["MOCK"]

    @field_validator("status_updated_at", "last_synced_at")
    @classmethod
    def require_timezone(cls, value: datetime) -> datetime:
        if value.utcoffset() is None:
            raise ValueError("timestamp must include a timezone")
        return value
