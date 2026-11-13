# Migration แยกสำหรับ audit การเข้าถึงข้อมูลการจ่ายเงิน (FR-PAY-05, NFR-AUD-01)
from app.db.models import PaymentAuditLog


def upgrade(engine):
    """สร้างตาราง payment_audit_logs โดยไม่กระทบตาราง audit เดิม (FR-PAY-05)."""
    PaymentAuditLog.__table__.create(engine, checkfirst=True)
