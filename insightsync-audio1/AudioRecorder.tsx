import React, { useState, useRef } from "react";

const AudioRecorder: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

            setLoading(true);
            try {
                const response = await fetch("http://localhost:8000/transcribe/", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch transcription");
                }

                const data = await response.json();
                setTranscription(data.transcription || "No transcription returned.");
                setError(null); // Reset error state on success
            } catch (error) {
                console.error("Transcription error:", error);
                setError("Error during transcription.");
                setTranscription(null); // Clear transcription on error
            } finally {
                setLoading(false);
            }
        };

        mediaRecorder.start();
        setIsRecording(true);
        const startAudio = new Audio("/path/to/your/start-recording-sound.mp3");
        startAudio.play(); // Play audio feedback on start
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
        const stopAudio = new Audio("/path/to/your/stop-recording-sound.mp3");
        stopAudio.play(); // Play audio feedback on stop
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

            {loading && (
                <div className="mt-4 p-3 bg-yellow-200 text-yellow-800 rounded">
                    Transcribing...
                </div>
            )}

            {error && !loading && (
                <div className="mt-4 p-3 bg-red-200 text-red-800 rounded">
                    {error}
                </div>
            )}

            {transcription && !loading && (
                <div className="mt-4 p-3 bg-white border rounded shadow">
                    <h3 className="font-semibold">Transcription:</h3>
                    <p className="text-sm text-gray-700">{transcription}</p>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
