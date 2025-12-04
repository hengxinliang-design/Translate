import React, { useState, useEffect } from 'react';
import ControlBar from './components/ControlBar';
import TranscriptList from './components/TranscriptList';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import useSpeechSynthesis from './hooks/useSpeechSynthesis';
import { translateText } from './services/translationService';
import useTranslation from './hooks/useTranslation';

import SettingsModal from './components/SettingsModal';

function App() {
  const [sourceLang, setSourceLang] = useState('en-US');
  const [targetLang, setTargetLang] = useState('zh-CN');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('translationSettings');
      return saved ? JSON.parse(saved) : {
        provider: 'gtx',
        apiKey: '',
        model: '',
        systemPrompt: ''
      };
    } catch (e) {
      return {
        provider: 'gtx',
        apiKey: '',
        model: '',
        systemPrompt: ''
      };
    }
  });

  const [speakers, setSpeakers] = useState(() => {
    try {
      const saved = localStorage.getItem('speakers');
      return saved ? JSON.parse(saved) : [
        { id: 1, name: 'Speaker 1', role: 'Host' },
        { id: 2, name: 'Speaker 2', role: 'Guest' },
        { id: 3, name: 'Speaker 3', role: 'Participant' },
        { id: 4, name: 'Speaker 4', role: 'Participant' },
        { id: 5, name: 'Speaker 5', role: 'Participant' }
      ];
    } catch (e) {
      return [
        { id: 1, name: 'Speaker 1', role: 'Host' },
        { id: 2, name: 'Speaker 2', role: 'Guest' },
        { id: 3, name: 'Speaker 3', role: 'Participant' },
        { id: 4, name: 'Speaker 4', role: 'Participant' },
        { id: 5, name: 'Speaker 5', role: 'Participant' }
      ];
    }
  });

  const [activeSpeakerId, setActiveSpeakerId] = useState(1);

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('translationSettings', JSON.stringify(newSettings));
  };

  const handleSaveSpeakers = (newSpeakers) => {
    setSpeakers(newSpeakers);
    localStorage.setItem('speakers', JSON.stringify(newSpeakers));
  };

  const activeSpeaker = speakers.find(s => s.id === activeSpeakerId);

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    clearTranscript,
    error: recognitionError
  } = useSpeechRecognition(sourceLang, activeSpeaker?.name);

  const { speak, cancel: cancelSpeech } = useSpeechSynthesis();

  const { translatedSegments, clearTranslations } = useTranslation(sourceLang, targetLang, transcript, speak, settings, activeSpeaker);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
      cancelSpeech();
    } else {
      // Clear previous session data when starting new - REMOVED for persistence
      // clearTranscript();
      // clearTranslations();
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob gpu"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000 gpu"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000 gpu"></div>
      </div>

      <header className="relative z-10 flex justify-between items-center px-4 py-4 md:px-8 md:py-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <span className="text-lg font-bold tracking-wider opacity-90">Johnny AI</span>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="text-gray-400 hover:text-white transition-colors"
        >
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
        onClear={() => {
          clearTranscript();
          clearTranslations();
        }}
        sourceLang={sourceLang}
        targetLang={targetLang}
        setSourceLang={setSourceLang}
        setTargetLang={setTargetLang}
        speakers={speakers}
        activeSpeakerId={activeSpeakerId}
        setActiveSpeakerId={setActiveSpeakerId}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
        speakers={speakers}
        onSaveSpeakers={handleSaveSpeakers}
      />
    </>
  );
}

export default App;
