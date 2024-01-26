# 기본 이미지 선택 (Python 3.9 기반)
FROM python:3.9

# 작업 디렉토리 설정
WORKDIR /app

# 호스트의 현재 디렉토리에 있는 모든 파일을 컨테이너의 /app 폴더로 복사
COPY . /app

# 가상 환경 생성 및 의존성 설치
RUN python -m venv venv
RUN /bin/bash -c "source venv/bin/activate && pip install -r requirements.txt"

# 컨테이너가 시작될 때 실행할 명령
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
