import React, { useState, useRef, useEffect } from 'react';
import { ToneSelector } from './components/ToneSelector';
import { ResultCard } from './components/ResultCard';
import { generateRewrite } from './services/geminiService';
import { ToneType, AIRequestState } from './types';
import { Sparkles, XCircle, Eraser, Keyboard, Languages, AlertCircle, Settings, Sun, Moon, KeyRound, Save } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneType>(ToneType.GRAMMAR);
  const [aiState, setAiState] = useState<AIRequestState>({ status: 'idle' });
  
  // Settings State
  const [apiKey, setApiKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize State from LocalStorage
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSaveSettings = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setIsSettingsOpen(false);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (aiState.status === 'error') {
      const timer = setTimeout(() => {
        setAiState(prev => prev.status === 'error' ? { status: 'idle' } : prev);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [aiState.status]);

  const handleGenerate = async (tone: ToneType) => {
    if (!inputText.trim()) return;
    
    if (!apiKey) {
      setAiState({ status: 'error', error: "Please set your API Key in settings first." });
      setIsSettingsOpen(true);
      return;
    }

    setSelectedTone(tone);
    setAiState({ status: 'loading' });
    setResultText('');

    try {
      const rewritten = await generateRewrite(inputText, tone, apiKey);
      setResultText(rewritten);
      setAiState({ status: 'success' });
    } catch (error) {
      setAiState({ status: 'error', error: (error as Error).message });
    }
  };

  const handleApply = () => {
    setInputText(resultText);
    setResultText('');
    setAiState({ status: 'idle' });
    // Reset height after applying
    if(textareaRef.current) {
       setTimeout(() => {
          textareaRef.current!.style.height = 'auto';
          textareaRef.current!.style.height = textareaRef.current!.scrollHeight + 'px';
       }, 0);
    }
  };

  const handleDiscard = () => {
    setResultText('');
    setAiState({ status: 'idle' });
  };

  const clearText = () => {
    setInputText('');
    setResultText('');
    setAiState({ status: 'idle' });
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 flex flex-col items-center py-8 px-4 sm:px-6 relative overflow-hidden transition-colors duration-300">
      
      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm backdrop-blur-sm"
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm backdrop-blur-sm"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 dark:shadow-purple-900 mb-4 transform rotate-3 hover:rotate-6 transition-transform">
          <Sparkles className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
          Smart Scribe AI
        </h1>
        <div className="flex items-center gap-2 mt-2">
           <span className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-full text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
             <Languages className="w-3 h-3" /> Hinglish Supported
           </span>
        </div>
      </div>

      {/* Main Interface Container */}
      <div className="w-full max-w-2xl relative z-10">
        
        {/* Editor Panel */}
        <div className={`
            glass-panel rounded-3xl p-1 transition-all duration-500
            ${aiState.status === 'success' ? 'shadow-lg' : 'shadow-2xl'}
            dark:shadow-black/50
        `}>
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-[20px] p-2 transition-colors duration-300">
            
            {/* Toolbar Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 dark:border-gray-700">
               <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                  <Keyboard className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Editor</span>
               </div>
               {inputText && (
                 <button 
                  onClick={clearText}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Clear text"
                 >
                   <Eraser className="w-4 h-4" />
                 </button>
               )}
            </div>

            {/* Input Area */}
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type in English or Hinglish (e.g., 'Mai aa raha hu')..."
              className="w-full bg-transparent border-none focus:ring-0 text-lg sm:text-xl text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 resize-none min-h-[120px] p-4 leading-relaxed"
              spellCheck={false}
            />

            {/* AI Controls */}
            <div className="mt-2 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 transition-colors">
              <div className="flex items-center gap-2 mb-3 px-1">
                 <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                 </div>
                 <span className="text-xs font-bold text-gray-700 dark:text-gray-300">AI Actions</span>
              </div>
              
              <ToneSelector 
                selectedTone={selectedTone}
                onSelectTone={handleGenerate}
                disabled={!inputText.trim() || aiState.status === 'loading'}
              />
            </div>

          </div>
        </div>

        {/* Output/Result Area */}
        <div className="relative">
          {(aiState.status === 'loading' || resultText) && (
            <ResultCard 
              originalText={inputText}
              resultText={resultText}
              tone={selectedTone}
              isLoading={aiState.status === 'loading'}
              onApply={handleApply}
              onDiscard={handleDiscard}
            />
          )}
        </div>

      </div>

      {/* Floating Error Toast */}
      {aiState.status === 'error' && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-50 animate-bounce-in">
           <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-l-4 border-red-500 text-gray-800 dark:text-gray-100 px-4 py-3 rounded-r shadow-2xl flex items-start gap-3">
             <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
             <div className="flex-1">
               <p className="font-bold text-sm">Cannot Process Request</p>
               <p className="text-sm opacity-90">{aiState.error}</p>
             </div>
             <button onClick={() => setAiState({status: 'idle'})} className="text-gray-400 hover:text-gray-600">
               <XCircle className="w-5 h-5" />
             </button>
           </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 dark:bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-800 transform transition-all scale-100">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" /> Settings
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <KeyRound className="w-4 h-4" /> Google Gemini API Key
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API Key here..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Your key is stored locally in your browser and used only for requests.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
              <button 
                onClick={() => handleSaveSettings(apiKey)}
                className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
