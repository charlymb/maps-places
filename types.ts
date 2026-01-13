
export interface Place {
  title: string;
  uri: string;
  description?: string;
  rating?: number;
  snippet?: string;
}

export interface SearchResult {
  text: string;
  places: Place[];
}

export interface Suggestion {
  id: string;
  text: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}
