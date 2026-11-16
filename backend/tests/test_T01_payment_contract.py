from decimal import Decimal
from zoneinfo import ZoneInfo

import pytest
from pydantic import ValidationError

from app.payments.mock_finance import get_mock_finance_records
from app.payments.schemas import FinanceStatus


# รองรับ FR-PAY-01, FR-PAY-02 และ ASM-01
def test_mock_finance_provider_has_complete_labeled_contract():
    records = get_mock_finance_records()

    assert {record.finance_status for record in records} == {
        FinanceStatus.PAID,
        FinanceStatus.UNPAID,
        FinanceStatus.ABNORMAL,
    }

    for record in records:
        assert record.data_source == "MOCK"
        assert record.payment_id
        assert record.worker_id
        assert record.worker_name
        assert record.payment_reference
        assert record.amount > Decimal("0")
        assert record.currency == "THB"
        assert record.status_updated_at.tzinfo == ZoneInfo("Asia/Bangkok")
        assert record.last_synced_at.tzinfo == ZoneInfo("Asia/Bangkok")


# รองรับ ASM-01: Mock Finance Data เป็นข้อมูลอ่านอย่างเดียว
def test_mock_finance_record_is_immutable():
    record = get_mock_finance_records()[0]

    with pytest.raises(ValidationError):
        record.amount = Decimal("1.00")
