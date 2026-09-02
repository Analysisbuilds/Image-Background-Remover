import io
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import Response, FileResponse
from fastapi.staticfiles import StaticFiles
from rembg import remove
from PIL import Image

app = FastAPI()
app.mount("/static", StaticFiles(directory="src/bg_remover/static"), name="static")

@app.get("/")
async def serve_index():
    """Serves the main frontend UI."""
    return FileResponse("src/bg_remover/static/index.html")

@app.post("/api/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    """Receives image from frontend, removes background, and returns output PNG."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    try:
        input_bytes = await file.read()
        input_image = Image.open(io.BytesIO(input_bytes))
        output_image = remove(input_image)
        buffer = io.BytesIO()
        output_image.save(buffer, format="PNG")
        buffer.seek(0)
        return Response(content=buffer.getvalue(), media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")