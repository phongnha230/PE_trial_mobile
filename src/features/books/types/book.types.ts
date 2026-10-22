export type GenreType = 'Fiction' | 'Non-Fiction' | 'Academic' | 'Other';
export type StatusType = 'To Read' | 'Reading' | 'Finished';

export interface Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  genre: string;
  status: string;
  rating?: number | null;
  favorite: boolean;
  notes?: string;
  createdAt?: any;
}

export interface BookFilterState {
  genre: string;
  status: string;
  favoritesOnly: boolean;
  searchQuery: string;
}

export interface StatusBreakdown {
  status: string;
  count: number;
}

export interface BookSummaryData {
  totalCount: number;
  favoriteCount: number;
  breakdown: StatusBreakdown[];
}
