# schemas.py

from pydantic import BaseModel

# Pydantic 모델 정의
class CellBase(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class CellBaseInfo(BaseModel):
    id: int
    name: str
    children_count: int

    class Config:
        orm_mode = True

class CellCreateBase(BaseModel):
    name: str

    class Config:
        orm_mode = True

class CellCreate(CellCreateBase):
    pass

class CellUpdate(CellBase):
    id: int

class CellDelete(BaseModel):
    id: int

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

class ChildUpdate(ChildBase):
    id: int
