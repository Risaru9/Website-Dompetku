"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none bg-white"
      >
        <span className="font-bold text-slate-800 text-lg">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-600 transition-transform duration-300" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 transition-transform duration-300" />
        )}
      </button>
      
      {/* Animasi Smooth menggunakan max-height */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4 bg-slate-50/50">
          {answer}
        </div>
      </div>
    </div>
  );
}