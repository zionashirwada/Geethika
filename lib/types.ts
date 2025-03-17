export interface Song {
  ID: string;
  Display_Name: string;
  Search_Name: string | null;
  Content: string;
  Language: string;
}

export interface SearchResult {
  songs: Song[];
  isLoading: boolean;
  error: string | null;
}