import React, { useState } from 'react';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';

interface ArticleInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const ArticleInput: React.FC<ArticleInputProps> = ({ onAnalyze, isLoading, error }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 50) {
        alert("Please enter a longer article for a valid analysis.");
        return;
    }
    onAnalyze(text);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex-1 flex flex-col">
        <div className="p-1 bg-gradient-to-r from-blue-600 to-indigo-600 shrink-0"></div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-slate-800 shrink-0">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold font-serif">Input Article</h2>
          </div>
          
          <p className="text-slate-500 mb-4 text-sm shrink-0 leading-relaxed">
            Paste your article below. The AI will generate a structured IELTS study guide.
          </p>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            <textarea
              className="w-full flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-serif text-slate-700 leading-relaxed text-base placeholder:text-slate-400 min-h-[250px] lg:min-h-[400px]"
              placeholder="Paste your English text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
            />
            
            {error && (
               <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700 shrink-0">
                 <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                 <p className="text-sm">{error}</p>
               </div>
            )}

            <div className="mt-6 flex justify-end shrink-0">
              <button
                type="submit"
                disabled={isLoading || !text.trim()}
                className={`
                  w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-white shadow-lg transition-all transform
                  ${isLoading || !text.trim() 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl hover:-translate-y-1 active:scale-95'}
                `}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Guide</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};