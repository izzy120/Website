from fastapi import FastAPI

from database import Base
from database import engine

from fastapi import Depends

from sqlalchemy.orm import Session

from database import get_db

from schemas import AppointmentCreate

from scheduler import get_available_times

import backend.app.models.models as models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InkyShaman Booking API",
    version="1.0.0"
)


@app.get("/")
def home():

    return {

        "status": "online",

        "application": "InkyShaman Booking API"

    }


@app.get("/health")
def health():

    return {

        "status": "healthy"

    }

@app.get("/appointments")
def get_appointments():

    return {

        "message":"Appointments endpoint coming soon."

    }

@app.post("/appointments")
def create_appointment(

    appointment: AppointmentCreate,

    db: Session = Depends(get_db)

):

    new_appointment = models.Appointment(

        customer_name=appointment.customer_name,

        phone=appointment.phone,

        email=appointment.email,

        service=appointment.service,

        appointment_date=appointment.appointment_date,

        appointment_time=appointment.appointment_time,

        address=appointment.address,

        city=appointment.city,

        state=appointment.state,

        zip_code=appointment.zip_code,

        problem_description=appointment.problem_description

    )

    db.add(new_appointment)

    db.commit()

    db.refresh(new_appointment)

    return {

        "message": "Appointment created successfully",

        "appointment_id": new_appointment.id

    }

@app.get("/available-times")
def available_times():

    return {

        "times": get_available_times()

    }