from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(100))
    points = Column(Integer, default=0)
    is_admin = Column(Boolean, default=False)

    items = relationship("Item", back_populates="owner")
    sent_swaps = relationship("Swap", foreign_keys='Swap.from_user_id', back_populates="from_user")
    received_swaps = relationship("Swap", foreign_keys='Swap.to_user_id', back_populates="to_user")

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    description = Column(Text)
    category = Column(String(100))
    type = Column(String(100))
    size = Column(String(100))
    condition = Column(String(100))
    tags = Column(String(100))
    image_url = Column(String(100))
    available = Column(Boolean, default=True)
    approved = Column(Boolean, default=False)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="items")



class Swap(Base):
    __tablename__ = "swaps"
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer)
    from_user_id = Column(Integer, ForeignKey("users.id"))
    to_user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="pending")  # pending, accepted, rejected
    via_points = Column(Boolean, default=False)

    from_user = relationship("User", foreign_keys=[from_user_id], back_populates="sent_swaps")
    to_user = relationship("User", foreign_keys=[to_user_id], back_populates="received_swaps")
    
