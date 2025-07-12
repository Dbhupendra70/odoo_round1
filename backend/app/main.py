from fastapi import FastAPI
from . import users, models, items, swaps, admin
from .database import engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.get("/")
def read_root():
    return{"message":"fastAPI is working"}

models.Base.metadata.create_all(bind=engine)

origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(users.router)
app.include_router(items.router)
app.include_router(swaps.router)
app.include_router(admin.router)


