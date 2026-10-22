import { EXACT_MESSAGES } from '../constants/appConstants';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateEmail = (email: string): string | undefined => {
  if (!email || email.trim() === '') {
    return EXACT_MESSAGES.EMAIL_REQUIRED;
  }
  if (!isValidEmail(email)) {
    return EXACT_MESSAGES.EMAIL_INVALID;
  }
  return undefined;
};

export const validatePassword = (
  password: string,
  isRegister: boolean = false
): string | undefined => {
  if (!password) {
    return EXACT_MESSAGES.PASSWORD_REQUIRED;
  }
  if (isRegister && password.length < 6) {
    return EXACT_MESSAGES.PASSWORD_MIN_LENGTH;
  }
  return undefined;
};

export const validateConfirmPassword = (
  confirmPassword: string,
  password: string
): string | undefined => {
  if (!confirmPassword) {
    return EXACT_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
  }
  if (confirmPassword !== password) {
    return EXACT_MESSAGES.PASSWORDS_NOT_MATCH;
  }
  return undefined;
};

export interface BookFormInput {
  title: string;
  author: string;
  genre: string;
  status: string;
  rating?: string | number | null;
  notes?: string;
}

export interface BookValidationErrors {
  title?: string;
  author?: string;
  genre?: string;
  status?: string;
  rating?: string;
  notes?: string;
}

export const validateBookForm = (data: BookFormInput): BookValidationErrors => {
  const errors: BookValidationErrors = {};
  const trimmedTitle = data.title ? data.title.trim() : '';
  const trimmedAuthor = data.author ? data.author.trim() : '';

  // Title
  if (!trimmedTitle) {
    errors.title = EXACT_MESSAGES.TITLE_REQUIRED;
  } else if (trimmedTitle.length > 100) {
    errors.title = EXACT_MESSAGES.TITLE_MAX_LENGTH;
  }

  // Author
  if (!trimmedAuthor) {
    errors.author = EXACT_MESSAGES.AUTHOR_REQUIRED;
  } else if (trimmedAuthor.length > 60) {
    errors.author = EXACT_MESSAGES.AUTHOR_MAX_LENGTH;
  }

  // Genre
  if (!data.genre || data.genre === 'Choose genre') {
    errors.genre = EXACT_MESSAGES.GENRE_REQUIRED;
  }

  // Status
  if (!data.status || data.status === 'Choose status') {
    errors.status = EXACT_MESSAGES.STATUS_REQUIRED;
  }

  // Rating (only if filled in)
  if (
    data.rating !== '' &&
    data.rating !== null &&
    data.rating !== undefined
  ) {
    const rStr = String(data.rating).trim();
    const num = Number(rStr);
    if (!/^\d+$/.test(rStr) || isNaN(num) || num < 0 || num > 5) {
      errors.rating = EXACT_MESSAGES.RATING_INVALID;
    }
  }

  // Notes
  if (data.notes && data.notes.length > 300) {
    errors.notes = EXACT_MESSAGES.NOTES_MAX_LENGTH;
  }

  return errors;
};
