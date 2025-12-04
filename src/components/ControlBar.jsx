import React from 'react';
import { LANGUAGES } from '../services/translationService';

const ControlBar = ({
    isListening,
    onToggleListening,
    onClear,
    sourceLang,
    targetLang,
    setSourceLang,
    setTargetLang,
    speakers,
    activeSpeakerId,
    setActiveSpeakerId
}) => {
    const getLangName = (code) => LANGUAGES.find(l => l.code === code)?.name || code;
    const activeSpeaker = speakers?.find(s => s.id === activeSpeakerId);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div className="fixed bottom-[calc(2.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
            <div className="glass rounded-full px-4 md:px-6 py-3 flex items-center justify-between md:justify-center gap-3 md:gap-6 shadow-2xl transition-all hover:scale-105 duration-300">

                <div className="relative group">
                    <button className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-900/20 px-3 py-1.5 rounded-full border border-cyan-500/30">
                        <i className="ri-user-voice-line"></i>
                        <span className="max-w-[80px] truncate">{activeSpeaker?.name || 'Speaker'}</span>
                    </button>

                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-bottom-left">
                        {speakers?.map(speaker => (
                            <button
                                key={speaker.id}
                                onClick={() => setActiveSpeakerId(speaker.id)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center justify-between ${activeSpeakerId === speaker.id ? 'text-cyan-400 bg-cyan-900/20' : 'text-gray-300'}`}
                            >
                                <span className="truncate">{speaker.name}</span>
                                {activeSpeakerId === speaker.id && <i className="ri-check-line"></i>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-px h-6 bg-gray-700"></div>

                <div className="flex items-center gap-3 text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition group relative">
                    <select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        className="appearance-none bg-transparent border-none outline-none cursor-pointer text-right pr-1"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code} className="text-black">
                                {lang.name}
                            </option>
                        ))}
                    </select>
                    <i className="ri-arrow-left-right-line text-cyan-400"></i>
                    <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="appearance-none bg-transparent border-none outline-none cursor-pointer pl-1"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code} className="text-black">
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-px h-6 bg-gray-700"></div>

                <button
                    data-testid="mic-btn"
                    onClick={onToggleListening}
                    className={`relative group flex items-center justify-center w-12 h-12 rounded-full transition-all shadow-lg ${isListening
                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                        : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                >
                    <i className={`text-xl text-white ${isListening ? 'ri-mic-fill' : 'ri-mic-off-fill'}`}></i>
                </button>

                <div className="flex items-end gap-1 h-6">
                    {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
                        <div
                            key={i}
                            className={`w-1 rounded-full ${isListening ? 'animate-wave' : 'h-1'}`}
                            style={{
                                animationDelay: `${delay}s`,
                                backgroundColor: ['#22d3ee', '#06b6d4', '#c084fc', '#60a5fa', '#22d3ee'][i]
                            }}
                        ></div>
                    ))}
                </div>

                <div className="w-px h-6 bg-gray-700"></div>

                <button
                    onClick={onClear}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    title="清空记录"
                >
                    <i className="ri-delete-bin-line text-lg"></i>
                </button>

                <button
                    onClick={toggleFullscreen}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="全屏模式"
                >
                    <i className="ri-fullscreen-line text-lg"></i>
                </button>
            </div>
        </div>
    );
};

export default ControlBar;
