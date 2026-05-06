"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleJobDescriptionProps {
  description: string;
}

export function CollapsibleJobDescription({ description }: CollapsibleJobDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <div 
        className={`prose prose-invert prose-indigo max-w-none break-words [overflow-wrap:anywhere] job-description-content transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-none" : "max-h-48 overflow-hidden"
        }`}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      
      {!isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
      )}
      
      <div className={`flex justify-center ${isExpanded ? "mt-6" : "absolute bottom-0 left-0 right-0 translate-y-1/2 z-10"}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 h-8 px-4 shadow-lg"
        >
          {isExpanded ? (
            <>
              Hide Entire JD
              <ChevronUp className="ml-1 h-3 w-3" />
            </>
          ) : (
            <>
              View Entire JD
              <ChevronDown className="ml-1 h-3 w-3" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
