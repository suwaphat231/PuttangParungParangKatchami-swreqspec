# AC-PAY-01: อ่านสถานะล่าสุดและข้อมูลการเงินพร้อม timezone (FR-PAY-02)
import json

from app import config
from app.payments.mock_finance import get_mock_finance_records


def _authorize_payment_access(monkeypatch):
    monkeypatch.setattr(config, "APP_ENV", "test")
    monkeypatch.setattr(
        config,
        "PAYMENT_DEMO_AUTH_TOKENS",
        json.dumps({"demo-token": {"user_id": "hr-1", "role": "HR"}}),
    )
    return {"Authorization": "Bearer demo-token"}


def test_AC_PAY_01_returns_latest_status_amount_currency_and_timezone(
    client,
    monkeypatch,
):
    headers = _authorize_payment_access(monkeypatch)
    original_records = get_mock_finance_records()

    response = client.get("/payments/MOCK-PAY-001", headers=headers)

    assert response.status_code == 200
    record = response.json()
    assert record["payment_id"] == "MOCK-PAY-001"
    assert record["finance_status"] == "PAID"
    assert record["amount"] == "15000.00"
    assert record["currency"] == "THB"
    assert record["status_updated_at"].endswith("+07:00")
    assert record["last_synced_at"].endswith("+07:00")
    assert record["data_source"] == "MOCK"
    assert record["requires_follow_up"] is False
    assert get_mock_finance_records() == original_records


def test_AC_PAY_01_returns_not_found_for_unknown_payment(client, monkeypatch):
    headers = _authorize_payment_access(monkeypatch)

    response = client.get("/payments/unknown", headers=headers)

    assert response.status_code == 404


def test_AC_PAY_01_requires_authorized_user(client):
    response = client.get("/payments/MOCK-PAY-001")

    assert response.status_code == 401


def test_AC_PAY_01_status_endpoint_is_read_only(client, monkeypatch):
    headers = _authorize_payment_access(monkeypatch)

    response = client.put(
        "/payments/MOCK-PAY-001",
        json={"finance_status": "UNPAID", "amount": 1},
        headers=headers,
    )

    assert response.status_code == 405
