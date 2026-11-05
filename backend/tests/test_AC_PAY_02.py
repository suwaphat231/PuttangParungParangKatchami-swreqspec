from app.payments.mock_finance import get_mock_finance_records
from app.payments.schemas import FinanceStatus
from app.payments.service import build_tracking_records


# รองรับ FR-PAY-03 และ AC-PAY-02
def test_AC_PAY_02_marks_unpaid_and_abnormal_payments_for_follow_up():
    # Given มีรายการจำลองที่จ่ายแล้ว ยังไม่ได้จ่าย และผิดปกติ
    source_records = get_mock_finance_records()
    original_statuses = tuple(record.finance_status for record in source_records)

    # When สร้างผลตรวจรายการติดตาม
    tracking_records = build_tracking_records(source_records)

    # Then ยังไม่ได้จ่าย/ผิดปกติถูกทำเครื่องหมาย โดยไม่แก้สถานะต้นทาง
    flags_by_status = {
        record.finance_status: record.requires_follow_up
        for record in tracking_records
    }
    assert flags_by_status == {
        FinanceStatus.PAID: False,
        FinanceStatus.UNPAID: True,
        FinanceStatus.ABNORMAL: True,
    }
    assert tuple(record.finance_status for record in source_records) == original_statuses
