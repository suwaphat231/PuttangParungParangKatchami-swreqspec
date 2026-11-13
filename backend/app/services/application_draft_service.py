from __future__ import annotations

import copy
from dataclasses import dataclass, field
from typing import Any


# รองรับ FR-LB-06
@dataclass(frozen=True)
class DraftValidationResult:
    """ผลตรวจสอบข้อมูลร่างสมัครก่อนยืนยัน (FR-LB-06)."""

    valid: bool
    missing_fields: list[str] = field(default_factory=list)
    reason: str | None = None


# รองรับ FR-LB-06
class ApplicationDraftService:
    """จัดการข้อมูลร่างก่อนยืนยันให้แก้ไขได้และยกเลิกได้โดยไม่สร้างใบสมัครที่ยังไม่สมบูรณ์ (FR-LB-06)."""

    REQUIRED_FIELDS = (
        "full_name",
        "student_id",
        "year_level",
        "email",
        "student_status",
        "grade",
        "emergency_contact",
    )

    def __init__(self) -> None:
        self._draft: dict[str, Any] = {}
        self._last_confirmed: dict[str, Any] = {}

    def start(self, initial_values: dict[str, Any] | None = None) -> dict[str, Any]:
        self._draft = copy.deepcopy(initial_values or {})
        self._last_confirmed = copy.deepcopy(self._draft)
        return self.snapshot()

    def snapshot(self) -> dict[str, Any]:
        return copy.deepcopy(self._draft)

    def update(self, values: dict[str, Any]) -> dict[str, Any]:
        self._draft.update(copy.deepcopy(values))
        return self.snapshot()

    def update_field(self, field_name: str, value: Any) -> dict[str, Any]:
        return self.update({field_name: value})

    def reset_to_last_confirmed(self) -> dict[str, Any]:
        self._draft = copy.deepcopy(self._last_confirmed)
        return self.snapshot()

    def cancel(self) -> dict[str, Any]:
        return self.reset_to_last_confirmed()

    def validate(self, values: dict[str, Any] | None = None) -> DraftValidationResult:
        working_copy = copy.deepcopy(values if values is not None else self._draft)
        missing_fields: list[str] = []
        for field_name in self.REQUIRED_FIELDS:
            value = working_copy.get(field_name)
            if value is None or (isinstance(value, str) and not value.strip()):
                missing_fields.append(field_name)

        if missing_fields:
            return DraftValidationResult(
                valid=False,
                missing_fields=missing_fields,
                reason="ข้อมูลจากบัญชีผู้ใช้ไม่ครบ",
            )

        return DraftValidationResult(
            valid=True,
            missing_fields=[],
            reason="พร้อมยืนยันการสมัคร",
        )

    def confirm(self, values: dict[str, Any] | None = None) -> DraftValidationResult:
        working_copy = copy.deepcopy(values if values is not None else self._draft)
        result = self.validate(working_copy)
        if not result.valid:
            return result

        self._draft = working_copy
        self._last_confirmed = copy.deepcopy(working_copy)
        return DraftValidationResult(
            valid=True,
            missing_fields=[],
            reason="ยืนยันการสมัครสำเร็จ",
        )


ApplicationDraft = ApplicationDraftService
