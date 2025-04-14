import os
import openai
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

# Load .env file
load_dotenv()

app = FastAPI()

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    file_location = f"temp/{file.filename}"

    with open(file_location, "wb") as f:
        f.write(await file.read())

    with open(file_location, "rb") as audio_file:
        transcript = openai.Audio.transcribe(
            model="whisper-1",
            file=audio_file
        )

    os.remove(file_location)

    return JSONResponse(content={"transcription": transcript["text"]})