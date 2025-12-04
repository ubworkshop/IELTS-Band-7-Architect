import React, { useState } from 'react';
import { X, Save, Key, Settings, AlertTriangle } from 'lucide-react';
import { AISettings, AIProvider, AVAILABLE_MODELS, PROVIDER_NAMES } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (newSettings: AISettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AISettings>(settings);
  const [activeTab, setActiveTab] = useState<AIProvider>(settings.provider);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
        ...localSettings,
        provider: activeTab,
        model: AVAILABLE_MODELS[activeTab].includes(localSettings.model) 
            ? localSettings.model // Keep model if valid for new provider
            : AVAILABLE_MODELS[activeTab][0] // Reset to default if switching providers
    });
    onClose();
  };

  const providers: AIProvider[] = ['google', 'openai', 'deepseek', 'moonshot'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-800">AI Configuration</h2>
              <p className="text-sm text-slate-500">Configure your model providers and API keys</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Provider Selection Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-hide">
            {providers.map((p) => (
              <button
                key={p}
                onClick={() => {
                    setActiveTab(p);
                    // Also update the local settings model to the first default of this provider immediately for UI consistency
                    setLocalSettings(prev => ({ ...prev, model: AVAILABLE_MODELS[p][0] }));
                }}
                className={`
                  flex-1 min-w-[100px] py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === p 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
                `}
              >
                {PROVIDER_NAMES[p]}
              </button>
            ))}
          </div>

          <div className="space-y-6">
             {/* Configuration for Active Provider */}
             <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
                    {PROVIDER_NAMES[activeTab]} Settings
                </h3>

                {/* Model Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Model</label>
                    <select
                        value={localSettings.model}
                        onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700"
                    >
                        {AVAILABLE_MODELS[activeTab].map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                {/* API Key Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input 
                            type="password"
                            value={localSettings.apiKeys[activeTab]}
                            onChange={(e) => setLocalSettings({
                                ...localSettings,
                                apiKeys: { ...localSettings.apiKeys, [activeTab]: e.target.value }
                            })}
                            placeholder={`Enter your ${PROVIDER_NAMES[activeTab]} API Key`}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        Your key is stored locally in your browser and never sent to our servers.
                    </p>
                </div>
             </div>

             <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Note on API Usage</p>
                    <p>Ensure your API key has sufficient quota. For DeepSeek and Moonshot (Kimi), we use their OpenAI-compatible endpoints.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
