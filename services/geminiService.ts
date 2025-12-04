import { GoogleGenAI, Type } from "@google/genai";
import { IeltsAnalysisResponse, AISettings } from "../types";

const SYSTEM_INSTRUCTION_TEXT = `
You are an expert IELTS Tutor and Linguist AI designed to assist students in achieving Band 7+ scores. You function as the backend logic for an IELTS study SaaS platform.

Your task is to analyze the provided English article and generate a structured learning guide based on the user's specific requirements.
Crucially, you must provide Chinese translations for all definitions, meanings, and analytical points to help Chinese-speaking students understand better.

Your response MUST be a pure JSON object adhering strictly to the schema provided. Do not include markdown formatting (like \`\`\`json) or explanations outside the JSON.
`;

const RESPONSE_SCHEMA_OBJ = {
  type: Type.OBJECT,
  properties: {
    speaking_practice: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              phrase: { type: Type.STRING },
              meaning: { type: Type.STRING },
              meaning_cn: { type: Type.STRING },
              practice_sentences: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
          },
        },
      },
    },
    core_vocabulary: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        words: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              part_of_speech: { type: Type.STRING },
              definition: { type: Type.STRING },
              definition_cn: { type: Type.STRING },
              synonyms: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
          },
        },
      },
    },
    reading_logic_analysis: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        main_idea: { type: Type.STRING },
        main_idea_cn: { type: Type.STRING },
        structure_breakdown: {
          type: Type.ARRAY,
          items: {
             type: Type.OBJECT,
             properties: {
                en: { type: Type.STRING },
                cn: { type: Type.STRING }
             }
          },
        },
        critical_thinking_point: { type: Type.STRING },
        critical_thinking_point_cn: { type: Type.STRING },
      },
    },
    syntax_analysis: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        target_sentence: { type: Type.STRING },
        analysis: {
          type: Type.OBJECT,
          properties: {
            sentence_type: { type: Type.STRING },
            clauses_breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  part: { type: Type.STRING },
                  function: { type: Type.STRING },
                  function_cn: { type: Type.STRING },
                },
              },
            },
            grammar_highlight: { type: Type.STRING },
            grammar_highlight_cn: { type: Type.STRING },
          },
        },
      },
    },
  },
};

// --- Google Provider Handler ---
async function analyzeWithGoogle(articleText: string, apiKey: string, model: string): Promise<IeltsAnalysisResponse> {
  const ai = new GoogleGenAI({ apiKey: apiKey });

  const response = await ai.models.generateContent({
    model: model || 'gemini-2.5-flash',
    contents: [
      {
        role: "user",
        parts: [{ text: `Analyze the following article for IELTS preparation:\n\n${articleText}` }],
      },
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_TEXT,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA_OBJ,
    },
  });

  if (!response.text) {
    throw new Error("No response text received from Gemini.");
  }

  return JSON.parse(response.text) as IeltsAnalysisResponse;
}

// --- OpenAI Compatible Handler (OpenAI, DeepSeek, Moonshot) ---
async function analyzeWithOpenAICompatible(
  articleText: string, 
  apiKey: string, 
  model: string, 
  baseUrl: string
): Promise<IeltsAnalysisResponse> {
  
  // Construct the prompt manually with schema requirements since not all providers support strict JSON schema enforcement via API params yet.
  const schemaDescription = JSON.stringify({
    speaking_practice: { description: "...", items: [{ phrase: "...", meaning: "...", meaning_cn: "...", practice_sentences: ["..."] }] },
    core_vocabulary: { description: "...", words: [{ word: "...", part_of_speech: "...", definition: "...", definition_cn: "...", synonyms: ["..."] }] },
    reading_logic_analysis: { description: "...", main_idea: "...", main_idea_cn: "...", structure_breakdown: [{ en: "...", cn: "..." }], critical_thinking_point: "...", critical_thinking_point_cn: "..." },
    syntax_analysis: { description: "...", target_sentence: "...", analysis: { sentence_type: "...", clauses_breakdown: [{ part: "...", function: "...", function_cn: "..." }], grammar_highlight: "...", grammar_highlight_cn: "..." } }
  });

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: `${SYSTEM_INSTRUCTION_TEXT}\n\nIMPORTANT: Return ONLY valid JSON matching this structure: ${schemaDescription}`
        },
        {
          role: "user",
          content: articleText
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error ${response.status}: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content received from AI provider.");
  }

  try {
    return JSON.parse(content) as IeltsAnalysisResponse;
  } catch (e) {
    console.error("Failed to parse JSON", content);
    throw new Error("AI response was not valid JSON.");
  }
}

// --- Main Facade ---
export const analyzeArticle = async (articleText: string, settings: AISettings): Promise<IeltsAnalysisResponse> => {
  const { provider, model, apiKeys } = settings;
  const apiKey = apiKeys[provider];

  if (!apiKey) {
    throw new Error(`API Key for ${provider} is missing. Please configure it in Settings.`);
  }

  try {
    switch (provider) {
      case 'google':
        return await analyzeWithGoogle(articleText, apiKey, model);
      
      case 'openai':
        return await analyzeWithOpenAICompatible(articleText, apiKey, model, 'https://api.openai.com/v1');
      
      case 'deepseek':
        return await analyzeWithOpenAICompatible(articleText, apiKey, model, 'https://api.deepseek.com');
      
      case 'moonshot':
        return await analyzeWithOpenAICompatible(articleText, apiKey, model, 'https://api.moonshot.cn/v1');
      
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error(`${provider} Analysis Error:`, error);
    throw error;
  }
};
