from datetime import datetime, timedelta

from app.models.session import Session
from app.models.user import User
from app.services.auth_policy import AuthPolicy


def test_session_expires_after_idle_timeout():
    now = datetime(2026, 1, 10, 9, 0, 0)
    session = Session(
        session_id="sess-001",
        user_id="student-001",
        role="นักศึกษา",
        created_at=now,
        last_activity_at=now,
        expires_at=now + timedelta(minutes=120),
    )

    assert AuthPolicy.is_session_valid(session, now) is True
    expired_at = now + timedelta(minutes=121)
    assert AuthPolicy.is_session_valid(session, expired_at) is False


def test_lockout_blocks_login_after_5_failures_in_15_minutes():
    user = User(user_id="student-002", email="stu@university.ac.th", role="นักศึกษา")
    now = datetime(2026, 1, 10, 8, 0, 0)

    for _ in range(4):
        assert AuthPolicy.record_failed_login(user, now) is False
        assert AuthPolicy.can_attempt_login(user, now) is True

    assert AuthPolicy.record_failed_login(user, now) is True
    assert AuthPolicy.can_attempt_login(user, now) is False

    later = now + timedelta(minutes=16)
    assert AuthPolicy.can_attempt_login(user, later) is True
    assert user.failed_attempts == 0
    assert user.lock_until is None


def test_auth_policy_keeps_sensitive_data_out_of_public_payload():
    user = User(
        user_id="staff-001",
        email="staff@university.ac.th",
        role="เจ้าหน้าที่",
        password_hash="hash-not-plaintext",
    )

    public_payload = AuthPolicy.sanitize_user_record(user)
    assert public_payload["user_id"] == "staff-001"
    assert public_payload["role"] == "เจ้าหน้าที่"
    assert "password_hash" not in public_payload
