import { useState, useEffect, useCallback } from 'react';
import { translateText } from '../services/translationService';

const useTranslation = (sourceLang, targetLang, transcript, speak, settings) => {
  const [translatedSegments, setTranslatedSegments] = useState([]);
  const [processedSegmentIds, setProcessedSegmentIds] = useState(new Set());

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

        // Process translations in parallel
        await Promise.all(newSegments.map(async (segment) => {
          try {
            const translatedText = await translateText(segment.text, sourceLang, targetLang, settings);

            setTranslatedSegments(prev => {
              // Avoid duplicates if already added by another race (though Set check above helps)
              if (prev.some(t => t.id === segment.id)) return prev;

              return [...prev, {
                id: segment.id,
                text: translatedText,
                timestamp: segment.timestamp,
                speaker: segment.speaker
              }];
            });

            if (speak) {
              speak(translatedText, targetLang);
            }
          } catch (error) {
            console.error('Translation failed:', error);
          }
        }));
      }
    };

    processTranslation();
  }, [transcript, processedSegmentIds, sourceLang, targetLang, speak, settings]);

  const clearTranslations = useCallback(() => {
    setTranslatedSegments([]);
    setProcessedSegmentIds(new Set());
  }, []);

  return {
    translatedSegments,
    clearTranslations
  };
};

export default useTranslation;
