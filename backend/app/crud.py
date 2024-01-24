from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas import CellCreate, CellDelete, CellUpdate, TeacherCreate, ChildCreate
from app.models import Cell, Child, Teacher

def get_cell(db: Session, cell_name: str):
    return db.query(Cell).filter(Cell.name == cell_name).first()

def get_cell_by_id(db: Session, cell_id: int):
    return db.query(Cell).filter(Cell.id == cell_id).first()

def get_teacher(db: Session, teacher_id: int):
    return db.query(Teacher).filter(Teacher.id == teacher_id).first()

def get_child(db: Session, child_id: int):
    return db.query(Child).filter(Child.id == child_id).first()

def create_cell_db(db: Session, cell: CellCreate):
    db_cell = Cell(name=cell.name)
    db.add(db_cell)
    db.commit()
    db.refresh(db_cell)
    return db_cell

def update_cell_db(db: Session, cell_id: int, updated_cell: CellUpdate):
    db_cell = db.query(Cell).filter(Cell.id == cell_id).first()

    if db_cell:
        
        db_cell.name = updated_cell.name
        db.add(db_cell)
        db.commit()
        return db_cell
    else:
        raise HTTPException(status_code=404, detail="Cell not found")
    
def delete_cell_db(db: Session, cell: CellDelete):
    db_cell = get_cell_by_id(db, cell_id=cell.id)
    if not db_cell:
        raise HTTPException(status_code=404, detail="Cell not found")

    db.delete(db_cell)
    db.commit()

    return {"message": "Cell deleted successfully"}
    
def create_teacher(db: Session, item: TeacherCreate, cell_id: int):
    db_item = Teacher(**item.model_dump(), cell_id = cell_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def create_child_db(db: Session, child: ChildCreate, cell_id: int):
    db_item = Child(**child.model_dump(), cell_id = cell_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_child_db(db: Session, child_id: int, updated_child: ChildCreate):
    db_child = db.query(Child).filter(Child.id == child_id).first()

    if db_child:
        db_child.name = updated_child.name
        db_child.grade = updated_child.grade
        db_child.zone = updated_child.zone
        db_child.talent = updated_child.talent
        db.add(db_child)
        db.commit()
        return db_child
    else:
        raise HTTPException(status_code=404, detail="Child not found")
