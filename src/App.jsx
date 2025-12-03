import React, { useState, useEffect } from 'react';
import ControlBar from './components/ControlBar';
import TranscriptList from './components/TranscriptList';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import useSpeechSynthesis from './hooks/useSpeechSynthesis';
import { translateText } from './services/translationService';

function App() {
  const [sourceLang, setSourceLang] = useState('en-US');
  const [targetLang, setTargetLang] = useState('zh-CN');

  const [translatedSegments, setTranslatedSegments] = useState([]);
  const [processedSegmentIds, setProcessedSegmentIds] = useState(new Set());

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    clearTranscript,
    error: recognitionError
  } = useSpeechRecognition(sourceLang);

  const { speak, cancel: cancelSpeech } = useSpeechSynthesis();

  // Handle Translation and Speech
  useEffect(() => {
    const processTranslation = async () => {
      // Find segments that haven't been processed yet
      const newSegments = transcript.filter(seg => !processedSegmentIds.has(seg.id));

      if (newSegments.length > 0) {
        // Mark these as processed immediately to avoid double processing
        setProcessedSegmentIds(prev => {
          const next = new Set(prev);
          newSegments.forEach(seg => next.add(seg.id));
          return next;
        });

        for (const segment of newSegments) {
          try {
            const translatedText = await translateText(segment.text, sourceLang, targetLang);

            setTranslatedSegments(prev => [...prev, {
              id: segment.id,
              text: translatedText,
              timestamp: segment.timestamp,
              speaker: segment.speaker
            }]);

            speak(translatedText, targetLang);
          } catch (error) {
            console.error('Translation failed:', error);
          }
        }
      }
    };

    processTranslation();
  }, [transcript, processedSegmentIds, sourceLang, targetLang, speak]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
      cancelSpeech();
    } else {
      // Clear previous session data when starting new
      clearTranscript();
      setTranslatedSegments([]);
      setProcessedSegmentIds(new Set());
      startListening();
    }
  };

  // Prepare display transcript (include interim)
  const displayTranscript = [...transcript];
  if (interimTranscript) {
    displayTranscript.push({
      id: 'interim',
      text: interimTranscript,
      timestamp: Date.now(),
      speaker: 'User'
    });
  }

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative z-10 flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <span className="text-lg font-bold tracking-wider opacity-90">Johnny AI</span>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <i className="ri-settings-4-line text-xl"></i>
        </button>
      </header>

      {recognitionError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500/20 text-red-300 px-4 py-2 rounded-lg border border-red-500/50">
          {recognitionError}
        </div>
      )}

      <TranscriptList
        transcript={displayTranscript}
        translatedSegments={translatedSegments}
      />

      <ControlBar
        isListening={isListening}
        onToggleListening={handleToggleListening}
        sourceLang={sourceLang}
        targetLang={targetLang}
        setSourceLang={setSourceLang}
        setTargetLang={setTargetLang}
      />
    </>
  );
}

export default App;
