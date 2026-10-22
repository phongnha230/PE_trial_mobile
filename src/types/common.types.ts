export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface FormErrorMap {
  [key: string]: string | undefined;
}
