# บันทึกการอนุญาตและปฏิเสธการเข้าถึงข้อมูลการจ่ายเงิน (FR-PAY-05, NFR-AUD-01)
from sqlalchemy.orm import Session

from app.db.models import PaymentAuditLog


def record_payment_access(
    db: Session,
    *,
    user_id: str | None,
    resource: str,
    authorization_result: str,
) -> PaymentAuditLog:
    """บันทึกผู้ใช้ เวลา resource และผลตรวจสิทธิ์ลง payment audit log (FR-PAY-05)."""
    if authorization_result not in {"ALLOWED", "DENIED"}:
        raise ValueError("authorization_result must be ALLOWED or DENIED")

    entry = PaymentAuditLog(
        user_id=user_id,
        resource=resource,
        authorization_result=authorization_result,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry
