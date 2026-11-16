from __future__ import annotations

from typing import Iterable

from app.models.application import ApplicationStatus, LabBoyApplication


# รองรับ FR-LB-04, FR-LB-05 และ NFR-REL-01
class ApplicationRepository:
    """เก็บใบสมัคร Lab Boy แบบ in-memory เพื่อรองรับ workflow บันทึกและตรวจซ้ำ (FR-LB-04, FR-LB-05, NFR-REL-01)."""

    def __init__(self, initial_applications: Iterable[LabBoyApplication] | None = None):
        self._applications: list[LabBoyApplication] = list(initial_applications or [])

    def list(self) -> list[LabBoyApplication]:
        return list(self._applications)

    def find_all(self) -> list[LabBoyApplication]:
        return self.list()

    def find_by_student_and_announcement(
        self,
        student_id: str,
        announcement_id: str,
    ) -> list[LabBoyApplication]:
        return [
            application
            for application in self._applications
            if application.student_id == student_id
            and application.announcement_id == announcement_id
        ]

    def count_active_by_announcement(self, announcement_id: str) -> int:
        return sum(
            1
            for application in self._applications
            if application.announcement_id == announcement_id
            and application.status not in {ApplicationStatus.WITHDRAWN, ApplicationStatus.REJECTED}
        )

    def save(self, application: LabBoyApplication) -> LabBoyApplication:
        if not isinstance(application, LabBoyApplication):
            raise TypeError("application must be LabBoyApplication")

        persisted_application = application
        if persisted_application.application_id is None:
            persisted_application = persisted_application.model_copy(
                update={"application_id": f"LAB-{persisted_application.student_id}-{len(self._applications) + 1}"}
            )

        self._applications.append(persisted_application)
        return persisted_application

    def create(self, application: LabBoyApplication) -> LabBoyApplication:
        return self.save(application)

    def clear(self) -> None:
        self._applications.clear()


InMemoryApplicationRepository = ApplicationRepository
