
import React, { useState, useEffect, useRef } from 'react';
import { getSuggestions } from '../services/geminiService';
import { UserLocation } from '../types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  userLocation?: UserLocation;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, userLocation, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        const fetched = await getSuggestions(query, userLocation);
        setSuggestions(fetched);
        setShowSuggestions(fetched.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, userLocation]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-50">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full p-4 pl-12 text-sm text-slate-900 border border-slate-300 rounded-2xl bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
          placeholder="Search for restaurants, parks, or specific landmarks..."
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2.5 bottom-2 top-2 px-6 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:opacity-50 transition-all"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Search'}
        </button>
      </form>

      {showSuggestions && (
        <div className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
          <ul className="py-2">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex items-center w-full px-4 py-3 text-sm text-left text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  </svg>
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
