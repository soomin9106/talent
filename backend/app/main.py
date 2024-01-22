from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

from fastapi.middleware.cors import CORSMiddleware

from app.schemas import CellBase, CellCreate
from app.crud import get_cell, create_cell_db
from app.database import SessionLocal

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def hello_world():
    return {"Hello" : "world!"}

@app.get("/cells/{cell_id}", response_model=CellBase)
def read_cell(cell_id: int, db: Session = Depends(get_db)):
    db_cell = get_cell(db, cell_id=cell_id)
    if db_cell is None:
        raise HTTPException(status_code=404, detail="Cell not found")
    return db_cell

@app.post("/cell/", response_model=CellBase)
def create_cell(cell: CellCreate, db: Session = Depends(get_db)):
    db_cell = get_cell(db, cell_name = cell.name)
    if db_cell:
        raise HTTPException(status_code=400, detail="Cell already exists")
    return create_cell_db(db=db, cell=cell)