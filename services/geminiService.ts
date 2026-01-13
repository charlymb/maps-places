
import { GoogleGenAI } from "@google/genai";
import { UserLocation, Place, SearchResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSuggestions = async (query: string, location?: UserLocation): Promise<string[]> => {
  if (!query || query.length < 2) return [];

  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Suggest 5 specific and real place names or categories starting with or matching "${query}" for a Google Maps search. Return only the names as a list.`,
      config: {
        systemInstruction: "You are a helpful assistant providing search suggestions for a maps application. Keep suggestions concise and relevant.",
        temperature: 0.1,
      },
    });

    const text = response.text || "";
    return text.split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 5);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};

export const searchPlaces = async (query: string, location?: UserLocation): Promise<SearchResult> => {
  const ai = getAI();
  
  const toolConfig = location ? {
    retrievalConfig: {
      latLng: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    }
  } : undefined;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Search for "${query}" on Google Maps. Provide a summary and list specific places.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig,
      },
    });

    const text = response.text || "No results found.";
    const places: Place[] = [];

    // Extract grounding chunks
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.maps) {
          places.push({
            title: chunk.maps.title,
            uri: chunk.maps.uri,
            snippet: chunk.maps.placeAnswerSources?.[0]?.reviewSnippets?.[0]
          });
        }
      });
    }

    return { text, places };
  } catch (error) {
    console.error("Error searching places:", error);
    return { text: "An error occurred while searching. Please try again.", places: [] };
  }
};
