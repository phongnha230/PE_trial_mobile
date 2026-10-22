import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { Book } from '../types/book.types';

interface BookItemProps {
  book: Book;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const BookItem: React.FC<BookItemProps> = ({
  book,
  onPress,
  onToggleFavorite,
}) => {
  return (
    <TouchableOpacity
      testID="book-item"
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <View style={styles.mainInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>

        <View style={styles.tagsRow}>
          <View style={styles.genreTag}>
            <Text style={styles.genreTagText}>{book.genre}</Text>
          </View>
          <View
            style={[
              styles.statusTag,
              book.status === 'Finished'
                ? { backgroundColor: colors.badgeFinished }
                : book.status === 'Reading'
                ? { backgroundColor: colors.badgeReading }
                : { backgroundColor: colors.badgeToRead },
            ]}
          >
            <Text
              style={[
                styles.statusTagText,
                book.status === 'Finished'
                  ? { color: colors.badgeFinishedText }
                  : book.status === 'Reading'
                  ? { color: colors.badgeReadingText }
                  : { color: colors.badgeToReadText },
              ]}
            >
              {book.status}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.starButton}
        onPress={onToggleFavorite}
        accessibilityRole="button"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={book.favorite ? 'star' : 'star-outline'}
          size={24}
          color={book.favorite ? colors.star : colors.starEmpty}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  mainInfo: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  author: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genreTag: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  genreTagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  statusTag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  starButton: {
    padding: 8,
  },
});
