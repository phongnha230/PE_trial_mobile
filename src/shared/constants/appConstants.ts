export const GENRES = [
  'Choose genre',
  'Fiction',
  'Non-Fiction',
  'Academic',
  'Other',
] as const;

export const STATUSES = [
  'Choose status',
  'To Read',
  'Reading',
  'Finished',
] as const;

export const FILTER_GENRES = [
  'All',
  'Fiction',
  'Non-Fiction',
  'Academic',
  'Other',
] as const;

export const FILTER_STATUSES = [
  'All',
  'To Read',
  'Reading',
  'Finished',
] as const;

export const EXACT_MESSAGES = {
  // Auth Form Errors
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  PASSWORDS_NOT_MATCH: 'Passwords do not match',

  // Auth Success
  REGISTRATION_SUCCESSFUL: 'Registration successful',

  // Book Form Errors
  TITLE_REQUIRED: 'Title is required',
  TITLE_MAX_LENGTH: 'Title must be at most 100 characters',
  AUTHOR_REQUIRED: 'Author is required',
  AUTHOR_MAX_LENGTH: 'Author must be at most 60 characters',
  GENRE_REQUIRED: 'Please choose a genre',
  STATUS_REQUIRED: 'Please choose a status',
  RATING_INVALID: 'Rating must be a whole number from 0 to 5',
  NOTES_MAX_LENGTH: 'Notes must be at most 300 characters',

  // Book Success
  BOOK_ADDED: 'Book added',

  // Empty list
  NO_BOOKS_FOUND: 'No books found',
} as const;
