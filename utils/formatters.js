/**
 * Format a timestamp into a human-readable time string
 * @param {Date} timestamp - Date object to format
 * @returns {string} Formatted time string
 */
export function formatTimestamp(timestamp) {
  if (!timestamp || !(timestamp instanceof Date)) {
    return '';
  }
  
  const now = new Date();
  const isToday = timestamp.toDateString() === now.toDateString();
  
  // Format options
  const timeOptions = { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  };
  
  // For messages from today, just show the time
  if (isToday) {
    return timestamp.toLocaleTimeString([], timeOptions);
  }
  
  // For older messages, include the date
  const dateOptions = {
    month: 'short',
    day: 'numeric',
    ...timeOptions
  };
  
  return timestamp.toLocaleString([], dateOptions);
}

/**
 * Truncate text to a maximum length and add ellipsis if needed
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength).trim() + '...';
} 