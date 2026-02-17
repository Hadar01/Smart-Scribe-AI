import React, { useState, useRef, useEffect } from 'react';
import { ToneSelector } from './components/ToneSelector';
import { ResultCard } from './components/ResultCard';
import { generateRewrite } from './services/geminiService';
import { ToneType, AIRequestState } from './types';
import { Sparkles, XCircle, Eraser, Keyboard, Languages } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneType>(ToneType.GRAMMAR);
  const [aiState, setAiState] = useState<AIRequestState>({ status: 'idle' });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  const handleGenerate = async (tone: ToneType) => {
    if (!inputText.trim()) return;
    
    setSelectedTone(tone);
    setAiState({ status: 'loading' });
    setResultText(''); // Clear previous result while loading new one

    try {
      const rewritten = await generateRewrite(inputText, tone);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900 flex flex-col items-center py-8 px-4 sm:px-6">
      
      {/* Header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 mb-4 transform rotate-3 hover:rotate-6 transition-transform">
          <Sparkles className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          Smart Scribe AI
        </h1>
        <div className="flex items-center gap-2 mt-2">
           <span className="bg-white/50 border border-gray-200 px-2 py-0.5 rounded-full text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
             <Languages className="w-3 h-3" /> Hinglish Supported
           </span>
        </div>
        <p className="text-gray-500 mt-2 max-w-md text-sm sm:text-base">
          Your intelligent keyboard agent. Grammar fixes & Tone adjustments that respect your language style.
        </p>
      </div>

      {/* Main Interface Container */}
      <div className="w-full max-w-2xl relative">
        
        {/* Editor Panel */}
        <div className={`
            glass-panel rounded-3xl p-1 transition-all duration-500
            ${aiState.status === 'success' ? 'shadow-lg' : 'shadow-2xl'}
        `}>
          <div className="bg-white/80 rounded-[20px] p-2">
            
            {/* Toolbar Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
               <div className="flex items-center gap-2 text-gray-400">
                  <Keyboard className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Editor</span>
               </div>
               {inputText && (
                 <button 
                  onClick={clearText}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
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
              className="w-full bg-transparent border-none focus:ring-0 text-lg sm:text-xl text-gray-800 placeholder-gray-300 resize-none min-h-[120px] p-4 leading-relaxed"
              spellCheck={false}
            />

            {/* AI Controls */}
            <div className="mt-2 bg-gray-50/80 rounded-2xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-3 px-1">
                 <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                 </div>
                 <span className="text-xs font-bold text-gray-700">AI Actions</span>
              </div>
              
              <ToneSelector 
                selectedTone={selectedTone}
                onSelectTone={handleGenerate}
                disabled={!inputText.trim() || aiState.status === 'loading'}
              />
            </div>

          </div>
        </div>

        {/* Error Message */}
        {aiState.status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm border border-red-100 animate-fade-in">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            {aiState.error}
          </div>
        )}

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

      <div className="mt-12 text-center text-gray-400 text-xs">
        Powered by Google Gemini • Smart Scribe AI
      </div>

    </div>
  );
};

export default App;
