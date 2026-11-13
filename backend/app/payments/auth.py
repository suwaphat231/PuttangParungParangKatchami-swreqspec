# ตรวจสิทธิ์ผู้ใช้สำหรับ UC-16 ด้วย demo token ฝั่งเซิร์ฟเวอร์ (FR-PAY-04, NFR-SEC-01)
import hmac
import json
from dataclasses import dataclass
from json import JSONDecodeError

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app import config
from app.db.session import get_db
from app.payments.audit import record_payment_access

ALLOWED_ROLES = frozenset({"HR", "MANAGER", "EXECUTIVE"})
KNOWN_ROLES = ALLOWED_ROLES | frozenset({"STUDENT", "WORKER"})
bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class PaymentPrincipal:
    """ตัวตนที่ได้จาก server-side token mapping เท่านั้น (FR-PAY-04)."""

    user_id: str
    role: str


def _load_demo_tokens() -> dict[str, PaymentPrincipal]:
    """โหลด mapping เฉพาะ local/test และปฏิเสธ configuration ที่ผิดรูปแบบ (FR-PAY-04)."""
    if config.APP_ENV not in {"local", "test"} or not config.PAYMENT_DEMO_AUTH_TOKENS:
        return {}

    try:
        raw_mapping = json.loads(config.PAYMENT_DEMO_AUTH_TOKENS)
    except JSONDecodeError as error:
        raise RuntimeError("PAYMENT_DEMO_AUTH_TOKENS must contain a JSON object") from error

    if not isinstance(raw_mapping, dict):
        raise RuntimeError("PAYMENT_DEMO_AUTH_TOKENS must contain a JSON object")

    tokens: dict[str, PaymentPrincipal] = {}
    for token, identity in raw_mapping.items():
        role = identity.get("role") if isinstance(identity, dict) else None
        if (
            not isinstance(token, str)
            or not token
            or not isinstance(identity, dict)
            or not isinstance(identity.get("user_id"), str)
            or not identity["user_id"]
            or not isinstance(role, str)
            or role not in KNOWN_ROLES
        ):
            raise RuntimeError(
                "Each demo token must map to a non-empty user_id and a known role"
            )
        tokens[token] = PaymentPrincipal(user_id=identity["user_id"], role=role)
    return tokens


def _principal_for_token(token: str) -> PaymentPrincipal | None:
    """ค้น identity จาก token ที่ตั้งค่าฝั่งเซิร์ฟเวอร์โดยเปรียบเทียบแบบ constant-time (FR-PAY-04)."""
    for configured_token, principal in _load_demo_tokens().items():
        if hmac.compare_digest(token.encode("utf-8"), configured_token.encode("utf-8")):
            return principal
    return None


def get_payment_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> PaymentPrincipal:
    """อนุญาตเฉพาะ HR/Manager/Executive และบันทึกทุกผลการตรวจสิทธิ์ (FR-PAY-04, FR-PAY-05)."""
    token = credentials.credentials if credentials is not None else None
    principal = _principal_for_token(token) if token is not None else None

    if principal is None:
        record_payment_access(
            db,
            user_id=None,
            resource=request.url.path,
            authorization_result="DENIED",
        )
        raise HTTPException(status_code=401, detail="Invalid or missing payment credentials")

    if principal.role not in ALLOWED_ROLES:
        record_payment_access(
            db,
            user_id=principal.user_id,
            resource=request.url.path,
            authorization_result="DENIED",
        )
        raise HTTPException(status_code=403, detail="Not authorized to view payment data")

    record_payment_access(
        db,
        user_id=principal.user_id,
        resource=request.url.path,
        authorization_result="ALLOWED",
    )
    return principal
