import os
import openai
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

# Load .env file for API key
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    # Save file temporarily
    file_location = f"temp/{file.filename}"

    try:
        with open(file_location, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    try:
        # Transcribe audio using OpenAI's Whisper model
        with open(file_location, "rb") as audio_file:
            transcript = openai.Audio.transcribe(
                model="whisper-1",
                file=audio_file
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during transcription: {str(e)}")
    finally:
        # Clean up the temporary file after processing
        if os.path.exists(file_location):
            os.remove(file_location)

    # Return the transcription result
    return JSONResponse(content={"transcription": transcript["text"]})