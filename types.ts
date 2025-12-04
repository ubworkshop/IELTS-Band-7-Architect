export interface SpeakingItem {
  phrase: string;
  meaning: string;
  meaning_cn: string;
  practice_sentences: string[];
}

export interface SpeakingPractice {
  description: string;
  items: SpeakingItem[];
}

export interface VocabWord {
  word: string;
  part_of_speech: string;
  definition: string;
  definition_cn: string;
  synonyms: string[];
}

export interface CoreVocabulary {
  description: string;
  words: VocabWord[];
}

export interface StructurePoint {
  en: string;
  cn: string;
}

export interface ReadingLogicAnalysis {
  description: string;
  main_idea: string;
  main_idea_cn: string;
  structure_breakdown: StructurePoint[];
  critical_thinking_point: string;
  critical_thinking_point_cn: string;
}

export interface ClauseBreakdown {
  part: string;
  function: string;
  function_cn: string;
}

export interface SyntaxAnalysisDetails {
  sentence_type: string;
  clauses_breakdown: ClauseBreakdown[];
  grammar_highlight: string;
  grammar_highlight_cn: string;
}

export interface SyntaxAnalysis {
  description: string;
  target_sentence: string;
  analysis: SyntaxAnalysisDetails;
}

export interface IeltsAnalysisResponse {
  speaking_practice: SpeakingPractice;
  core_vocabulary: CoreVocabulary;
  reading_logic_analysis: ReadingLogicAnalysis;
  syntax_analysis: SyntaxAnalysis;
}

// --- AI Configuration Types ---

export type AIProvider = 'google' | 'openai' | 'deepseek' | 'moonshot';

export interface AISettings {
  provider: AIProvider;
  model: string;
  apiKeys: {
    google: string;
    openai: string;
    deepseek: string;
    moonshot: string;
  };
}

export const AVAILABLE_MODELS: Record<AIProvider, string[]> = {
  google: ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'],
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
  deepseek: ['deepseek-chat', 'deepseek-reasoner'],
  moonshot: ['moonshot-v1-8k', 'moonshot-v1-32k'],
};

export const PROVIDER_NAMES: Record<AIProvider, string> = {
  google: 'Google Gemini',
  openai: 'OpenAI',
  deepseek: 'DeepSeek',
  moonshot: 'Moonshot AI (Kimi)',
};
