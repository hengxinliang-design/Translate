import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SettingsModal from '../SettingsModal';

describe('SettingsModal', () => {
    const defaultSettings = {
        provider: 'gtx',
        apiKey: '',
        model: '',
        systemPrompt: ''
    };

    it('renders nothing when closed', () => {
        render(<SettingsModal isOpen={false} settings={defaultSettings} onClose={() => { }} onSave={() => { }} speakers={[]} onSaveSpeakers={() => { }} />);
        expect(screen.queryByText('Translation Settings')).toBeNull();
    });

    it('renders correctly when open', () => {
        render(<SettingsModal isOpen={true} settings={defaultSettings} onClose={() => { }} onSave={() => { }} speakers={[]} onSaveSpeakers={() => { }} />);
        expect(screen.getByText('Translation Settings')).toBeInTheDocument();
        expect(screen.getByText('Provider')).toBeInTheDocument();
    });

    it('shows API key input when non-GTX provider is selected', () => {
        render(<SettingsModal isOpen={true} settings={{ ...defaultSettings, provider: 'openai' }} onClose={() => { }} onSave={() => { }} speakers={[]} onSaveSpeakers={() => { }} />);
        expect(screen.getByText('API Key')).toBeInTheDocument();
    });

    it('calls onSave with updated settings', () => {
        const onSave = vi.fn();
        render(<SettingsModal isOpen={true} settings={defaultSettings} onClose={() => { }} onSave={onSave} speakers={[]} onSaveSpeakers={() => { }} />);

        // Change provider
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'openai' } });

        // Save
        fireEvent.click(screen.getByText('Save Changes'));

        expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
            provider: 'openai'
        }));
    });
});
