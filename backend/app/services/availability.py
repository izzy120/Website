from sqlalchemy.orm import Session
from app.models import Appointment


def is_time_available(
    db: Session,
    appointment_date: str,
    appointment_time: str
):
    existing = (
        db.query(Appointment)
        .filter(
            Appointment.appointment_date == appointment_date,
            Appointment.appointment_time == appointment_time
        )
        .first()
    )

    return existing is None