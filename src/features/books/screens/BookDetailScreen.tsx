import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../../shared/theme/colors';
import { useAuth } from '../../auth/hooks/useAuth';
import { bookApi } from '../api/bookApi';
import { GENRES, STATUSES } from '../../../shared/constants/appConstants';
import { validateBookForm, BookValidationErrors } from '../../../shared/utils/validators';
import { Book } from '../types/book.types';
import { AppStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'Detail'>;

export const BookDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { book: initialBook } = route.params;
  const { user } = useAuth();

  const [book, setBook] = useState<Book>(initialBook);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [title, setTitle] = useState(initialBook.title);
  const [author, setAuthor] = useState(initialBook.author);
  const [genre, setGenre] = useState(initialBook.genre);
  const [status, setStatus] = useState(initialBook.status);
  const [rating, setRating] = useState(
    initialBook.rating !== undefined && initialBook.rating !== null
      ? String(initialBook.rating)
      : ''
  );
  const [notes, setNotes] = useState(initialBook.notes || '');

  const [errors, setErrors] = useState<BookValidationErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const validate = (t: string, a: string, g: string, s: string, r: string, n: string) => {
    return validateBookForm({
      title: t,
      author: a,
      genre: g,
      status: s,
      rating: r,
      notes: n,
    });
  };

  const handleToggleFavorite = async () => {
    try {
      const newFav = !book.favorite;
      setBook((prev) => ({ ...prev, favorite: newFav }));
      await bookApi.updateBook(book.id, { favorite: newFav });
    } catch (err) {
      Alert.alert('Error', 'Failed to update favorite status');
      setBook((prev) => ({ ...prev, favorite: !prev.favorite }));
    }
  };

  const handleStartEdit = () => {
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setStatus(book.status);
    setRating(
      book.rating !== undefined && book.rating !== null ? String(book.rating) : ''
    );
    setNotes(book.notes || '');
    setErrors({});
    setHasSubmitted(false);
    setEditError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    setHasSubmitted(false);
    setEditError('');
  };

  const handleSaveEdit = async () => {
    setHasSubmitted(true);
    setEditError('');

    const validationErrors = validate(title, author, genre, status, rating, notes);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!user) return;

    setSaveLoading(true);
    try {
      // Check duplicate title + author (excluding current book)
      const isDuplicate = await bookApi.checkDuplicate(
        user.uid,
        title,
        author,
        book.id
      );

      if (isDuplicate) {
        setEditError('A book with this title and author already exists.');
        setSaveLoading(false);
        return;
      }

      const updateData = {
        title: title.trim(),
        author: author.trim(),
        genre,
        status,
        rating: rating.trim() !== '' ? parseInt(rating.trim(), 10) : null,
        notes: notes.trim(),
      };

      await bookApi.updateBook(book.id, updateData);

      setBook((prev) => ({
        ...prev,
        ...updateData,
      }));
      setIsEditing(false);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update book');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteBook = () => {
    Alert.alert(
      'Delete Book',
      `Are you sure you want to delete "${book.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleteLoading(true);
            try {
              await bookApi.deleteBook(book.id);
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete book');
              setDeleteLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Book' : 'Book Details'}
        </Text>
        <TouchableOpacity
          style={styles.favHeaderBtn}
          onPress={handleToggleFavorite}
          accessibilityRole="button"
        >
          <Ionicons
            name={book.favorite ? 'star' : 'star-outline'}
            size={26}
            color={book.favorite ? colors.star : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {!isEditing ? (
          /* VIEW MODE */
          <View style={styles.viewCard}>
            <View style={styles.viewHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.viewTitle}>{book.title}</Text>
                <Text style={styles.viewAuthor}>by {book.author}</Text>
              </View>
              <TouchableOpacity
                onPress={handleToggleFavorite}
                style={styles.viewFavBadge}
              >
                <Ionicons
                  name={book.favorite ? 'star' : 'star-outline'}
                  size={24}
                  color={book.favorite ? colors.star : colors.starEmpty}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.genreBadge}>
                <Ionicons name="folder-outline" size={14} color={colors.primary} />
                <Text style={styles.genreBadgeText}>{book.genre}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  book.status === 'Finished'
                    ? { backgroundColor: colors.badgeFinished }
                    : book.status === 'Reading'
                    ? { backgroundColor: colors.badgeReading }
                    : { backgroundColor: colors.badgeToRead },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
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

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rating:</Text>
              <Text style={styles.detailValue}>
                {book.rating !== null && book.rating !== undefined
                  ? `${book.rating} / 5 ★`
                  : 'Not rated'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Notes:</Text>
              <Text style={styles.detailValueNotes}>
                {book.notes ? book.notes : 'No notes added'}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={handleStartEdit}
                accessibilityRole="button"
              >
                <Ionicons name="pencil" size={18} color="#FFFFFF" />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleDeleteBook}
                disabled={deleteLoading}
                accessibilityRole="button"
              >
                {deleteLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* EDIT MODE */
          <View style={styles.editCard}>
            {!!editError && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color={colors.error} />
                <Text style={styles.errorBannerText}>{editError}</Text>
              </View>
            )}

            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={[styles.input, errors.title ? styles.inputError : null]}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (hasSubmitted) {
                    const errs = validate(text, author, genre, status, rating, notes);
                    setErrors((prev) => ({ ...prev, title: errs.title }));
                  }
                }}
              />
              {!!errors.title && (
                <Text style={styles.errorText}>{errors.title}</Text>
              )}
            </View>

            {/* Author */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Author</Text>
              <TextInput
                style={[styles.input, errors.author ? styles.inputError : null]}
                value={author}
                onChangeText={(text) => {
                  setAuthor(text);
                  if (hasSubmitted) {
                    const errs = validate(title, text, genre, status, rating, notes);
                    setErrors((prev) => ({ ...prev, author: errs.author }));
                  }
                }}
              />
              {!!errors.author && (
                <Text style={styles.errorText}>{errors.author}</Text>
              )}
            </View>

            {/* Genre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Genre</Text>
              <View style={[styles.pickerWrapper, errors.genre ? styles.inputError : null]}>
                <Picker
                  selectedValue={genre}
                  onValueChange={(val) => {
                    setGenre(val);
                    if (hasSubmitted) {
                      const errs = validate(title, author, val, status, rating, notes);
                      setErrors((prev) => ({ ...prev, genre: errs.genre }));
                    }
                  }}
                  style={styles.picker}
                >
                  {GENRES.map((g) => (
                    <Picker.Item key={g} label={g} value={g} />
                  ))}
                </Picker>
              </View>
              {!!errors.genre && (
                <Text style={styles.errorText}>{errors.genre}</Text>
              )}
            </View>

            {/* Status */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={[styles.pickerWrapper, errors.status ? styles.inputError : null]}>
                <Picker
                  selectedValue={status}
                  onValueChange={(val) => {
                    setStatus(val);
                    if (hasSubmitted) {
                      const errs = validate(title, author, genre, val, rating, notes);
                      setErrors((prev) => ({ ...prev, status: errs.status }));
                    }
                  }}
                  style={styles.picker}
                >
                  {STATUSES.map((s) => (
                    <Picker.Item key={s} label={s} value={s} />
                  ))}
                </Picker>
              </View>
              {!!errors.status && (
                <Text style={styles.errorText}>{errors.status}</Text>
              )}
            </View>

            {/* Rating */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rating (0-5, optional)</Text>
              <TextInput
                style={[styles.input, errors.rating ? styles.inputError : null]}
                value={rating}
                placeholder="0 to 5"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                onChangeText={(text) => {
                  setRating(text);
                  if (hasSubmitted) {
                    const errs = validate(title, author, genre, status, text, notes);
                    setErrors((prev) => ({ ...prev, rating: errs.rating }));
                  }
                }}
              />
              {!!errors.rating && (
                <Text style={styles.errorText}>{errors.rating}</Text>
              )}
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (optional, max 300 characters)</Text>
              <TextInput
                style={[styles.textArea, errors.notes ? styles.inputError : null]}
                value={notes}
                placeholder="Personal reflections..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                onChangeText={(text) => {
                  setNotes(text);
                  if (hasSubmitted) {
                    const errs = validate(title, author, genre, status, rating, text);
                    setErrors((prev) => ({ ...prev, notes: errs.notes }));
                  }
                }}
              />
              {!!errors.notes && (
                <Text style={styles.errorText}>{errors.notes}</Text>
              )}
            </View>

            {/* Save & Cancel Buttons */}
            <View style={styles.editActionRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCancelEdit}
                accessibilityRole="button"
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, saveLoading ? styles.disabledBtn : null]}
                onPress={handleSaveEdit}
                disabled={saveLoading}
                accessibilityRole="button"
              >
                {saveLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
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
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  favHeaderBtn: {
    padding: 6,
  },
  container: {
    padding: 16,
  },
  viewCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  viewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  viewTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  viewAuthor: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  viewFavBadge: {
    padding: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  genreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  genreBadgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  detailRow: {
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: colors.text,
  },
  detailValueNotes: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  editCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    height: 48,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.text,
  },
  textArea: {
    height: 80,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 120 : 48,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorBg,
    padding: 10,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  errorBannerText: {
    color: colors.error,
    fontSize: 13,
    flex: 1,
  },
  editActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  saveBtn: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  disabledBtn: {
    opacity: 0.7,
  },
});
