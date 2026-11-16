# สร้าง FastAPI app และรวม router (T-02, T-03)
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.middleware.security import require_secure_transport
from app.router import router as calendar_router
from app.booking.router import router as booking_router
from app.db.models import Base
from app.db.session import engine
from app.payments.router import router as payments_router
from app.slots.router import router as slots_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """สร้างตารางเมื่อเปิดหลังบ้าน (ใช้ migration 001_init แบบย่อ)"""
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title="ระบบสมัคร Labboy", lifespan=lifespan)
app.middleware("http")(require_secure_transport)
app.include_router(calendar_router)
app.include_router(slots_router)
app.include_router(booking_router)
app.include_router(payments_router)
