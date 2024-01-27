# 기본 이미지 선택 (Python 3.8 기반)
FROM python:3.9

# 작업 디렉토리 설정
WORKDIR /app

# 호스트의 현재 디렉토리에 있는 모든 파일을 컨테이너의 /app 폴더로 복사
COPY . /app

# 가상 환경 생성
RUN python -m venv venv

# 활성화된 가상 환경에서 의존성 설치
RUN /bin/bash -c "source venv/bin/activate && pip install -r requirements.txt"

# uvicorn 명령이 사용 가능하도록 설치 (가상 환경 활성화 상태에서)
RUN /bin/bash -c "source venv/bin/activate && pip install uvicorn"

# 인증서 및 키 파일 복사
COPY ./backend-key.pem /app/backend-key.pem
COPY ./backend.pem /app/backend.pem

# 컨테이너가 시작될 때 실행할 명령
CMD ["/bin/bash", "-c", "source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
