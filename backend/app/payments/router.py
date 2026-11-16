# Read-only API ค้นหารายการจ่ายเงิน (FR-PAY-01, FR-PAY-02)
from fastapi import APIRouter, Depends, HTTPException

from app.payments.auth import PaymentPrincipal, get_payment_user
from app.payments.schemas import PaymentRecord, PaymentTrackingRecord
from app.payments.service import (
    get_follow_up_payment_records,
    get_payment_tracking_record,
    search_payment_records,
)

router = APIRouter(prefix="/payments", tags=["payments"])


@router.get("", response_model=list[PaymentRecord])
def list_payments(
    worker_id: str | None = None,
    worker_name: str | None = None,
    payment_reference: str | None = None,
    user: PaymentPrincipal = Depends(get_payment_user),
) -> list[PaymentRecord]:
    """ค้นหารายการโดย exact match สำหรับ ID/reference และ partial match สำหรับชื่อ (FR-PAY-01)."""
    return list(
        search_payment_records(
            worker_id=worker_id,
            worker_name=worker_name,
            payment_reference=payment_reference,
        )
    )


@router.get("/follow-up", response_model=list[PaymentTrackingRecord])
def list_payment_follow_up(
    user: PaymentPrincipal = Depends(get_payment_user),
) -> list[PaymentTrackingRecord]:
    """คืนรายการ UNPAID/ABNORMAL ที่ต้องติดตามต่อแบบอ่านอย่างเดียว (FR-PAY-03)."""
    return list(get_follow_up_payment_records())


@router.get("/{payment_id}", response_model=PaymentTrackingRecord)
def read_payment_status(
    payment_id: str,
    user: PaymentPrincipal = Depends(get_payment_user),
) -> PaymentTrackingRecord:
    """คืนสถานะล่าสุดของรายการพร้อมยอดเงินและเวลาโดยไม่แก้ข้อมูล (FR-PAY-02)."""
    record = get_payment_tracking_record(payment_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Payment record not found")
    return record
