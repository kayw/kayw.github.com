export const formatDate = (date, locale = 'en-US') => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const now = new Date(date).toLocaleDateString(locale, options);
  return now;
};
