import React, { useState } from 'react';
import { ArticleInput } from './components/ArticleInput';
import { SpeakingSection } from './components/SpeakingSection';
import { VocabularySection } from './components/VocabularySection';
import { ReadingSection } from './components/ReadingSection';
import { SyntaxSection } from './components/SyntaxSection';
import { analyzeArticle } from './services/geminiService';
import { IeltsAnalysisResponse } from './types';
import { GraduationCap } from 'lucide-react';

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
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
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
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 mb-4">
            Master English Analysis
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transform any English article into a comprehensive IELTS study guide using advanced AI linguistics.
          </p>
        </div>

        <ArticleInput 
          onAnalyze={handleAnalyze} 
          isLoading={isLoading} 
          error={error} 
        />

        {data && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid lg:grid-cols-1 gap-12">
               {/* 1. Speaking Practice */}
               <section id="speaking" className="scroll-mt-24">
                  <SpeakingSection data={data.speaking_practice} />
               </section>

               {/* 2. Vocabulary */}
               <section id="vocabulary" className="scroll-mt-24">
                  <VocabularySection data={data.core_vocabulary} />
               </section>

               <div className="grid lg:grid-cols-2 gap-8">
                  {/* 3. Reading Logic */}
                  <section id="reading" className="scroll-mt-24">
                      <ReadingSection data={data.reading_logic_analysis} />
                  </section>

                  {/* 4. Syntax Analysis */}
                  <section id="syntax" className="scroll-mt-24">
                      <SyntaxSection data={data.syntax_analysis} />
                  </section>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-8 border-t border-slate-200 mt-12">
         <p className="text-center text-slate-400 text-sm">
           Powered by Gemini AI • Designed for High-Achieving IELTS Students
         </p>
      </footer>
    </div>
  );
}

export default App;