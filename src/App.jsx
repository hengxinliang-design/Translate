import React, { useState, useEffect, useRef } from 'react';
import ControlBar from './components/ControlBar';
import InterpreterPanel from './components/InterpreterPanel';
import AudioVisualizer from './components/AudioVisualizer';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import useSpeechSynthesis from './hooks/useSpeechSynthesis';
import { translateText, LANGUAGES } from './services/translationService';

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

  const handleClearHistory = () => {
    clearTranscript();
    setTranslatedSegments([]);
    setProcessedSegmentIds(new Set());
    cancelSpeech();
  };

  const getLangName = (code) => LANGUAGES.find(l => l.code === code)?.name || code;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary mb-2">
          LinguaFlow
        </h1>
        <p className="text-text-secondary">Real-time AI Simultaneous Interpretation</p>
      </header>

      <ControlBar
        isListening={isListening}
        onToggleListening={handleToggleListening}
        onClearHistory={handleClearHistory}
        sourceLang={sourceLang}
        targetLang={targetLang}
        setSourceLang={setSourceLang}
        setTargetLang={setTargetLang}
      />

      {recognitionError && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">
          {recognitionError}
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-[500px]">
        <InterpreterPanel
          title="Source"
          segments={transcript}
          isInterim={interimTranscript}
          language={getLangName(sourceLang)}
        />

        <div className="hidden md:flex flex-col items-center justify-center gap-4 text-text-secondary opacity-50">
          <div className="w-px h-full bg-glass-border"></div>
        </div>

        <InterpreterPanel
          title="Translation"
          segments={translatedSegments}
          language={getLangName(targetLang)}
        />
      </div>

      <div className="mt-8 flex justify-center">
        <AudioVisualizer isListening={isListening} />
      </div>
    </div>
  );
}

export default App;
