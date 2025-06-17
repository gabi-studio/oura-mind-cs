// utils/date.js

// Utility function to format date strings properly for display
// I was encountering issues with date strings being interpreted/ matched incorrectly

// I'm doing this because the string is in 'YYYY-MM-DD' format and it keeps assuming the time is UTC and sets the day back when displaying
// Reference 1: https://stackoverflow.com/questions/35205627/why-a-given-date-turns-into-a-day-before-when-using-new-date
// It seems that the time is defaulted to 8 PM the previous day
// So here I'm setting the time to noon to avoid this issue
function formatDateSafe(dateString) {
  if (!dateString) return 'No date';
  const [year, month, day] = dateString.split('-');
  const localDate = new Date(`${year}-${month}-${day}T12:00:00`);
  return localDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Toronto'
  });
}



// Export functions

export { 
    formatDateSafe 
};