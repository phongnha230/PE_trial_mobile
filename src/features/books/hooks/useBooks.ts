import { useState, useEffect } from 'react';
import { bookApi } from '../api/bookApi';
import { Book } from '../types/book.types';
import { useAuth } from '../../auth/hooks/useAuth';

export const useBooks = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setBooks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = bookApi.subscribeUserBooks(
      user.uid,
      (updatedBooks) => {
        setBooks(updatedBooks);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Error fetching books');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const toggleFavorite = async (book: Book) => {
    try {
      const newFav = !book.favorite;
      await bookApi.updateBook(book.id, { favorite: newFav });
    } catch (err: any) {
      throw err;
    }
  };

  return {
    books,
    loading,
    error,
    toggleFavorite,
  };
};
