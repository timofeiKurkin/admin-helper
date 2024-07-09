"use client"

import React, {useRef, useState} from 'react';

const VoiceInput = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        setIsRecording(true);
        audioChunksRef.current = [];
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioURL = URL.createObjectURL(audioBlob);
            setAudioURL(audioURL);
        };

        mediaRecorderRef.current.start();
    }

    const stopRecording = () => {
        setIsRecording((prevState) => !prevState);
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop()
        }
    }

    return (
        <div>
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {audioURL && <audio src={audioURL} controls />}
        </div>
    );
};

export default VoiceInput;