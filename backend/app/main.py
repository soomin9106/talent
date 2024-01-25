from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

from fastapi.middleware.cors import CORSMiddleware

from app.schemas import CellBase, CellCreate, CellDelete, CellUpdate, ChildBase, ChildCreate
from app.crud import create_child_db, delete_cell_db, get_cell, create_cell_db, get_cell_by_id, update_cell_db, update_child_db
from app.database import SessionLocal
from app.models import Cell, Child

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

# 셀 정보 관련 API
@app.get("/cells/", response_model=list[CellBase])
def read_all_cell(db: Session = Depends(get_db)):
    db_cells = db.query(Cell).all()
    return db_cells

@app.post("/cell/", response_model=CellBase)
def create_cell(cell: CellCreate, db: Session = Depends(get_db)):
    db_cell = get_cell(db, cell_name = cell.name)
    if db_cell:
        raise HTTPException(status_code=400, detail="Cell already exists")
    return create_cell_db(db=db, cell=cell)

@app.put("/cell/", response_model=CellBase)
def edit_cell(cell: CellUpdate, db: Session = Depends(get_db)):
    return update_cell_db(db=db, cell_id=cell.id, updated_cell=cell)

@app.delete("/cell/", response_model=None)
def delete_cell(cell: CellDelete, db: Session = Depends(get_db)):
    db_cell = get_cell_by_id(db, cell_id=cell.id)
    if not db_cell:
        raise HTTPException(status_code=404, detail="Cell not found")

    delete_cell_db(db=db, cell=db_cell)
    return {"message": "Cell deleted successfully"}

# 학생 관련 API
@app.post("/child/", response_model=ChildBase)
def create_child(child: ChildCreate, cell_id: int, db: Session = Depends(get_db)):
    return create_child_db(db, child, cell_id)

@app.get("/children/", response_model=list[ChildBase])
def read_all_children(cell_id: int, db: Session = Depends(get_db)):
    db_children = db.query(Child).filter(cell_id == cell_id).all()
    return db_children

@app.put("/child/", response_model=ChildBase)
def edit_child(child: ChildCreate, db: Session = Depends(get_db)):
    return update_child_db(db=db, child_id=child.id, updated_child=child)