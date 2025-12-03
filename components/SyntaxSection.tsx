import React, { useState } from 'react';
import { PenTool, GitBranch, Copy, Check } from 'lucide-react';
import { SyntaxAnalysis } from '../types';

interface Props {
  data: SyntaxAnalysis;
}

export const SyntaxSection: React.FC<Props> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `IELTS Syntax Analysis\n\nTarget Sentence:\n"${data.target_sentence}"\nType: ${data.analysis.sentence_type}\n\nClause Breakdown:\n${data.analysis.clauses_breakdown.map(c => `- [${c.function} / ${c.function_cn}]: ${c.part}`).join('\n')}\n\nGrammar Focus:\n${data.analysis.grammar_highlight}\nCN: ${data.analysis.grammar_highlight_cn}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <PenTool className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-slate-800">Syntax Analysis</h2>
            <p className="text-slate-500 text-sm">Complex sentence deep dive</p>
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* The Target Sentence */}
        <div className="p-6 bg-slate-900 text-slate-50">
          <div className="flex items-center gap-2 mb-3 opacity-60">
            <span className="text-xs uppercase tracking-widest font-semibold">{data.analysis.sentence_type} Sentence</span>
          </div>
          <p className="text-xl font-serif leading-relaxed text-indigo-100">
            "{data.target_sentence}"
          </p>
        </div>

        {/* Breakdown */}
        <div className="p-6">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              <GitBranch className="w-4 h-4" /> Clause Breakdown
            </h4>
            
            <div className="space-y-3">
              {data.analysis.clauses_breakdown.map((clause, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex flex-col items-center sm:w-32 shrink-0">
                    <span className="w-full px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-indigo-600 text-center">
                      {clause.function}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">{clause.function_cn}</span>
                  </div>
                  <p className="text-slate-700 font-medium">
                    {clause.part}
                  </p>
                </div>
              ))}
            </div>

            {/* Grammar Highlight */}
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <h5 className="text-indigo-900 font-bold text-sm mb-1">Grammar Focus</h5>
              <p className="text-indigo-900 text-sm font-medium mb-1">
                {data.analysis.grammar_highlight}
              </p>
              <p className="text-indigo-700 text-sm">
                {data.analysis.grammar_highlight_cn}
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};