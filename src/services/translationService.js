import { refineTranslation, fallbackTranslate } from './glossary';

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
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`
        );

        const data = await response.json();

        if (data.responseStatus === 200 && data.responseData.translatedText) {
            const refinedText = refineTranslation(data.responseData.translatedText, targetLang, text);
            return refinedText;
        } else {
            throw new Error(data.responseDetails || 'Translation failed');
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
