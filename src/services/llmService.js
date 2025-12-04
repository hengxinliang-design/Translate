
export const translateWithOpenAI = async (text, sourceLang, targetLang, apiKey, model = 'gpt-3.5-turbo', systemPrompt, speakerInfo = {}) => {
    const { speakerName, speakerRole, context } = speakerInfo;

    let prompt = systemPrompt || `You are a professional simultaneous interpreter. Translate the following text from ${sourceLang} to ${targetLang}. Output ONLY the translation. Ignore filler words like 'um', 'uh', 'ah'. Make the translation natural, fluent, and suitable for daily conversation. Do not explain.`;

    if (speakerName) {
        prompt += `\n\nCurrent Speaker: ${speakerName} (${speakerRole || 'Unknown Role'}).`;
    }
    if (context) {
        prompt += `\n\nConversation Context:\n${context}`;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: prompt },
                    { role: 'user', content: text }
                ],
                temperature: 0.3
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('OpenAI Translation Error:', error);
        throw error;
    }
};

export const translateWithGemini = async (text, sourceLang, targetLang, apiKey, model = 'gemini-pro', systemPrompt, speakerInfo = {}) => {
    const { speakerName, speakerRole, context } = speakerInfo;

    let prompt = systemPrompt || `You are a professional simultaneous interpreter. Translate the following text from ${sourceLang} to ${targetLang}. Output ONLY the translation. Ignore filler words like 'um', 'uh', 'ah'. Make the translation natural, fluent, and suitable for daily conversation. Do not explain.`;

    if (speakerName) {
        prompt += `\n\nCurrent Speaker: ${speakerName} (${speakerRole || 'Unknown Role'}).`;
    }
    if (context) {
        prompt += `\n\nConversation Context:\n${context}`;
    }

    // Note: This is a simplified implementation for Gemini via REST API. 
    // Actual endpoint might vary based on specific Google Cloud setup or AI Studio.
    // Using Generative Language API format.

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${prompt}\n\nText to translate: "${text}"`
                    }]
                }]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error('Gemini Translation Error:', error);
        throw error;
    }
};
