from sqlalchemy.orm import Session

from app.db.models import StudentVerification


def record_verification(
    db: Session,
    student_id: str,
    student_name: str,
    student_status: str,
) -> StudentVerification | None:
    if not student_id or not student_name or not student_status:
        return None

    verification = StudentVerification(
        student_id=student_id,
        student_name=student_name,
        student_status=student_status,
    )
    db.add(verification)
    db.commit()
    db.refresh(verification)
    return verification