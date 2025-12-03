import React, { useState } from 'react';
import { ArticleInput } from './components/ArticleInput';
import { SpeakingSection } from './components/SpeakingSection';
import { VocabularySection } from './components/VocabularySection';
import { ReadingSection } from './components/ReadingSection';
import { SyntaxSection } from './components/SyntaxSection';
import { analyzeArticle } from './services/geminiService';
import { IeltsAnalysisResponse } from './types';
import { GraduationCap, ArrowLeft } from 'lucide-react';

function App() {
  const [data, setData] = useState<IeltsAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeArticle(text);
      setData(result);
    } catch (err: any) {
      setError("Failed to analyze the article. Please check your text or try again later. Ensure you have set a valid API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-serif text-slate-800 tracking-tight">
              IELTS <span className="text-blue-600">Architect</span>
            </h1>
          </div>
          <div className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
            Band 7+ Edition
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 mb-2">
            AI Study Companion
          </h1>
          <p className="text-slate-600 max-w-2xl">
            Input your article on the left to generate a comprehensive IELTS analysis on the right.
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start lg:min-h-[calc(100vh-200px)]">
           {/* Left Column: Input (Sticky on Desktop) */}
           <div className="w-full lg:col-span-4 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)]">
             <ArticleInput 
                onAnalyze={handleAnalyze} 
                isLoading={isLoading} 
                error={error} 
             />
           </div>

           {/* Right Column: Output */}
           <div className="w-full lg:col-span-8">
              {data ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 pb-20">
                   {/* 1. Speaking Practice */}
                   <section id="speaking">
                      <SpeakingSection data={data.speaking_practice} />
                   </section>

                   {/* 2. Vocabulary */}
                   <section id="vocabulary">
                      <VocabularySection data={data.core_vocabulary} />
                   </section>

                   {/* 3. Reading Logic */}
                   <section id="reading">
                      <ReadingSection data={data.reading_logic_analysis} />
                   </section>

                   {/* 4. Syntax Analysis */}
                   <section id="syntax">
                      <SyntaxSection data={data.syntax_analysis} />
                   </section>
                </div>
              ) : (
                <div className="hidden lg:flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400 min-h-[500px]">
                  <ArrowLeft className="w-12 h-12 mb-4 text-slate-300 animate-pulse" />
                  <p className="text-lg font-medium">Results will appear here</p>
                  <p className="text-sm">Start by entering an article on the left</p>
                </div>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}

export default App;