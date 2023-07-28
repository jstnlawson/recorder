import { useDispatch } from 'react-redux';
import React, { useState, useRef } from 'react';

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorder = useRef(null);
  const dispatch = useDispatch();

  const addSample = () => {
    if (recordedBlob) {
      // Dispatch the action to add the sample to the database
      dispatch({ type: 'ADD_SAMPLE', payload: recordedBlob });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlob(blob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const playOriginal = () => {
    if (recordedBlob) {
      const audio = new Audio(URL.createObjectURL(recordedBlob));
      audio.play();
    }
  };


const playDetuned = () => {
    console.log('Type of recordedBlob:', recordedBlob instanceof Blob);
    if (recordedBlob) {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const arrayBuffer = fileReader.result;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
        try {
          const buffer = await audioContext.decodeAudioData(arrayBuffer);
          const detunedBuffer = applyDetuneToBuffer(buffer, 1000); // You can adjust the detune value as needed
  
          // Create a new buffer source for the detuned sound
          const detunedSource = audioContext.createBufferSource();
          detunedSource.buffer = detunedBuffer;
          detunedSource.connect(audioContext.destination);
          detunedSource.start(0);
        } catch (error) {
          console.error('Error decoding audio data:', error);
        }
      };
      fileReader.readAsArrayBuffer(recordedBlob);
    }
  };
  
  const applyDetuneToBuffer = (buffer, detune) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const frameCount = buffer.length;
    const detunedBuffer = audioContext.createBuffer(numberOfChannels, frameCount, sampleRate);
  
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const inputData = buffer.getChannelData(channel);
      const outputData = detunedBuffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        // Apply detuning effect to the audio data
        const detuneValue = detune; // You can adjust the detune value as needed
        const detuneFactor = Math.pow(2, detuneValue / 1400);
        const index = i * detuneFactor;
        const floorIndex = Math.floor(index);
        const fract = index - floorIndex;
        const s1 = inputData[floorIndex];
        const s2 = inputData[Math.min(floorIndex + 1, frameCount - 1)];
        outputData[i] = s1 + fract * (s2 - s1);
      }
    }
  
    return detunedBuffer;
  };
  

  return (
    <div>
      {isRecording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}

      <button onClick={playOriginal} disabled={!recordedBlob}>
        Play Original
      </button>
      <button onClick={playDetuned} disabled={!recordedBlob}>
        Play Detuned
      </button>

      {/* Display the recorded audio */}
      {recordedBlob && (
        <audio controls>
          <source src={URL.createObjectURL(recordedBlob)} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
      <button onClick={addSample}>Add Sample</button>
    </div>
  );
};

export default VoiceRecorder;

