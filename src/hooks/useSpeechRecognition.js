import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeechRecognition = (language = 'en-US') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const lastSpeakerRef = useRef(1);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech Recognition API is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalTranscript = event.results[i][0].transcript;

          // Toggle speaker for new utterance
          const currentSpeaker = `User ${lastSpeakerRef.current}`;
          lastSpeakerRef.current = lastSpeakerRef.current === 1 ? 2 : 1;

          setTranscript((prev) => [
            ...prev,
            {
              id: Date.now(),
              text: finalTranscript,
              timestamp: Date.now(),
              speaker: currentSpeaker
            }
          ]);
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      // If we didn't stop it manually, it might have stopped due to silence or error.
      // We can decide to restart it here if we want "always on" behavior, 
      // but for now we'll just update state.
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        // setTranscript([]); // Clear previous session - REMOVED for persistence
        // lastSpeakerRef.current = 1; // Reset speaker to 1 - REMOVED for persistence
        setInterimTranscript('');
        recognitionRef.current.start();
      } catch (e) {
        console.error('Error starting recognition:', e);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
    lastSpeakerRef.current = 1;
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    clearTranscript,
    error,
    supported: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  };
};

export default useSpeechRecognition;
