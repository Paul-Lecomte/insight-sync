import React, { useState, useRef } from "react";

const AudioRecorder: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState("");
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            const formData = new FormData();
            formData.append("file", audioBlob, "recording.webm");

            try {
                const response = await fetch("http://localhost:8000/transcribe/", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                setTranscription(data.transcription || "No transcription returned.");
            } catch (error) {
                console.error("Transcription error:", error);
                setTranscription("Error during transcription.");
            }
        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    return (
        <div className="p-4 bg-gray-100 rounded shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Audio Recorder</h2>
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded ${
                    isRecording ? "bg-red-500" : "bg-green-500"
                } text-white`}
            >
                {isRecording ? "Stop Recording" : "Start Recording"}
            </button>

            {transcription && (
                <div className="mt-4 p-3 bg-white border rounded shadow">
                    <h3 className="font-semibold">Transcription:</h3>
                    <p className="text-sm text-gray-700">{transcription}</p>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;