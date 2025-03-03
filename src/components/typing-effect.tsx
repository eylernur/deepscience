"use client";

import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Define the Paper interface here to match the one in search-results.tsx
interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  url: string;
  abstract?: string;
}

interface TypingEffectProps {
  text: string;
  speed?: number;
  showDirectly?: boolean;
  className?: string;
  papers?: Paper[];
  onTypingComplete?: () => void;
}

export function TypingEffect({
  text,
  speed = 30,
  showDirectly = false,
  className = "",
  papers = [],
  onTypingComplete
}: TypingEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showDirectly) {
      setDisplayText(text);
      if (onTypingComplete) {
        onTypingComplete();
      }
      return;
    }

    let currentIndex = 0;

    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeNextCharacter, speed);
      } else if (onTypingComplete) {
        onTypingComplete();
      }
    };

    timeoutRef.current = setTimeout(typeNextCharacter, speed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, showDirectly, onTypingComplete]);

  return (
    <div 
      className={`typing-effect ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, href, ...props }) => {
            return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
          }
        }}
      >
        {displayText}
      </ReactMarkdown>
    </div>
  );
} 