from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_admin: bool
    points: int

    class Config:
        from_attributes = True
        


class ItemBase(BaseModel):
    title: str
    description: str
    category: str
    type: str
    size: str
    condition: str
    tags: str
    image_url: str

class ItemCreate(ItemBase):
    pass

class ItemOut(ItemBase):
    id: int
    available: bool
    approved: bool
    owner_id: int

    class Config:
        from_attributes = True
        


class SwapRequest(BaseModel):
    item_id: int
    via_points: bool = False  # true if using points

class SwapOut(BaseModel):
    id: int
    item_id: int
    from_user_id: int
    to_user_id: int
    status: str
    via_points: bool

    class Config:
        from_attributes = True
