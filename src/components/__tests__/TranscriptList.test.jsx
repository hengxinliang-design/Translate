import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TranscriptList from '../TranscriptList';

describe('TranscriptList', () => {
    const mockTranscript = [
        { id: '1', text: 'Hello', timestamp: 1234567890 },
        { id: '2', text: 'World', timestamp: 1234567891 }
    ];
    const mockTranslations = [
        { id: '1', text: '你好', timestamp: 1234567890 },
        { id: '2', text: '世界', timestamp: 1234567891 }
    ];

    it('renders empty state correctly', () => {
        render(<TranscriptList transcript={[]} translatedSegments={[]} />);
        expect(screen.getByText('Start speaking to see the transcript...')).toBeInTheDocument();
    });

    it('renders transcript items with translations', () => {
        render(<TranscriptList transcript={mockTranscript} translatedSegments={mockTranslations} />);
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('你好')).toBeInTheDocument();
        expect(screen.getByText('World')).toBeInTheDocument();
        expect(screen.getByText('世界')).toBeInTheDocument();
    });

    it('applies active styling to the last item', () => {
        const { container } = render(<TranscriptList transcript={mockTranscript} translatedSegments={mockTranslations} />);
        // The last item (World/世界) should have the active styling classes
        const activeItem = screen.getByText('World').closest('div');
        expect(activeItem).toHaveClass('animate-fade-in-up');
    });
});
