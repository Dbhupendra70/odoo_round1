# app/swaps.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas
from .database import SessionLocal
from .items import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. Request a swap
@router.post("/swap/request", response_model=schemas.SwapOut)
def request_swap(data: schemas.SwapRequest, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    item = db.query(models.Item).filter(models.Item.id == data.item_id, models.Item.available == True, models.Item.approved == True).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found or unavailable")
    if item.owner_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot swap your own item")
    
    # if points are used
    if data.via_points:
        if user.points < 50:
            raise HTTPException(status_code=400, detail="Not enough points")
        user.points -= 50
        db.commit()

    swap = models.Swap(
        item_id=item.id,
        from_user_id=user.id,
        to_user_id=item.owner_id,
        via_points=data.via_points
    )
    db.add(swap)
    db.commit()
    db.refresh(swap)
    return swap

# 2. Owner accepts/rejects swap
@router.put("/swap/respond/{swap_id}")
def respond_swap(swap_id: int, accept: bool, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    swap = db.query(models.Swap).filter(models.Swap.id == swap_id).first()
    if not swap or swap.to_user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    if swap.status != "pending":
        raise HTTPException(status_code=400, detail="Already responded")

    swap.status = "accepted" if accept else "rejected"

    item = db.query(models.Item).filter(models.Item.id == swap.item_id).first()
    item.available = False if accept else True

    # refund if rejected
    if not accept and swap.via_points:
        from_user = db.query(models.User).filter(models.User.id == swap.from_user_id).first()
        from_user.points += 50

    db.commit()
    return {"msg": f"Swap {'accepted' if accept else 'rejected'}"}

# 3. List my requests (sent)
@router.get("/swap/my", response_model=list[schemas.SwapOut])
def my_swaps(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return db.query(models.Swap).filter(models.Swap.from_user_id == user.id).all()

# 4. List incoming swap requests
@router.get("/swap/incoming", response_model=list[schemas.SwapOut])
def incoming_swaps(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return db.query(models.Swap).filter(models.Swap.to_user_id == user.id).all()
  
