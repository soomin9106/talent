# models.py
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Cell(Base):
    __tablename__ = "cell"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    teachers = relationship("Teacher", back_populates="cell")
    children = relationship("Child", back_populates="cell")

class Teacher(Base):
    __tablename__ = "teacher"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    cell_id = Column(Integer, ForeignKey("cell.id"))
    cell = relationship("Cell", back_populates="teachers")

class Child(Base):
    __tablename__ = "children"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    grade = Column(Integer)
    zone = Column(String)
    talent = Column(Integer)
    cell_id = Column(Integer, ForeignKey("cell.id"))
    cell = relationship("Cell", back_populates="children")
