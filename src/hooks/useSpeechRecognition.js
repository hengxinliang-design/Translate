import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeechRecognition = (language = 'en-US', activeSpeakerName = 'User') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const lastSpeakerRef = useRef(1);
  const shouldListenRef = useRef(false);

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

          const now = Date.now();
          const lastSegment = transcript[transcript.length - 1];
          const TIME_THRESHOLD = 2000; // 2 seconds to consider it a new paragraph

          setTranscript((prev) => {
            const last = prev[prev.length - 1];

            // If there is a last segment and it was recent, append to it
            if (last && (now - last.timestamp < TIME_THRESHOLD)) {
              return [
                ...prev.slice(0, -1),
                {
                  ...last,
                  text: `${last.text} ${finalTranscript}`,
                  timestamp: now // Update timestamp to keep the window open
                }
              ];
            }

            // Otherwise, create a new segment
            // Use active speaker name
            const currentSpeaker = activeSpeakerName;

            return [
              ...prev,
              {
                id: now,
                text: finalTranscript,
                timestamp: now,
                speaker: currentSpeaker
              }
            ];
          });
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);

      // Ignore 'no-speech' errors as they are common when silent
      if (event.error === 'no-speech') {
        return;
      }

      setError(`Error: ${event.error}`);
      // Don't stop listening state here, let onend handle the restart decision
    };

    recognition.onend = () => {
      // If user still wants to listen, restart immediately
      if (shouldListenRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error('Failed to restart recognition:', e);
          setIsListening(false);
          shouldListenRef.current = false;
        }
      } else {
        setIsListening(false);
      }
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
        shouldListenRef.current = true;
        recognitionRef.current.start();
      } catch (e) {
        console.error('Error starting recognition:', e);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      shouldListenRef.current = false;
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
