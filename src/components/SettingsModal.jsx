import React, { useState, useEffect } from 'react';

const SettingsModal = ({ isOpen, onClose, settings, onSave, speakers, onSaveSpeakers }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [localSpeakers, setLocalSpeakers] = useState(speakers || []);

    useEffect(() => {
        setLocalSettings(settings);
        if (speakers) setLocalSpeakers(speakers);
    }, [settings, speakers, isOpen]);

    const handleChange = (key, value) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSpeakerChange = (id, key, value) => {
        setLocalSpeakers(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s));
    };

    const handleSave = () => {
        onSave(localSettings);
        if (onSaveSpeakers) onSaveSpeakers(localSpeakers);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Translation Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Provider</label>
                        <select
                            value={localSettings.provider}
                            onChange={(e) => handleChange('provider', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        >
                            <option value="gtx">Google GTX (Free, Basic)</option>
                            <option value="openai">OpenAI (High Quality)</option>
                            <option value="gemini">Google Gemini (High Quality)</option>
                        </select>
                    </div>

                    {localSettings.provider !== 'gtx' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">API Key</label>
                                <input
                                    type="password"
                                    value={localSettings.apiKey}
                                    onChange={(e) => handleChange('apiKey', e.target.value)}
                                    placeholder={`Enter ${localSettings.provider === 'openai' ? 'OpenAI' : 'Gemini'} API Key`}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Model Name</label>
                                <input
                                    type="text"
                                    value={localSettings.model}
                                    onChange={(e) => handleChange('model', e.target.value)}
                                    placeholder={localSettings.provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-pro'}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">System Prompt</label>
                        <textarea
                            value={localSettings.systemPrompt}
                            onChange={(e) => handleChange('systemPrompt', e.target.value)}
                            rows="4"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Instructions for the AI translator.</p>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                        <h3 className="text-md font-bold text-white mb-3">Speaker Profiles</h3>
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {localSpeakers.map(speaker => (
                                <div key={speaker.id} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={speaker.name}
                                        onChange={(e) => handleSpeakerChange(speaker.id, 'name', e.target.value)}
                                        placeholder="Name"
                                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={speaker.role}
                                        onChange={(e) => handleSpeakerChange(speaker.id, 'role', e.target.value)}
                                        placeholder="Role (e.g. Host)"
                                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-medium transition-colors shadow-lg shadow-cyan-500/20"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
