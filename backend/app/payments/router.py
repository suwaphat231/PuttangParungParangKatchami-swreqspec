# Read-only API ค้นหารายการจ่ายเงิน (FR-PAY-01, FR-PAY-02)
from fastapi import APIRouter, Depends

from app.payments.auth import PaymentPrincipal, get_payment_user
from app.payments.schemas import PaymentRecord
from app.payments.service import search_payment_records

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
