import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock the hooks
const mockStartListening = vi.fn();
const mockStopListening = vi.fn();
const mockClearTranscript = vi.fn();
const mockSpeak = vi.fn();
const mockCancelSpeech = vi.fn();

vi.mock('../hooks/useSpeechRecognition', () => ({
    default: () => ({
        isListening: false,
        transcript: [],
        interimTranscript: '',
        startListening: mockStartListening,
        stopListening: mockStopListening,
        clearTranscript: mockClearTranscript,
        error: null
    })
}));

vi.mock('../hooks/useSpeechSynthesis', () => ({
    default: () => ({
        speak: mockSpeak,
        cancel: mockCancelSpeech
    })
}));

// Mock translation service
vi.mock('../services/translationService', () => ({
    translateText: vi.fn((text) => Promise.resolve(`Translated: ${text}`)),
    LANGUAGES: [
        { code: 'en-US', name: 'English (US)' },
        { code: 'zh-CN', name: 'Chinese (Simplified)' }
    ]
}));

describe('App Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the main layout elements', () => {
        render(<App />);
        expect(screen.getByText('Johnny AI')).toBeInTheDocument();
        expect(screen.getByText('Start speaking to see the transcript...')).toBeInTheDocument();
    });

    it('toggles listening state', () => {
        render(<App />);
        const micButton = screen.getByTestId('mic-btn');
        fireEvent.click(micButton);
        // Based on initial state false, it should call startListening
        expect(mockStartListening).toHaveBeenCalled();
    });

    it('has responsive layout classes', () => {
        const { container } = render(<App />);
        // Check for the responsive padding on the main container
        // We use a more specific selector to ensure we are checking the right element if needed, 
        // but querySelector is fine for checking existence of class in the tree.
        expect(container.querySelector('.md\\:px-20')).toBeInTheDocument();
    });
});
