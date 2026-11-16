import json

from app import config
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


def test_AC_PAY_02_api_returns_only_unpaid_and_abnormal_records(client, monkeypatch):
    # Given มีรายการจำลองที่จ่ายแล้ว ยังไม่ได้จ่าย และผิดปกติ
    monkeypatch.setattr(config, "APP_ENV", "test")
    monkeypatch.setattr(
        config,
        "PAYMENT_DEMO_AUTH_TOKENS",
        json.dumps({"demo-token": {"user_id": "manager-1", "role": "MANAGER"}}),
    )
    original_records = get_mock_finance_records()

    # When ผู้มีสิทธิ์อ่านรายการติดตามผ่าน API
    response = client.get(
        "/payments/follow-up",
        headers={"Authorization": "Bearer demo-token"},
    )

    # Then มีเฉพาะ UNPAID/ABNORMAL และข้อมูลต้นทางไม่เปลี่ยน
    assert response.status_code == 200
    records = response.json()
    assert {record["finance_status"] for record in records} == {"UNPAID", "ABNORMAL"}
    assert {record["payment_id"] for record in records} == {
        "MOCK-PAY-002",
        "MOCK-PAY-003",
    }
    assert all(record["requires_follow_up"] is True for record in records)
    assert all(record["data_source"] == "MOCK" for record in records)
    assert get_mock_finance_records() == original_records


def test_AC_PAY_02_follow_up_endpoint_is_read_only(client, monkeypatch):
    monkeypatch.setattr(config, "APP_ENV", "test")
    monkeypatch.setattr(
        config,
        "PAYMENT_DEMO_AUTH_TOKENS",
        json.dumps({"demo-token": {"user_id": "manager-1", "role": "MANAGER"}}),
    )

    response = client.post(
        "/payments/follow-up",
        json={"finance_status": "PAID"},
        headers={"Authorization": "Bearer demo-token"},
    )

    assert response.status_code == 405


def test_AC_PAY_02_requires_authorized_user_for_follow_up_api(client):
    response = client.get("/payments/follow-up")

    assert response.status_code == 401
