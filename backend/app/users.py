from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, auth
from .database import SessionLocal
from .items import get_current_user
from .models import User, Item, Swap

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = auth.hash_password(user.password)
    db_user = models.User(email=user.email, password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = auth.create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}



@router.get("/dashboard")
def user_dashboard(db: Session = Depends(SessionLocal), user: User = Depends(get_current_user)):
    uploaded_items = db.query(Item).filter(Item.owner_id == user.id).count()
    completed_swaps = db.query(Swap).filter(Swap.from_user_id == user.id, Swap.status == "accepted").count()

    return {
        "email": user.email,
        "points": user.points,
        "uploaded_items": uploaded_items,
        "completed_swaps": completed_swaps
    }
