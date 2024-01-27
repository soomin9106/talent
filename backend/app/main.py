from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from fastapi.middleware.cors import CORSMiddleware

from app.schemas import CellBase, CellBaseInfo, CellCreate, CellDelete, CellUpdate, ChildBase, ChildBaseInfo, ChildCreate, ChildUpdate
from app.crud import create_child_db, delete_cell_db, get_cell, create_cell_db, get_cell_by_id, update_cell_db, update_child_db
from app.database import SessionLocal
from app.models import Cell, Child
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000", # front-end domain

]

app.add_middleware(
    CORSMiddleware,
    HTTPSRedirectMiddleware,
    allow_origins=["*"],  # Update this to the specific origins you want to allow
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

@app.get("/cell/{cell_id}", response_model=CellBaseInfo)
def read_one_cell(cell_id: int, db: Session = Depends(get_db)):
    db_cell = (
        db.query(Cell)
        .options(joinedload(Cell.children))  # Load children in the same query
        .filter(Cell.id == cell_id)
        .first()
    )
    if db_cell is None:
        raise HTTPException(status_code=404, detail="Cell not found")

    # Count the number of children
    children_count = db.query(func.count(Child.id)).filter(Child.cell_id == cell_id).scalar()

    return {
        "id": db_cell.id,
        "name": db_cell.name,
        "children_count": children_count,
    }

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
@app.post("/child/{cell_id}", response_model=ChildBase)
def create_child(child: ChildCreate, cell_id: int, db: Session = Depends(get_db)):
    return create_child_db(db, child, cell_id)

@app.get("/children/{cell_id}", response_model=list[ChildBaseInfo])
def read_all_children(cell_id: int, db: Session = Depends(get_db)):
    db_children = db.query(Child).filter(Child.cell_id == cell_id).all()

    # if not db_children:
    #     raise HTTPException(status_code=404, detail="No children found for the given cell_id")

    return db_children

@app.get("/child/{student_id}", response_model=ChildBase)
def read_one_child(student_id: int, db: Session = Depends(get_db)):
    db_child = db.query(Child).filter(Child.id == student_id).first()

    if not db_child:
        raise HTTPException(status_code=404, detail="No children found for the given student id")

    return db_child


@app.put("/child/{student_id}", response_model=ChildUpdate)
def edit_child(student_id: int, child: ChildCreate, db: Session = Depends(get_db)):
    return update_child_db(db=db, child_id=student_id, updated_child=child)
