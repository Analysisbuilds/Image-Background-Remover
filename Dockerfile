FROM python:3.10-slim

WORKDIR /app

# Install system dependencies needed for OpenCV / ONNX image processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt-get/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "src.bg_remover.main:app", "--host", "0.0.0.0", "--port", "8000"]