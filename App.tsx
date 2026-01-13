
import React, { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { PlaceCard } from './components/PlaceCard';
import { searchPlaces } from './services/geminiService';
import { SearchResult, UserLocation } from './types';

function App() {
  const [userLocation, setUserLocation] = useState<UserLocation | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation not available or permission denied:", err);
        }
      );
    }
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await searchPlaces(query, userLocation);
      setResults(result);
    } catch (err) {
      setError("Failed to fetch results. Please check your API key and connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation]);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-blue-600 to-blue-800 text-white pt-16 pb-32 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Gemini Maps Explorer</h1>
          <p className="text-blue-100 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto">
            Discover the best places near you using the power of AI-enhanced grounding.
          </p>
          
          <SearchBar onSearch={handleSearch} userLocation={userLocation} isLoading={isLoading} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 -mt-16">
        {/* Status Messages */}
        {!results && !isLoading && !error && (
          <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📍</div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Ready to explore?</h2>
              <p className="text-slate-500">Search for any destination, restaurant, or point of interest to see grounded results from Google Maps.</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white h-48 rounded-xl shadow-sm border border-slate-100 animate-pulse"></div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Search Results */}
        {results && !isLoading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* AI Summary */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mr-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <h2 className="text-xl font-bold text-slate-800">Gemini Intelligence</h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {results.text}
              </div>
            </div>

            {/* Places Grid */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                </svg>
                Grounded Locations
              </h2>
              {results.places.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.places.map((place, idx) => (
                    <PlaceCard key={`${place.uri}-${idx}`} place={place} />
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-3xl text-center">
                  <p className="text-slate-400">No specific map markers found, but check the summary above for more information.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-10 text-center text-slate-400 text-sm">
        <p>Built with Gemini 2.5 & Google Maps Grounding</p>
      </footer>
    </div>
  );
}

export default App;
