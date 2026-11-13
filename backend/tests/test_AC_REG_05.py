from app.db.models import StudentVerification
from app.student_status.service import record_verification


def test_TC_REG_05_1_records_student_verification(db):
    # Given ระบบทะเบียนส่งข้อมูลนักศึกษา ได้แก่ รหัสนักศึกษา ชื่อนักศึกษา และสถานะนักศึกษา
    student_id = "66010001"
    student_name = "สมชาย ใจดี"
    student_status = "ปกติ"

    # When บันทึกผลการตรวจสอบ
    record_verification(db, student_id, student_name, student_status)

    # Then ระบบบันทึกรหัสนักศึกษา
    saved = db.query(StudentVerification).one()
    assert saved.student_id == student_id
    # Then ระบบบันทึกชื่อนักศึกษา
    assert saved.student_name == student_name
    # Then ระบบบันทึกสถานะของนักศึกษา
    assert saved.student_status == student_status


def test_TC_REG_05_2_records_boundary_student_data(db):
    # Given ระบบทะเบียนส่งข้อมูลนักศึกษาที่มีค่าขอบเขต (spec ไม่ได้บอกว่าค่าขอบเขตคืออะไร)
    student_id = "1"
    student_name = "ก"
    student_status = "ปกติ"

    # When บันทึกผลการตรวจสอบ
    record_verification(db, student_id, student_name, student_status)

    # Then ระบบบันทึกรหัสนักศึกษา
    saved = db.query(StudentVerification).one()
    assert saved.student_id == student_id
    # Then ระบบบันทึกชื่อนักศึกษา
    assert saved.student_name == student_name
    # Then ระบบบันทึกสถานะของนักศึกษา
    assert saved.student_status == student_status
    # Then ค่าขอบเขตที่ต้องใช้ทดสอบ spec ไม่ได้บอก


def test_TC_REG_05_3_rejects_incomplete_student_data(db):
    # Given ระบบทะเบียนไม่ส่งข้อมูลนักศึกษาครบถ้วน
    # When บันทึกผลการตรวจสอบ
    record_verification(db, "66010003", "", "ปกติ")

    # Then ระบบไม่บันทึกผลที่ไม่ครบถ้วน
    assert db.query(StudentVerification).count() == 0
    # Then ข้อมูลไม่ถือว่าเป็นสถานะผ่าน
    assert db.query(StudentVerification).filter_by(student_status="ปกติ").count() == 0
    # Then ไม่อนุญาตให้ดำเนินธุรกรรมต่อ
    assert db.query(StudentVerification).count() == 0