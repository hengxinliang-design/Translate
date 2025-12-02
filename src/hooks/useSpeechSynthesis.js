import { useState, useEffect, useCallback, useRef } from 'react';

const useSpeechSynthesis = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const synth = useRef(window.speechSynthesis);

    useEffect(() => {
        const updateVoices = () => {
            setVoices(synth.current.getVoices());
        };

        updateVoices();
        if (synth.current.onvoiceschanged !== undefined) {
            synth.current.onvoiceschanged = updateVoices;
        }
    }, []);

    const speak = useCallback((text, lang = 'en-US') => {
        if (!text) return;

        // Cancel any current speech
        synth.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        // Try to find a voice that matches the language
        const voice = voices.find(v => v.lang.startsWith(lang));
        if (voice) {
            utterance.voice = voice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error('Speech synthesis error:', e);
            setIsSpeaking(false);
        };

        synth.current.speak(utterance);
    }, [voices]);

    const cancel = useCallback(() => {
        synth.current.cancel();
        setIsSpeaking(false);
    }, []);

    return {
        speak,
        cancel,
        isSpeaking,
        voices,
        supported: !!window.speechSynthesis
    };
};

export default useSpeechSynthesis;
