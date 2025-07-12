from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas
from .database import SessionLocal
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

SECRET_KEY = "secretstring"
ALGORITHM = "HS256"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        user = db.query(models.User).filter(models.User.email == email).first()
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# 1. Upload New Item
@router.post("/items/upload", response_model=schemas.ItemOut)
def upload_item(item: schemas.ItemCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    db_item = models.Item(**item.dict(), owner_id=user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# 2. Get All Approved Items
@router.get("/items/approved", response_model=list[schemas.ItemOut])
def get_approved_items(db: Session = Depends(get_db)):
    return db.query(models.Item).filter(models.Item.approved == True).all()

# 3. Get My Uploaded Items
@router.get("/items/my", response_model=list[schemas.ItemOut])
def get_my_items(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return db.query(models.Item).filter(models.Item.owner_id == user.id).all()

# 4. Admin: Approve/Reject Item
@router.put("/items/approve/{item_id}")
def approve_item(item_id: int, approve: bool, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can approve items")
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.approved = approve
    db.commit()
    return {"msg": f"Item {'approved' if approve else 'rejected'}"}

# Add to app/items.py

@router.get("/items/{item_id}", response_model=schemas.ItemOut)
def get_item_detail(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id, models.Item.approved == True).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found or not approved")
    return item