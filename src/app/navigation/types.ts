import { Book } from '../../features/books/types/book.types';

export type AuthStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  List: undefined;
  Detail: { book: Book };
};
