from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

app = FastAPI()


@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    # For now, just mock the transcription result.
    # Later, we can integrate with Whisper or OpenAI.

    file_location = f"temp/{file.filename}"

    # Save the uploaded file temporarily (for now)
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Mock transcription result
    transcription = "This is a mock transcription of the audio file."

    # Return a dummy response
    return JSONResponse(content={"transcription": transcription})