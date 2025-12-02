import { refineTranslation, fallbackTranslate } from './glossary.js';

/**
 * Mock Translation Service
 * 
 * In a real application, this would call an API like Google Cloud Translation,
 * DeepL, or OpenAI. For this demo, we simulate translation.
 */

export const translateText = async (text, sourceLang, targetLang) => {
    try {
        // Extract language codes (e.g., 'en-US' -> 'en')
        const source = sourceLang.split('-')[0];
        const target = targetLang.split('-')[0];

        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
        );

        const data = await response.json();

        if (data && data[0] && data[0][0] && data[0][0][0]) {
            // Combine all segments if multiple sentences
            const translatedText = data[0].map(seg => seg[0]).join('');
            const refinedText = refineTranslation(translatedText, targetLang, text);
            return refinedText;
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        console.warn('Translation API failed, falling back to mock:', error);
        // Fallback for demo if API limit reached: Use glossary to translate keywords
        const fallbackText = fallbackTranslate(text, targetLang);
        return `[Offline] ${fallbackText}`;
    }
};

export const LANGUAGES = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
];
