from collections.abc import Iterable

from app.payments.schemas import (
    FinanceStatus,
    PaymentRecord,
    PaymentTrackingRecord,
)


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
