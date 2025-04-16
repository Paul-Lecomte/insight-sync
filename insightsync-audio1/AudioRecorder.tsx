import React, { useState, useRef } from "react";

const AudioRecorder: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState("");
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");


    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.start();
        setIsRecording(true);
    };
    const response = await fetch("http://localhost:8000/transcribe/", {
        method: "POST",
        body: formData,
    });
    const data = await response.json();


    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
        }
    };


    return <div>Audio Recorder</div>;
};

export default AudioRecorder;
