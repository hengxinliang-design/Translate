import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock child components to isolate App logic
vi.mock('../components/ControlBar', () => ({
    default: () => <div data-testid="control-bar">ControlBar</div>
}));
vi.mock('../components/TranscriptList', () => ({
    default: () => <div data-testid="transcript-list">TranscriptList</div>
}));
vi.mock('../components/SettingsModal', () => ({
    default: () => <div data-testid="settings-modal">SettingsModal</div>
}));

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        expect(screen.getByText('Johnny AI')).toBeInTheDocument();
        expect(screen.getByTestId('control-bar')).toBeInTheDocument();
        expect(screen.getByTestId('transcript-list')).toBeInTheDocument();
    });
});
