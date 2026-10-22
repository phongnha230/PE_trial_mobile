export interface BookData {
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

export interface StatusBreakdownItem {
  status: string;
  count: number;
}

/**
 * Sorts books alphabetically by title (not case-sensitive),
 * with equal titles ordered by author (not case-sensitive).
 */
export const sortBooks = (books: BookData[]): BookData[] => {
  return [...books].sort((a, b) => {
    const titleA = (a.title || '').toLowerCase();
    const titleB = (b.title || '').toLowerCase();
    const titleCmp = titleA.localeCompare(titleB);
    if (titleCmp !== 0) return titleCmp;

    const authorA = (a.author || '').toLowerCase();
    const authorB = (b.author || '').toLowerCase();
    return authorA.localeCompare(authorB);
  });
};

/**
 * Calculates status breakdown:
 * - One row per status that appears
 * - The status with the most books first
 * - Equal counts: To Read, then Reading, then Finished
 */
export const calculateStatusBreakdown = (
  books: BookData[]
): StatusBreakdownItem[] => {
  const counts: Record<string, number> = {};

  books.forEach((b) => {
    if (b.status) {
      counts[b.status] = (counts[b.status] || 0) + 1;
    }
  });

  const priority: Record<string, number> = {
    'To Read': 1,
    Reading: 2,
    Finished: 3,
  };

  return Object.keys(counts)
    .map((status) => ({
      status,
      count: counts[status],
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count; // most books first
      }
      return (priority[a.status] || 99) - (priority[b.status] || 99);
    });
};
