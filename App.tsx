import React, { useState } from 'react';
import { ArticleInput } from './components/ArticleInput';
import { SpeakingSection } from './components/SpeakingSection';
import { VocabularySection } from './components/VocabularySection';
import { ReadingSection } from './components/ReadingSection';
import { SyntaxSection } from './components/SyntaxSection';
import { SettingsModal } from './components/SettingsModal';
import { analyzeArticle } from './services/geminiService';
import { IeltsAnalysisResponse, AISettings, PROVIDER_NAMES } from './types';
import { GraduationCap, ArrowLeft, Trash2, Settings as SettingsIcon } from 'lucide-react';

const STORAGE_KEY = 'ielts_app_analysis_data';
const SETTINGS_KEY = 'ielts_app_settings';

// Default Settings
const DEFAULT_SETTINGS: AISettings = {
    provider: 'google',
    model: 'gemini-2.5-flash',
    apiKeys: {
        google: process.env.API_KEY || '', // Fallback to env if available initially
        openai: '',
        deepseek: '',
        moonshot: ''
    }
};

function App() {
  // Initialize data from local storage
  const [data, setData] = useState<IeltsAnalysisResponse | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Initialize Settings from local storage
  const [settings, setSettings] = useState<AISettings>(() => {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch (e) {
        return DEFAULT_SETTINGS;
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleAnalyze = async (text: string) => {
    // Check if key exists for selected provider
    if (!settings.apiKeys[settings.provider]) {
        setIsSettingsOpen(true);
        setError(`Please enter an API Key for ${PROVIDER_NAMES[settings.provider]} in Settings.`);
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeArticle(text, settings);
      setData(result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } catch (err: any) {
      setError(err.message || "Failed to analyze the article. Please check your settings and text.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setData(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSaveSettings = (newSettings: AISettings) => {
      setSettings(newSettings);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        onSave={handleSaveSettings}
      />

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
          
          <div className="flex items-center gap-3">
             {/* Settings Button */}
             <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                title="Configure AI Models"
             >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{PROVIDER_NAMES[settings.provider]} ({settings.model})</span>
             </button>

            {data && (
              <button 
                onClick={clearData}
                className="text-xs font-medium text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors px-2"
                title="Clear saved analysis"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            <div className="hidden sm:block text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
              Band 7+ Edition
            </div>
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
