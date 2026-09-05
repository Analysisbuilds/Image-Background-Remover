import io
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from rembg import remove, new_session
from PIL import Image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://imagebackground-remover.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

session = new_session("u2netp")
MAX_DIMENSION = 1200


@app.get("/")
async def root():
    return {"message": "RemoveBG API is running"}


@app.post("/api/remove-bg")
async def remove_background(file: UploadFile = File(...)):

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file must be an image."
        )

    try:
        input_bytes = await file.read()
        input_image = Image.open(io.BytesIO(input_bytes))
        input_image = input_image.convert("RGB")
        input_image.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)

        output_image = remove(input_image, session=session)

        buffer = io.BytesIO()
        output_image.save(buffer, format="PNG")

        return Response(
            content=buffer.getvalue(),
            media_type="image/png"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(e)}"
        )