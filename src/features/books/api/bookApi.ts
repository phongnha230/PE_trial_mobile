import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../../shared/services/firebase/firebaseConfig';
import { Book } from '../types/book.types';

export const bookApi = {
  subscribeUserBooks: (
    userId: string,
    onSuccess: (books: Book[]) => void,
    onError: (error: any) => void
  ): Unsubscribe => {
    const q = query(collection(db, 'books'), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const books: Book[] = [];
        snapshot.forEach((docSnap) => {
          books.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        onSuccess(books);
      },
      (error) => {
        onError(error);
      }
    );
  },

  checkDuplicate: async (
    userId: string,
    title: string,
    author: string,
    excludeBookId?: string
  ): Promise<boolean> => {
    const q = query(collection(db, 'books'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const normalizedTitle = title.trim().toLowerCase();
    const normalizedAuthor = author.trim().toLowerCase();

    return snapshot.docs.some((docSnap) => {
      if (excludeBookId && docSnap.id === excludeBookId) {
        return false;
      }
      const data = docSnap.data();
      const docTitle = (data.title || '').trim().toLowerCase();
      const docAuthor = (data.author || '').trim().toLowerCase();
      return docTitle === normalizedTitle && docAuthor === normalizedAuthor;
    });
  },

  addBook: async (
    userId: string,
    bookData: {
      title: string;
      author: string;
      genre: string;
      status: string;
      rating?: number | null;
      notes?: string;
    }
  ) => {
    const payload = {
      userId,
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      genre: bookData.genre,
      status: bookData.status,
      rating: bookData.rating ?? null,
      favorite: false,
      notes: bookData.notes ? bookData.notes.trim() : '',
      createdAt: serverTimestamp(),
    };
    return addDoc(collection(db, 'books'), payload);
  },

  updateBook: async (
    bookId: string,
    updateData: {
      title?: string;
      author?: string;
      genre?: string;
      status?: string;
      rating?: number | null;
      favorite?: boolean;
      notes?: string;
    }
  ) => {
    const docRef = doc(db, 'books', bookId);
    return updateDoc(docRef, updateData);
  },

  deleteBook: async (bookId: string) => {
    const docRef = doc(db, 'books', bookId);
    return deleteDoc(docRef);
  },
};
