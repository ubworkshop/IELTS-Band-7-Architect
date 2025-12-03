import React, { useState } from 'react';
import { Mic, MessageCircle, Copy, Check } from 'lucide-react';
import { SpeakingPractice } from '../types';

interface Props {
  data: SpeakingPractice;
}

export const SpeakingSection: React.FC<Props> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `IELTS Speaking Practice\n\n${data.items.map((item, i) =>
      `${i + 1}. "${item.phrase}"\n   Meaning: ${item.meaning} (${item.meaning_cn})\n   Practice Sentences:\n${item.practice_sentences.map(s => `   - ${s}`).join('\n')}`
    ).join('\n\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 rounded-lg">
            <Mic className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-slate-800">Speaking Practice</h2>
            <p className="text-slate-500 text-sm">Target Band 7-9 Idioms & Collocations</p>
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

      <div className="grid gap-6 md:grid-cols-2">
        {data.items.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-slate-50 bg-rose-50/30">
              <h3 className="text-xl font-bold text-rose-700 font-serif">"{item.phrase}"</h3>
              <p className="text-slate-800 mt-2 text-sm font-medium">{item.meaning}</p>
              <p className="text-slate-500 mt-1 text-sm">{item.meaning_cn}</p>
            </div>
            <div className="p-5 bg-white">
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <MessageCircle className="w-3 h-3" /> Practice Sentences
              </div>
              <ul className="space-y-3">
                {item.practice_sentences.slice(0, 3).map((sent, sIdx) => (
                  <li key={sIdx} className="text-slate-700 text-sm leading-relaxed pl-3 border-l-2 border-rose-200">
                    {sent}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};