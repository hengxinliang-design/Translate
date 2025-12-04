import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock hooks
const mockStartListening = vi.fn();
const mockStopListening = vi.fn();
const mockClearTranscript = vi.fn();
const mockSpeak = vi.fn();
const mockCancelSpeech = vi.fn();

// We will control the transcript via this hoisted variable
const mocks = vi.hoisted(() => ({
    currentTranscript: []
}));

vi.mock('../hooks/useSpeechRecognition', () => ({
    default: () => ({
        isListening: true,
        transcript: mocks.currentTranscript,
        interimTranscript: '',
        startListening: vi.fn(),
        stopListening: vi.fn(),
        clearTranscript: vi.fn(),
        error: null
    })
}));

vi.mock('../hooks/useSpeechSynthesis', () => ({
    default: () => ({
        speak: mockSpeak,
        cancel: mockCancelSpeech
    })
}));

// Mock translation service with artificial delay
const SIMULATED_DELAY = 100; // 100ms delay per request
const SEGMENT_COUNT = 10;

vi.mock('../services/translationService', () => ({
    translateText: vi.fn((text) => new Promise(resolve => {
        setTimeout(() => {
            resolve(`Translated: ${text}`);
        }, SIMULATED_DELAY);
    })),
    LANGUAGES: [
        { code: 'en-US', name: 'English (US)' },
        { code: 'zh-CN', name: 'Chinese (Simplified)' }
    ]
}));

describe('Translation Performance Benchmark', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.currentTranscript = [];
    });

    it('processes multiple segments concurrently', async () => {
        // 1. Setup: Create a burst of segments
        const segments = Array.from({ length: SEGMENT_COUNT }, (_, i) => ({
            id: `seg-${i}`,
            text: `Segment ${i}`,
            timestamp: Date.now() + i * 1000,
            speaker: 'User'
        }));

        // 2. Render App
        const { rerender } = render(<App />);

        // 3. Simulate incoming segments
        const startTime = performance.now();

        // Update the mock return value
        mocks.currentTranscript = segments;

        // Force re-render to trigger useEffect
        rerender(<App />);

        // 4. Wait for all translations to complete (speak called for last segment)
        await waitFor(() => {
            expect(mockSpeak).toHaveBeenCalledTimes(SEGMENT_COUNT);
        }, { timeout: 5000 }); // Should finish well within 5s if parallel

        const endTime = performance.now();
        const duration = endTime - startTime;

        console.log(`\n--- Performance Result ---`);
        console.log(`Processed ${SEGMENT_COUNT} segments with ${SIMULATED_DELAY}ms delay each.`);
        console.log(`Total execution time: ${duration.toFixed(2)}ms`);

        // Theoretical sequential time: SEGMENT_COUNT * SIMULATED_DELAY = 1000ms
        // Theoretical parallel time: ~SIMULATED_DELAY + overhead = ~150ms

        // Assert that it was faster than sequential (allowing some overhead buffer)
        // If sequential, it would be > 1000ms. If parallel, it should be much less.
        expect(duration).toBeLessThan(SEGMENT_COUNT * SIMULATED_DELAY * 0.5);
        console.log(`--- Benchmark Passed ---\n`);
    });
});
