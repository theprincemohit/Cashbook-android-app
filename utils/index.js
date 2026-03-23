export const currencyFormat = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatDateTime = (dateString) => {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium', // 'medium' provides a format like Mar 25, 2026
    timeStyle: 'medium', // 'medium' provides a format like 2:34:56 AM
    hour12: true
}).format(new Date(dateString));
};