# schemas.py

from pydantic import BaseModel

# Pydantic 모델 정의
class CellBase(BaseModel):
    name: str

    class Config:
        orm_mode = True

class CellCreate(CellBase):
    pass

class TeacherBase(BaseModel):
    name: str

    class Config:
        orm_mode = True

class TeacherCreate(TeacherBase):
    pass

class ChildBase(BaseModel):
    name: str
    grade: int
    zone: str
    talent: int

    class Config:
        orm_mode = True

class ChildCreate(ChildBase):
    pass
