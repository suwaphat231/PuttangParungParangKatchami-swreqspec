"""FastAPI application entry point."""

from fastapi import FastAPI

from app.router import router as uc13_router

app = FastAPI()
app.include_router(uc13_router)