import React, { useState } from 'react';
import { BrainCircuit, CheckCircle2, Lightbulb, Copy, Check } from 'lucide-react';
import { ReadingLogicAnalysis } from '../types';

interface Props {
  data: ReadingLogicAnalysis;
}

export const ReadingSection: React.FC<Props> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `IELTS Reading Logic Analysis\n\nMain Idea:\n${data.main_idea}\nCN: ${data.main_idea_cn}\n\nStructure Breakdown:\n${data.structure_breakdown.map((pt, i) => `${i + 1}. ${pt.en} (CN: ${pt.cn})`).join('\n')}\n\nCritical Thinking Point:\n${data.critical_thinking_point}\nCN: ${data.critical_thinking_point_cn}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-slate-800">Reading Logic</h2>
            <p className="text-slate-500 text-sm">Deconstructing arguments and structure</p>
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
        {/* Main Idea */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Idea</h4>
          <p className="text-lg text-slate-800 font-serif leading-relaxed mb-1">
            {data.main_idea}
          </p>
          <p className="text-md text-slate-500 font-serif leading-relaxed">
            {data.main_idea_cn}
          </p>
        </div>

        {/* Structure Breakdown */}
        <div>
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Structure Breakdown</h4>
          <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {data.structure_breakdown.map((point, idx) => (
              <div key={idx} className="relative flex gap-4 items-start">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center z-10">
                  <span className="text-xs font-bold text-emerald-700">{idx + 1}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex-1">
                  <p className="text-slate-800 font-medium mb-1">{point.en}</p>
                  <p className="text-slate-500 text-sm">{point.cn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Thinking */}
        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 flex gap-4">
          <Lightbulb className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="text-emerald-800 font-bold mb-1">Critical Thinking Point</h4>
            <p className="text-emerald-900 text-sm leading-relaxed font-medium mb-1">
              {data.critical_thinking_point}
            </p>
             <p className="text-emerald-700 text-sm leading-relaxed">
              {data.critical_thinking_point_cn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};