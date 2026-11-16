from collections.abc import Iterable

from app.payments.schemas import (
    FinanceStatus,
    PaymentRecord,
    PaymentTrackingRecord,
)
from app.payments.mock_finance import get_mock_finance_records


# รองรับ FR-PAY-03 และ AC-PAY-02
def build_tracking_records(
    payments: Iterable[PaymentRecord],
) -> tuple[PaymentTrackingRecord, ...]:
    """เพิ่ม flag ติดตามโดยไม่แก้ไขข้อมูลต้นทาง."""
    follow_up_statuses = {FinanceStatus.UNPAID, FinanceStatus.ABNORMAL}
    return tuple(
        PaymentTrackingRecord(
            **payment.model_dump(),
            requires_follow_up=payment.finance_status in follow_up_statuses,
        )
        for payment in payments
    )


# รองรับ FR-PAY-01, FR-PAY-02 และ AC-PAY-03
def search_payment_records(
    *,
    worker_id: str | None = None,
    worker_name: str | None = None,
    payment_reference: str | None = None,
) -> tuple[PaymentRecord, ...]:
    """ค้นหารายการจาก Mock Finance Data ตามตัวกรองที่กำหนด โดยไม่แก้ไขข้อมูล."""
    records = get_mock_finance_records()
    if worker_id is not None:
        records = tuple(record for record in records if record.worker_id == worker_id)
    if worker_name is not None:
        records = tuple(record for record in records if worker_name in record.worker_name)
    if payment_reference is not None:
        records = tuple(
            record for record in records
            if record.payment_reference == payment_reference
        )
    return records


# รองรับ FR-PAY-02, FR-PAY-03, AC-PAY-01 และ AC-PAY-02
def get_payment_tracking_record(payment_id: str) -> PaymentTrackingRecord | None:
    """อ่านสถานะล่าสุดของรายการที่ระบุและเพิ่ม flag ติดตามโดยไม่แก้ข้อมูลต้นทาง."""
    for record in build_tracking_records(get_mock_finance_records()):
        if record.payment_id == payment_id:
            return record
    return None


# รองรับ FR-PAY-03 และ AC-PAY-02
def get_follow_up_payment_records() -> tuple[PaymentTrackingRecord, ...]:
    """คืนเฉพาะรายการ UNPAID/ABNORMAL ที่ต้องติดตามต่อ."""
    return tuple(
        record
        for record in build_tracking_records(get_mock_finance_records())
        if record.requires_follow_up
    )
