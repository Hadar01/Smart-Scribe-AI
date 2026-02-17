import React from 'react';
import { ToneType } from '../types';
import { Sparkles, Briefcase, Coffee, Share2, Heart, Smile, MessageCircle } from 'lucide-react';

interface ToneSelectorProps {
  selectedTone: ToneType;
  onSelectTone: (tone: ToneType) => void;
  disabled?: boolean;
}

const tones = [
  { type: ToneType.GRAMMAR, icon: Sparkles, label: 'Grammar', color: 'text-purple-600', bg: 'bg-purple-100' },
  { type: ToneType.PROFESSIONAL, icon: Briefcase, label: 'Professional', color: 'text-blue-600', bg: 'bg-blue-100' },
  { type: ToneType.CASUAL, icon: Coffee, label: 'Casual', color: 'text-orange-600', bg: 'bg-orange-100' },
  { type: ToneType.POLITE, icon: Heart, label: 'Polite', color: 'text-pink-600', bg: 'bg-pink-100' },
  { type: ToneType.SOCIAL, icon: Share2, label: 'Social', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { type: ToneType.WITTY, icon: Smile, label: 'Witty', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { type: ToneType.EMOJIFY, icon: MessageCircle, label: 'Emojify', color: 'text-green-600', bg: 'bg-green-100' },
];

export const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onSelectTone, disabled }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 pt-2 hide-scrollbar w-full px-1">
      {tones.map((t) => {
        const Icon = t.icon;
        const isSelected = selectedTone === t.type;
        return (
          <button
            key={t.type}
            onClick={() => onSelectTone(t.type)}
            disabled={disabled}
            className={`
              flex flex-col items-center justify-center min-w-[80px] p-3 rounded-2xl transition-all duration-200 border
              ${isSelected 
                ? `${t.bg} border-${t.color.split('-')[1]}-300 ring-2 ring-${t.color.split('-')[1]}-400 ring-offset-1` 
                : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
            `}
          >
            <Icon className={`w-6 h-6 mb-1 ${isSelected ? t.color : 'text-gray-500'}`} />
            <span className={`text-xs font-medium ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
