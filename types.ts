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