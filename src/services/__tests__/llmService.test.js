import { describe, it, expect, vi, beforeEach } from 'vitest';
import { translateWithOpenAI, translateWithGemini } from '../llmService';

global.fetch = vi.fn();

describe('llmService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('translateWithOpenAI', () => {
        it('calls OpenAI API with correct parameters', async () => {
            const mockResponse = {
                choices: [{ message: { content: 'Translated Text' } }]
            };
            fetch.mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await translateWithOpenAI('Hello', 'en-US', 'zh-CN', 'test-key');

            expect(fetch).toHaveBeenCalledWith('https://api.openai.com/v1/chat/completions', expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Authorization': 'Bearer test-key'
                }),
                body: expect.stringContaining('"model":"gpt-3.5-turbo"')
            }));
            expect(result).toBe('Translated Text');
        });

        it('handles API errors', async () => {
            fetch.mockResolvedValueOnce({
                json: () => Promise.resolve({ error: { message: 'API Error' } })
            });

            await expect(translateWithOpenAI('Hello', 'en', 'zh', 'key')).rejects.toThrow('API Error');
        });
    });

    describe('translateWithGemini', () => {
        it('calls Gemini API with correct parameters', async () => {
            const mockResponse = {
                candidates: [{ content: { parts: [{ text: 'Gemini Translation' }] } }]
            };
            fetch.mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await translateWithGemini('Hello', 'en-US', 'zh-CN', 'test-key');

            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('generativelanguage.googleapis.com'), expect.objectContaining({
                method: 'POST'
            }));
            expect(result).toBe('Gemini Translation');
        });
    });
});
