import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ControlBar from '../ControlBar';

describe('ControlBar', () => {
    const mockProps = {
        isListening: false,
        onToggleListening: vi.fn(),
        onClear: vi.fn(),
        sourceLang: 'en-US',
        targetLang: 'zh-CN',
        setSourceLang: vi.fn(),
        setTargetLang: vi.fn(),
        speakers: [{ id: 1, name: 'Speaker 1' }],
        activeSpeakerId: 1,
        setActiveSpeakerId: vi.fn()
    };

    it('renders correctly', () => {
        render(<ControlBar {...mockProps} />);
        expect(screen.getByTitle('全屏模式')).toBeInTheDocument();
    });

    it('toggles listening on button click', () => {
        render(<ControlBar {...mockProps} />);
        const micButton = screen.getByTestId('mic-btn');
        fireEvent.click(micButton);
        expect(mockProps.onToggleListening).toHaveBeenCalled();
    });

    it('displays correct language options', () => {
        render(<ControlBar {...mockProps} />);
        expect(screen.getByDisplayValue('English (US)')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Chinese (Simplified)')).toBeInTheDocument();
    });
});
