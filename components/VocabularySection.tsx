import React, { useState } from 'react';
import { Bookmark, Tag, Copy, Check } from 'lucide-react';
import { CoreVocabulary } from '../types';

interface Props {
  data: CoreVocabulary;
}

export const VocabularySection: React.FC<Props> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `IELTS Core Vocabulary\n\n${data.words.map((word, i) =>
      `${i + 1}. ${word.word} (${word.part_of_speech})\n   Definition: ${word.definition}\n   CN: ${word.definition_cn}\n   Synonyms: ${word.synonyms.join(', ')}`
    ).join('\n\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Bookmark className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-slate-800">Core Vocabulary</h2>
            <p className="text-slate-500 text-sm">High-level academic words found in text</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Grid adjustment: 
         - Mobile: 1 col
         - SM: 2 cols
         - LG: 2 cols (because parent container is narrow)
         - XL: 3 cols (when parent container has enough space)
      */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.words.map((word, idx) => (
          <div key={idx} className="group relative bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:border-amber-200 transition-colors flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-slate-800 font-serif">{word.word}</h3>
              <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-500 rounded-md">
                {word.part_of_speech}
              </span>
            </div>
            <p className="text-sm text-slate-700 font-medium mb-1 leading-relaxed">
              {word.definition}
            </p>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed flex-1">
              {word.definition_cn}
            </p>
            <div className="pt-3 border-t border-slate-50 mt-auto">
              <div className="flex flex-wrap gap-2">
                {word.synonyms.slice(0,3).map((syn, sIdx) => (
                  <span key={sIdx} className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                    <Tag className="w-3 h-3" /> {syn}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};