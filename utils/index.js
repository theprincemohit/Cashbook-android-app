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

export const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

export const formatDateForDisplayWithTime = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString(undefined, options);
};

export const filterDate = (dateString, endDate=undefined) => {
  switch (dateString) {
    case 'Today':
      const today = new Date();
      const todayFormatted = formatDateForInput(today);
      return { date_from: todayFormatted, date_to: todayFormatted };
    case 'This Week': {
      const today = new Date();
      const todayFormatted = formatDateForInput(today);
      const sevenDaysAgo = formatDateForInput(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
      return { date_from: sevenDaysAgo, date_to: todayFormatted };
    }
    case 'This Month': {
      const today = new Date();
      const todayFormatted = formatDateForInput(today);
      const firstDay = formatDateForInput(new Date(today.getFullYear(), today.getMonth(), 1));
      return { date_from: firstDay, date_to: todayFormatted };
    }
    case 'This Year': {
      const today = new Date();
      const todayFormatted = formatDateForInput(today);
      const firstDayOfYear = formatDateForInput(new Date(today.getFullYear(), 0, 1));
      return { date_from: firstDayOfYear, date_to: todayFormatted };
    }
    default:
      return { date_from: new Date(dateString), date_to: new Date(endDate) };
  }
}