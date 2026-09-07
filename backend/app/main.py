from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine
from app import database
from app import models
from app.schemas import AppointmentCreate
from app.services.availability import is_time_available

# Create database tables
database.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InkyShaman Booking API",
    version="1.0.0"
)

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------
# Root
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Welcome to the InkyShaman Booking API"
    }


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "online"
    }


# --------------------------------------------------
# Get All Appointments
# --------------------------------------------------

@app.get("/appointments")
def get_appointments(db: Session = Depends(get_db)):
    appointments = db.query(models.Appointment).all()
    return appointments


# --------------------------------------------------
# Create Appointment
# --------------------------------------------------

@app.post("/appointments")
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db)
):

    # Check if date/time already booked
    if not is_time_available(
        db,
        appointment.appointment_date,
        appointment.appointment_time
    ):
        raise HTTPException(
            status_code=400,
            detail="That appointment time has already been booked."
        )

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
        "message": "Appointment created successfully.",
        "appointment_id": new_appointment.id
    }