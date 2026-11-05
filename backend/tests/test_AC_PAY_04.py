# AC-PAY-04: จำกัดการเข้าถึงข้อมูลการจ่ายเงินตาม role (FR-PAY-04, NFR-SEC-01)
import json

import pytest
from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

from app import config
from app.db.session import get_db
from app.payments.auth import PaymentPrincipal, get_payment_user


def _client(db):
    app = FastAPI()

    @app.get("/payments/{payment_id}")
    def read_payment(
        payment_id: str,
        user: PaymentPrincipal = Depends(get_payment_user),
    ):
        return {"payment_id": payment_id, "user_id": user.user_id}

    app.dependency_overrides[get_db] = lambda: db
    return TestClient(app)


def _set_demo_auth(monkeypatch, identities, app_env="test"):
    monkeypatch.setattr(config, "APP_ENV", app_env)
    monkeypatch.setattr(config, "PAYMENT_DEMO_AUTH_TOKENS", json.dumps(identities))


@pytest.mark.parametrize(
    ("role", "user_id"),
    [("HR", "hr-1"), ("MANAGER", "manager-1"), ("EXECUTIVE", "executive-1")],
)
def test_AC_PAY_04_allows_authorized_roles(db, monkeypatch, role, user_id):
    _set_demo_auth(monkeypatch, {"demo-token": {"user_id": user_id, "role": role}})
    client = _client(db)

    response = client.get(
        "/payments/payment-1",
        headers={"Authorization": "Bearer demo-token"},
    )

    assert response.status_code == 200
    assert response.json() == {"payment_id": "payment-1", "user_id": user_id}


def test_AC_PAY_04_allows_local_demo_tokens(db, monkeypatch):
    _set_demo_auth(
        monkeypatch,
        {"demo-token": {"user_id": "hr-1", "role": "HR"}},
        app_env="local",
    )
    client = _client(db)

    response = client.get(
        "/payments/payment-1",
        headers={"Authorization": "Bearer demo-token"},
    )

    assert response.status_code == 200


@pytest.mark.parametrize(
    ("role", "user_id"),
    [("STUDENT", "student-1"), ("WORKER", "worker-1")],
)
def test_AC_PAY_04_denies_unauthorized_roles(db, monkeypatch, role, user_id):
    _set_demo_auth(monkeypatch, {"demo-token": {"user_id": user_id, "role": role}})
    client = _client(db)

    response = client.get(
        "/payments/payment-1",
        headers={"Authorization": "Bearer demo-token"},
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to view payment data"


def test_AC_PAY_04_disables_demo_tokens_outside_local_and_test(db, monkeypatch):
    _set_demo_auth(
        monkeypatch,
        {"demo-token": {"user_id": "hr-1", "role": "HR"}},
        app_env="production",
    )
    client = _client(db)

    response = client.get(
        "/payments/payment-1",
        headers={"Authorization": "Bearer demo-token"},
    )

    assert response.status_code == 401


def test_AC_PAY_04_does_not_accept_role_from_request(db, monkeypatch):
    _set_demo_auth(monkeypatch, {}, app_env="test")
    client = _client(db)

    response = client.get("/payments/payment-1", headers={"X-Role": "HR"})

    assert response.status_code == 401
