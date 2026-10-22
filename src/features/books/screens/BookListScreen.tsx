import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../../shared/theme/colors';
import { useAuth } from '../../auth/hooks/useAuth';
import { useBooks } from '../hooks/useBooks';
import { BookItem } from '../components/BookItem';
import { BookForm } from '../components/BookForm';
import { BookFilters } from '../components/BookFilters';
import { BookSummary } from '../components/BookSummary';
import { EmptyState } from '../../../shared/components/feedback/EmptyState';
import { sortBooks, calculateStatusBreakdown } from '../../../shared/utils/helpers';
import { Book, BookFilterState } from '../types/book.types';
import { AppStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'List'>;

export const BookListScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { books, loading, toggleFavorite } = useBooks();

  const [filters, setFilters] = useState<BookFilterState>({
    genre: 'All',
    status: 'All',
    favoritesOnly: false,
    searchQuery: '',
  });

  const handleFilterChange = (newFilters: Partial<BookFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      genre: 'All',
      status: 'All',
      favoritesOnly: false,
      searchQuery: '',
    });
  };

  // Filtered and sorted books list
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Filter by Genre
    if (filters.genre !== 'All') {
      result = result.filter((b) => b.genre === filters.genre);
    }

    // Filter by Status
    if (filters.status !== 'All') {
      result = result.filter((b) => b.status === filters.status);
    }

    // Filter by Favorites
    if (filters.favoritesOnly) {
      result = result.filter((b) => b.favorite === true);
    }

    // Filter by Search (title or author contains typed text, case-insensitive, spaces trimmed)
    const trimmedQuery = filters.searchQuery.trim().toLowerCase();
    if (trimmedQuery !== '') {
      result = result.filter(
        (b) =>
          (b.title && b.title.toLowerCase().includes(trimmedQuery)) ||
          (b.author && b.author.toLowerCase().includes(trimmedQuery))
      );
    }

    // Alphabetical order by title (case-insensitive; equal titles ordered by author)
    return sortBooks(result);
  }, [books, filters]);

  // Summary computations
  const summary = useMemo(() => {
    const totalCount = filteredBooks.length;
    const favoriteCount = filteredBooks.filter((b) => b.favorite).length;
    const breakdown = calculateStatusBreakdown(filteredBooks);

    return { totalCount, favoriteCount, breakdown };
  }, [filteredBooks]);

  return (
    <SafeAreaView testID="list-screen" style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.appName}>BookShelf</Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user?.email}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={logout}
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookItem
            book={item}
            onPress={() => navigation.navigate('Detail', { book: item })}
            onToggleFavorite={() => toggleFavorite(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Add Book Form */}
            <BookForm existingBooks={books} />

            {/* Filter & Search & Summary */}
            <View>
              <BookFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
              <BookSummary summary={summary} />
            </View>

            {/* List Heading */}
            <View style={styles.listHeadingRow}>
              <Text style={styles.listHeadingText}>Your Books</Text>
              <Text style={styles.listHeadingCount}>({filteredBooks.length})</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState testID="books-empty" message="No books found" />
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.primary} />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 6,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  listHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    marginTop: 16,
  },
  listHeadingText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  listHeadingCount: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
});
