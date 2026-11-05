# AC-PAY-03: ค้นหารายการจ่ายเงินด้วย exact/partial filters (FR-PAY-01)
import json


def _authorize_payment_access(monkeypatch):
    from app import config

    monkeypatch.setattr(config, "APP_ENV", "test")
    monkeypatch.setattr(
        config,
        "PAYMENT_DEMO_AUTH_TOKENS",
        json.dumps({"demo-token": {"user_id": "hr-1", "role": "HR"}}),
    )
    return {"Authorization": "Bearer demo-token"}


def test_AC_PAY_03_searches_by_worker_id_exact_match(client, monkeypatch):
    headers = _authorize_payment_access(monkeypatch)

    response = client.get(
        "/payments",
        params={"worker_id": "MOCK-WORKER-001"},
        headers=headers,
    )

    assert response.status_code == 200
    assert [record["worker_id"] for record in response.json()] == ["MOCK-WORKER-001"]


def test_AC_PAY_03_searches_by_worker_name_partial_match(client, monkeypatch):
    headers = _authorize_payment_access(monkeypatch)

    response = client.get(
        "/payments",
        params={"worker_name": "Worker B"},
        headers=headers,
    )

    assert response.status_code == 200
    assert [record["worker_id"] for record in response.json()] == ["MOCK-WORKER-002"]


def test_AC_PAY_03_searches_by_payment_reference_exact_match(client, monkeypatch):
    headers = _authorize_payment_access(monkeypatch)

    response = client.get(
        "/payments",
        params={"payment_reference": "MOCK-REF-003"},
        headers=headers,
    )

    assert response.status_code == 200
    assert [record["payment_reference"] for record in response.json()] == ["MOCK-REF-003"]


def test_AC_PAY_03_requires_authorized_user(client):
    response = client.get("/payments")

    assert response.status_code == 401
