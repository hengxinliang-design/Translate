import React from 'react';
import { Mic, MicOff, Settings, Trash2 } from 'lucide-react';
import { LANGUAGES } from '../services/translationService';

const ControlBar = ({
    isListening,
    onToggleListening,
    onClearHistory,
    sourceLang,
    targetLang,
    setSourceLang,
    setTargetLang
}) => {
    return (
        <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 flex-1">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-text-secondary uppercase font-bold tracking-wider">Source</label>
                    <select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        className="bg-bg-secondary text-text-primary border border-glass-border rounded px-3 py-2 focus:outline-none focus:border-accent-primary transition-colors"
                        disabled={isListening}
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="text-text-secondary">→</div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-text-secondary uppercase font-bold tracking-wider">Target</label>
                    <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="bg-bg-secondary text-text-primary border border-glass-border rounded px-3 py-2 focus:outline-none focus:border-accent-primary transition-colors"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onClearHistory}
                    className="p-3 rounded-full bg-bg-secondary text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Clear History"
                >
                    <Trash2 size={20} />
                </button>

                <button
                    onClick={onToggleListening}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg ${isListening
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse-slow'
                        : 'btn-primary'
                        }`}
                >
                    {isListening ? (
                        <>
                            <MicOff size={20} />
                            Stop
                        </>
                    ) : (
                        <>
                            <Mic size={20} />
                            Start Listening
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ControlBar;
