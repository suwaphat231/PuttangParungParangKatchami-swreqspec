from __future__ import annotations

from fastapi import Request
from starlette.responses import JSONResponse


# รองรับ NFR-SEC-01
def is_secure_request(request: Request) -> bool:
    """ตรวจว่าคำขอใช้ transport ที่เข้ารหัสหรือเป็น local development (NFR-SEC-01)."""
    scheme = request.url.scheme.lower()
    if scheme == "https":
        return True

    forwarded = request.headers.get("x-forwarded-proto", "")
    if forwarded:
        return any(part.strip().lower() == "https" for part in forwarded.split(","))

    client_host = request.client.host if request.client else ""
    return client_host in {"localhost", "127.0.0.1", "::1"}


# รองรับ NFR-SEC-01
async def require_secure_transport(request: Request, call_next):
    """ปฏิเสธคำขอที่ไม่ใช้ HTTPS ยกเว้น localhost สำหรับ dev (NFR-SEC-01)."""
    if request.method not in {"GET", "HEAD", "OPTIONS"} and not is_secure_request(request):
        return JSONResponse(
            status_code=426,
            content={
                "error": "secure_channel_required",
                "message": "การส่งข้อมูลต้องใช้ HTTPS หรือช่องทางที่เข้ารหัส",
            },
        )
    return await call_next(request)
