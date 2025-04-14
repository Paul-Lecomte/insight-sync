from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os

app = FastAPI()

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    # Ensure the 'temp' directory exists
    os.makedirs("temp", exist_ok=True)

    file_location = f"temp/{file.filename}"

    # Save the uploaded file temporarily (for now)
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Mock transcription result
    transcription = "This is a mock transcription of the audio file."

    # Return a dummy response
    return JSONResponse(content={"transcription": transcription})