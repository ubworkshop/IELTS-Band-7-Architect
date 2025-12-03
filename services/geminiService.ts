import { GoogleGenAI, Type } from "@google/genai";
import { IeltsAnalysisResponse } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert IELTS Tutor and Linguist AI designed to assist students in achieving Band 7+ scores. You function as the backend logic for an IELTS study SaaS platform.

Your task is to analyze the provided English article and generate a structured learning guide based on the user's specific requirements.
Crucially, you must provide Chinese translations for all definitions, meanings, and analytical points to help Chinese-speaking students understand better.

Your response MUST be a pure JSON object adhering to the schema defined in the responseSchema. Do not include markdown formatting or explanations outside the JSON.
`;

export const analyzeArticle = async (articleText: string): Promise<IeltsAnalysisResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `Analyze the following article for IELTS preparation and provide Chinese translations for key insights:\n\n${articleText}` }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
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
                      meaning_cn: { type: Type.STRING, description: "Chinese translation of the meaning" },
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
                      definition_cn: { type: Type.STRING, description: "Chinese translation of the definition" },
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
                main_idea_cn: { type: Type.STRING, description: "Chinese translation of the main idea" },
                structure_breakdown: {
                  type: Type.ARRAY,
                  items: {
                     type: Type.OBJECT,
                     properties: {
                        en: { type: Type.STRING, description: "Structure point in English" },
                        cn: { type: Type.STRING, description: "Structure point in Chinese" }
                     }
                  },
                },
                critical_thinking_point: { type: Type.STRING },
                critical_thinking_point_cn: { type: Type.STRING, description: "Chinese translation of the critical thinking point" },
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
                          function_cn: { type: Type.STRING, description: "Chinese translation of the function (e.g. 主语从句)" },
                        },
                      },
                    },
                    grammar_highlight: { type: Type.STRING },
                    grammar_highlight_cn: { type: Type.STRING, description: "Chinese translation of the grammar highlight" },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini.");
    }

    const data = JSON.parse(response.text) as IeltsAnalysisResponse;
    return data;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};