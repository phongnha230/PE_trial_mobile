import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../../shared/theme/colors';
import { GENRES, STATUSES, EXACT_MESSAGES } from '../../../shared/constants/appConstants';
import { validateBookForm, BookValidationErrors } from '../../../shared/utils/validators';
import { bookApi } from '../api/bookApi';
import { useAuth } from '../../auth/hooks/useAuth';
import { Book } from '../types/book.types';

interface BookFormProps {
  existingBooks: Book[];
}

export const BookForm: React.FC<BookFormProps> = ({ existingBooks }) => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState<string>('Choose genre');
  const [status, setStatus] = useState<string>('Choose status');
  const [rating, setRating] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<BookValidationErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

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

  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (hasSubmitted) {
      const errs = validate(text, author, genre, status, rating, notes);
      setErrors((prev) => ({ ...prev, title: errs.title }));
    }
  };

  const handleAuthorChange = (text: string) => {
    setAuthor(text);
    if (hasSubmitted) {
      const errs = validate(title, text, genre, status, rating, notes);
      setErrors((prev) => ({ ...prev, author: errs.author }));
    }
  };

  const handleGenreChange = (val: string) => {
    setGenre(val);
    if (hasSubmitted) {
      const errs = validate(title, author, val, status, rating, notes);
      setErrors((prev) => ({ ...prev, genre: errs.genre }));
    }
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    if (hasSubmitted) {
      const errs = validate(title, author, genre, val, rating, notes);
      setErrors((prev) => ({ ...prev, status: errs.status }));
    }
  };

  const handleRatingChange = (text: string) => {
    setRating(text);
    if (hasSubmitted) {
      const errs = validate(title, author, genre, status, text, notes);
      setErrors((prev) => ({ ...prev, rating: errs.rating }));
    }
  };

  const handleNotesChange = (text: string) => {
    setNotes(text);
    if (hasSubmitted) {
      const errs = validate(title, author, genre, status, rating, text);
      setErrors((prev) => ({ ...prev, notes: errs.notes }));
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    setErrorMessage('');
    setSuccessMessage('');

    const validationErrors = validate(title, author, genre, status, rating, notes);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      // Check duplicate
      const isDuplicate = existingBooks.some(
        (b) =>
          b.title.trim().toLowerCase() === title.trim().toLowerCase() &&
          b.author.trim().toLowerCase() === author.trim().toLowerCase()
      );

      if (isDuplicate) {
        setErrorMessage('A book with this title and author already exists.');
        setLoading(false);
        return;
      }

      await bookApi.addBook(user.uid, {
        title,
        author,
        genre,
        status,
        rating: rating.trim() !== '' ? parseInt(rating.trim(), 10) : null,
        notes,
      });

      // Clear form
      setTitle('');
      setAuthor('');
      setGenre('Choose genre');
      setStatus('Choose status');
      setRating('');
      setNotes('');
      setErrors({});
      setHasSubmitted(false);
      setSuccessMessage(EXACT_MESSAGES.BOOK_ADDED);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving book to Firestore');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View testID="book-form" style={styles.card}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setIsCollapsed(!isCollapsed)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <Ionicons name={isCollapsed ? 'add' : 'remove'} size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.cardTitle}>Add a book</Text>
            {isCollapsed && (
              <Text style={styles.cardSubtitle}>Tap to add new book to your shelf</Text>
            )}
          </View>
        </View>
        <View style={styles.badgeToggle}>
          <Text style={styles.toggleText}>{isCollapsed ? '+ New Book' : 'Close'}</Text>
          <Ionicons
            name={isCollapsed ? 'chevron-down' : 'chevron-up'}
            size={16}
            color={colors.primary}
          />
        </View>
      </TouchableOpacity>

      {!isCollapsed && (
        <View style={styles.formContent}>
          {/* Success banner */}
          {!!successMessage && (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text testID="book-success" style={styles.successText}>
                {successMessage}
              </Text>
            </View>
          )}

          {/* Error banner */}
          {!!errorMessage && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={colors.error} />
              <Text testID="error-book" style={styles.errorBannerText}>
                {errorMessage}
              </Text>
            </View>
          )}

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title ? styles.inputError : null]}
              placeholder="e.g. Dune"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={handleTitleChange}
            />
            {!!errors.title && (
              <Text style={styles.fieldErrorText}>{errors.title}</Text>
            )}
          </View>

          {/* Author */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Author *</Text>
            <TextInput
              style={[styles.input, errors.author ? styles.inputError : null]}
              placeholder="e.g. Frank Herbert"
              placeholderTextColor={colors.textSecondary}
              value={author}
              onChangeText={handleAuthorChange}
            />
            {!!errors.author && (
              <Text style={styles.fieldErrorText}>{errors.author}</Text>
            )}
          </View>

          {/* Genre and Status in 2 Columns */}
          <View style={styles.twoColRow}>
            {/* Genre */}
            <View style={[styles.inputGroup, styles.halfCol]}>
              <Text style={styles.inputLabel}>Genre *</Text>
              <View style={[styles.pickerWrapper, errors.genre ? styles.inputError : null]}>
                <Picker
                  selectedValue={genre}
                  onValueChange={handleGenreChange}
                  style={styles.picker}
                >
                  {GENRES.map((g) => (
                    <Picker.Item key={g} label={g} value={g} />
                  ))}
                </Picker>
              </View>
              {!!errors.genre && (
                <Text style={styles.fieldErrorText}>{errors.genre}</Text>
              )}
            </View>

            {/* Status */}
            <View style={[styles.inputGroup, styles.halfCol]}>
              <Text style={styles.inputLabel}>Status *</Text>
              <View style={[styles.pickerWrapper, errors.status ? styles.inputError : null]}>
                <Picker
                  selectedValue={status}
                  onValueChange={handleStatusChange}
                  style={styles.picker}
                >
                  {STATUSES.map((s) => (
                    <Picker.Item key={s} label={s} value={s} />
                  ))}
                </Picker>
              </View>
              {!!errors.status && (
                <Text style={styles.fieldErrorText}>{errors.status}</Text>
              )}
            </View>
          </View>

          {/* Rating */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Rating (0 - 5, optional)</Text>
            <TextInput
              style={[styles.input, errors.rating ? styles.inputError : null]}
              placeholder="0, 1, 2, 3, 4, or 5"
              placeholderTextColor={colors.textSecondary}
              value={rating}
              onChangeText={handleRatingChange}
              keyboardType="numeric"
            />
            {!!errors.rating && (
              <Text style={styles.fieldErrorText}>{errors.rating}</Text>
            )}
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes (optional, max 300 chars)</Text>
            <TextInput
              style={[styles.textArea, errors.notes ? styles.inputError : null]}
              placeholder="Personal reflections..."
              placeholderTextColor={colors.textSecondary}
              value={notes}
              onChangeText={handleNotesChange}
              multiline
              numberOfLines={2}
            />
            {!!errors.notes && (
              <Text style={styles.fieldErrorText}>{errors.notes}</Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, loading ? styles.disabledBtn : null]}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Save Book</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  badgeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCol: {
    flex: 1,
  },
  formContent: {
    marginTop: 14,
    gap: 10,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    height: 40,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    color: colors.text,
  },
  textArea: {
    height: 56,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
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
    height: Platform.OS === 'ios' ? 120 : 44,
  },
  inputError: {
    borderColor: colors.error,
  },
  fieldErrorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 2,
  },
  submitBtn: {
    height: 46,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    padding: 10,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600',
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
});
