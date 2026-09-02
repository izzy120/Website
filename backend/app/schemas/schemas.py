from pydantic import BaseModel


class AppointmentCreate(BaseModel):

    customer_name: str

    phone: str

    email: str

    service: str

    appointment_date: str

    appointment_time: str

    address: str

    city: str

    state: str

    zip_code: str

    problem_description: str