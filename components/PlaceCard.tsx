
import React from 'react';
import { Place } from '../types';

interface PlaceCardProps {
  place: Place;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">{place.title}</h3>
          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">Place</span>
        </div>
        
        {place.snippet && (
          <p className="text-sm text-slate-600 mb-4 italic line-clamp-2">
            "{place.snippet}"
          </p>
        )}
        
        <a 
          href={place.uri} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          View on Maps
        </a>
      </div>
    </div>
  );
};
