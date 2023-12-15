export const formatDate = (date: string, locale = 'en-US') => {
  const options: {
    year?: 'numeric' | '2-digit' | undefined;
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined;
    day?: 'numeric' | '2-digit' | undefined;
  } = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const now = new Date(date).toLocaleDateString(locale, options);
  return now;
};
