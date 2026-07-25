import { useState, useRef } from 'react';
import './VoiceButton.css';

const VoiceButton = ({ onTranscript, disabled, size }) => {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const startListening = () => {
    setError('');
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Voice not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onTranscript(transcript);
      setListening(false);
    };

    recognition.onerror = (e) => {
      if (e.error === 'not-allowed') setError('Microphone permission denied');
      else setError('Voice recognition error');
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="voice-wrapper">
      <button
        className={`voice-btn ${size === 'large' ? 'voice-btn-large' : ''} ${listening ? 'listening' : ''}`}
        onClick={listening ? stopListening : startListening}
        disabled={disabled}
        aria-label={listening ? 'Stop recording' : 'Start voice input'}
        title={listening ? 'Tap to stop' : 'Tap to speak'}
      >
        {listening ? '⏹' : '🎤'}
      </button>
      {listening && <span className="voice-hint">Listening…</span>}
      {error && <span className="voice-error">{error}</span>}
    </div>
  );
};

export default VoiceButton;
