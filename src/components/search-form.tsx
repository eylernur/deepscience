"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

interface SearchFormProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  size?: 'default' | 'large';
}

export function SearchForm({ initialQuery = '', onSearch, size = 'default' }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch suggestions from the API
  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      if (data.suggestions?.length > 0 && isFocused) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Memoize fetchSuggestions to prevent unnecessary re-renders
  const memoizedFetchSuggestions = useCallback(fetchSuggestions, [isFocused]);

  // Debounce the input to avoid too many API calls
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length > 2 && isFocused && query !== initialQuery) {
      debounceTimerRef.current = setTimeout(() => {
        memoizedFetchSuggestions(query);
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, isFocused, memoizedFetchSuggestions, initialQuery]);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setShowSuggestions(false);
    onSearch(query.trim());
    
    // Reset searching state after submission
    setTimeout(() => setIsSearching(false), 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Focus search input when pressing '/'
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const inputClassName = size === 'large' 
    ? "w-full pl-12 pr-24 py-6 text-lg rounded-xl border-2 border-gray-200 focus:border-black transition-colors duration-200 shadow-sm hover:border-gray-300"
    : "w-full pl-12 pr-24 py-2 rounded-lg border border-gray-200 focus:border-black transition-colors duration-200";

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
          <Search size={20} />
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search 250M+ papers, e.g. 'Latest AI advances in healthcare' (Press '/' to focus)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setIsFocused(false)}
          className={inputClassName}
          disabled={isSearching}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <Button 
            type="submit" 
            disabled={!query.trim() || isSearching}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Search</span>
              </>
            )}
          </Button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div 
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {isLoadingSuggestions ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Loading suggestions...
              </div>
            ) : suggestions.length > 0 ? (
              <ul className="py-1">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-left"
                    onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            ) : query.trim().length > 2 && (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No suggestions found
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
} 