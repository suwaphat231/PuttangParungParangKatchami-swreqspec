# AC-PAY-05: บันทึกการอนุญาต/ปฏิเสธลง payment audit table (FR-PAY-05, NFR-AUD-01)
import importlib
import json

from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, inspect

from app import config
from app.db.models import PaymentAuditLog
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


def test_AC_PAY_05_records_allowed_and_denied_access(db, monkeypatch):
    monkeypatch.setattr(config, "APP_ENV", "test")
    monkeypatch.setattr(
        config,
        "PAYMENT_DEMO_AUTH_TOKENS",
        json.dumps(
            {
                "allowed-token": {"user_id": "hr-1", "role": "HR"},
                "denied-token": {"user_id": "student-1", "role": "STUDENT"},
            }
        ),
    )
    client = _client(db)

    allowed = client.get(
        "/payments/payment-1",
        headers={"Authorization": "Bearer allowed-token"},
    )
    denied = client.get(
        "/payments/payment-2",
        headers={"Authorization": "Bearer denied-token"},
    )

    entries = db.query(PaymentAuditLog).order_by(PaymentAuditLog.id).all()
    assert allowed.status_code == 200
    assert denied.status_code == 403
    assert [
        (entry.user_id, entry.resource, entry.authorization_result)
        for entry in entries
    ] == [
        ("hr-1", "/payments/payment-1", "ALLOWED"),
        ("student-1", "/payments/payment-2", "DENIED"),
    ]
    assert all(entry.accessed_at is not None for entry in entries)
    assert not any("token" in column.name.lower() for column in PaymentAuditLog.__table__.columns)


def test_AC_PAY_05_records_unauthenticated_denial_with_unknown_user(db, monkeypatch):
    monkeypatch.setattr(config, "APP_ENV", "test")
    monkeypatch.setattr(config, "PAYMENT_DEMO_AUTH_TOKENS", json.dumps({}))
    client = _client(db)

    response = client.get("/payments/payment-3")

    entry = db.query(PaymentAuditLog).one()
    assert response.status_code == 401
    assert entry.user_id is None
    assert entry.resource == "/payments/payment-3"
    assert entry.authorization_result == "DENIED"
    assert entry.accessed_at is not None


def test_AC_PAY_05_migration_creates_payment_audit_table():
    engine = create_engine("sqlite://")
    migration = importlib.import_module("app.db.migrations.002_payment_audit_log")

    migration.upgrade(engine)

    assert "payment_audit_logs" in inspect(engine).get_table_names()


def test_AC_PAY_05_records_real_payment_api_access_results(client, db, monkeypatch):
    monkeypatch.setattr(config, "APP_ENV", "test")
    monkeypatch.setattr(
        config,
        "PAYMENT_DEMO_AUTH_TOKENS",
        json.dumps(
            {
                "allowed-token": {"user_id": "hr-1", "role": "HR"},
                "denied-token": {"user_id": "student-1", "role": "STUDENT"},
            }
        ),
    )

    responses = [
        client.get("/payments", headers={"Authorization": "Bearer allowed-token"}),
        client.get(
            "/payments/MOCK-PAY-001",
            headers={"Authorization": "Bearer allowed-token"},
        ),
        client.get(
            "/payments/follow-up",
            headers={"Authorization": "Bearer allowed-token"},
        ),
        client.get(
            "/payments",
            headers={"Authorization": "Bearer denied-token"},
        ),
        client.get("/payments"),
    ]

    entries = db.query(PaymentAuditLog).order_by(PaymentAuditLog.id).all()
    assert [response.status_code for response in responses] == [
        200,
        200,
        200,
        403,
        401,
    ]
    assert [
        (entry.user_id, entry.resource, entry.authorization_result)
        for entry in entries
    ] == [
        ("hr-1", "/payments", "ALLOWED"),
        ("hr-1", "/payments/MOCK-PAY-001", "ALLOWED"),
        ("hr-1", "/payments/follow-up", "ALLOWED"),
        ("student-1", "/payments", "DENIED"),
        (None, "/payments", "DENIED"),
    ]
    assert all(entry.accessed_at is not None for entry in entries)
    assert not any(
        "token" in column.name.lower()
        for column in PaymentAuditLog.__table__.columns
    )
