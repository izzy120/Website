from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean

from database import Base


class Customer(Base):

    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String, nullable=False)

    last_name = Column(String, nullable=False)

    phone = Column(String, nullable=False)

    email = Column(String, nullable=False)

    address = Column(String, nullable=False)

    city = Column(String, nullable=False)

    state = Column(String, nullable=False)

    zip_code = Column(String, nullable=False)


class Appointment(Base):

    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    customer_name = Column(String, nullable=False)

    phone = Column(String, nullable=False)

    email = Column(String, nullable=False)

    service = Column(String, nullable=False)

    appointment_date = Column(String, nullable=False)

    appointment_time = Column(String, nullable=False)

    address = Column(String, nullable=False)

    city = Column(String, nullable=False)

    state = Column(String, nullable=False)

    zip_code = Column(String, nullable=False)

    problem_description = Column(String, nullable=False)

    deposit_paid = Column(Boolean, default=False)

    payment_id = Column(String, default="")