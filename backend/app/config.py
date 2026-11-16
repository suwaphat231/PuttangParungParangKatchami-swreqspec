# อ่านค่าตั้งระบบจากตัวแปรสภาพแวดล้อม (CON-TECH-01)
import os

# ระบบจริงตั้ง DATABASE_URL เป็น PostgreSQL ตาม CON-TECH-01
# เช่น postgresql+psycopg://user:pass@db:5432/checkup
# ค่าเริ่มต้นเป็น SQLite ไว้ลองรันใน Codespace เท่านั้น
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

# ปิด demo authentication เป็นค่าเริ่มต้น; เปิดได้เฉพาะ local/test (FR-PAY-04)
APP_ENV = os.getenv("APP_ENV", "production").lower()
PAYMENT_DEMO_AUTH_TOKENS = os.getenv("PAYMENT_DEMO_AUTH_TOKENS")
