from datetime import datetime
from decimal import Decimal
from zoneinfo import ZoneInfo

from app.payments.schemas import FinanceStatus, PaymentRecord

_MOCK_TIMEZONE = ZoneInfo("Asia/Bangkok")


# รองรับ FR-PAY-02 และ ASM-01
def _mock_timestamp(day: int, hour: int) -> datetime:
    return datetime(2026, 10, day, hour, 0, tzinfo=_MOCK_TIMEZONE)


# รองรับ FR-PAY-01, FR-PAY-02 และ ASM-01; records เป็นข้อมูลสาธิต ไม่ใช่ข้อมูลจากระบบเงินจริง
MOCK_FINANCE_DATA: tuple[PaymentRecord, ...] = (
    PaymentRecord(
        payment_id="MOCK-PAY-001",
        worker_id="MOCK-WORKER-001",
        worker_name="Mock Worker A",
        payment_reference="MOCK-REF-001",
        amount=Decimal("15000.00"),
        currency="THB",
        finance_status=FinanceStatus.PAID,
        status_updated_at=_mock_timestamp(1, 9),
        last_synced_at=_mock_timestamp(1, 9),
        data_source="MOCK",
    ),
    PaymentRecord(
        payment_id="MOCK-PAY-002",
        worker_id="MOCK-WORKER-002",
        worker_name="Mock Worker B",
        payment_reference="MOCK-REF-002",
        amount=Decimal("12000.00"),
        currency="THB",
        finance_status=FinanceStatus.UNPAID,
        status_updated_at=_mock_timestamp(2, 10),
        last_synced_at=_mock_timestamp(2, 10),
        data_source="MOCK",
    ),
    PaymentRecord(
        payment_id="MOCK-PAY-003",
        worker_id="MOCK-WORKER-003",
        worker_name="Mock Worker C",
        payment_reference="MOCK-REF-003",
        amount=Decimal("8000.00"),
        currency="THB",
        finance_status=FinanceStatus.ABNORMAL,
        status_updated_at=_mock_timestamp(3, 11),
        last_synced_at=_mock_timestamp(3, 11),
        data_source="MOCK",
    ),
)


# รองรับ FR-PAY-01, FR-PAY-02 และ ASM-01
def get_mock_finance_records() -> tuple[PaymentRecord, ...]:
    """คืนข้อมูลสาธิตแบบอ่านอย่างเดียว โดยระบุชัดว่าเป็น Mock Finance Data."""
    return MOCK_FINANCE_DATA
