FROM python:3.10-slim

WORKDIR /app/api

COPY . /app/api

RUN pip3 install -r requirements.txt

EXPOSE 5000

CMD ["python3", "server.py"]