/**
 * Glossary for Manufacturing and Fastener Industry
 * 
 * This file contains mappings of common terms to their industry-specific translations.
 * Currently focused on English -> Chinese.
 */

export const INDUSTRY_GLOSSARY = {
    'zh-CN': [
        // Fasteners
        { pattern: /fastener/gi, replacement: '紧固件' },
        { pattern: /bolt/gi, replacement: '螺栓' },
        { pattern: /nut/gi, replacement: '螺母' },
        { pattern: /screw/gi, replacement: '螺钉' },
        { pattern: /washer/gi, replacement: '垫圈' },
        { pattern: /rivet/gi, replacement: '铆钉' },
        { pattern: /stud/gi, replacement: '双头螺柱' },
        { pattern: /anchor/gi, replacement: '锚栓' },
        { pattern: /pin/gi, replacement: '销' },

        // Manufacturing Processes
        { pattern: /machining/gi, replacement: '机加工' },
        { pattern: /forging/gi, replacement: '锻造' },
        { pattern: /casting/gi, replacement: '铸造' },
        { pattern: /stamping/gi, replacement: '冲压' },
        { pattern: /heat treatment/gi, replacement: '热处理' },
        { pattern: /surface treatment/gi, replacement: '表面处理' },
        { pattern: /coating/gi, replacement: '涂层' },
        { pattern: /plating/gi, replacement: '电镀' },
        { pattern: /galvanizing/gi, replacement: '镀锌' },
        { pattern: /anodizing/gi, replacement: '阳极氧化' },

        // Materials & Specs
        { pattern: /stainless steel/gi, replacement: '不锈钢' },
        { pattern: /carbon steel/gi, replacement: '碳钢' },
        { pattern: /alloy steel/gi, replacement: '合金钢' },
        { pattern: /brass/gi, replacement: '黄铜' },
        { pattern: /tensile strength/gi, replacement: '抗拉强度' },
        { pattern: /yield strength/gi, replacement: '屈服强度' },
        { pattern: /torque/gi, replacement: '扭矩' },
        { pattern: /tolerance/gi, replacement: '公差' },
        { pattern: /specification/gi, replacement: '规格' },
        { pattern: /standard/gi, replacement: '标准' },
    ]
};

/**
 * Refines the translated text using the industry glossary.
 * 
 * @param {string} translatedText The text returned by the translation API.
 * @param {string} targetLang The target language code (e.g., 'zh-CN').
 * @param {string} sourceText The original source text (optional, for context).
 * @returns {string} The refined text.
 */
export const refineTranslation = (translatedText, targetLang, sourceText = '') => {
    if (!translatedText) return translatedText;

    let refinedText = translatedText;
    const lowerSource = sourceText.toLowerCase();

    // Context-aware replacements for zh-CN
    if (targetLang === 'zh-CN') {
        // Handle "Bolt" vs "Screw" for "螺丝"
        if (lowerSource.includes('bolt')) {
            refinedText = refinedText.replace(/螺丝/g, '螺栓');
        } else if (lowerSource.includes('screw')) {
            refinedText = refinedText.replace(/螺丝/g, '螺钉');
        } else {
            // Default fallback if neither is explicitly found but "螺丝" is there?
            // Maybe leave it or default to 螺钉 as it's more technical than 螺丝
            refinedText = refinedText.replace(/螺丝/g, '螺钉');
        }

        // Handle "Fastener" -> "紧固件" (Fixing generic "扣件" or "固定件")
        refinedText = refinedText.replace(/扣件/g, '紧固件');
        refinedText = refinedText.replace(/固定件/g, '紧固件');

        // Handle "Washer" -> "垫圈" (Fixing "垫片")
        refinedText = refinedText.replace(/垫片/g, '垫圈');

        // Handle "Nut" -> "螺母" (Fixing "螺帽")
        refinedText = refinedText.replace(/螺帽/g, '螺母');
    }

    return refinedText;
};
