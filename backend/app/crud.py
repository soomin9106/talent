from sqlalchemy.orm import Session

from app.schemas import CellCreate, TeacherCreate, ChildCreate
from app.models import Cell, Child, Teacher

def get_cell(db: Session, cell_name: int):
    return db.query(Cell).filter(Cell.name == cell_name).first()

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

def create_teacher(db: Session, item: TeacherCreate, cell_id: int):
    db_item = Teacher(**item.model_dump(), cell_id = cell_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def create_child(db: Session, item: ChildCreate, cell_id: int):
    db_item = Child(**item.model_dump(), cell_id = cell_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
