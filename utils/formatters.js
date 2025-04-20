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

/**
 * Convert a number to words (Indian number system)
 * @param {number} num - Number to convert to words
 * @returns {string} Number in words
 */
export function numberToWords(num) {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  
  function convertLessThanThousand(n) {
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
    return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  }
  
  let words = '';
  
  // Handle crores (10 million)
  if (num >= 10000000) {
    words += convertLessThanThousand(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }
  
  // Handle lakhs (100,000)
  if (num >= 100000) {
    words += convertLessThanThousand(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }
  
  // Handle thousands
  if (num >= 1000) {
    words += convertLessThanThousand(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  
  // Handle remaining part
  if (num > 0) {
    words += convertLessThanThousand(num);
  }
  
  return words.trim();
}

/**
 * Format currency amount in words for Indian Rupees
 * @param {number} amount - Amount to format
 * @returns {string} Amount in words with currency
 */
export function formatCurrencyInWords(amount) {
  if (amount === null || amount === undefined) return '';
  
  // Round to 2 decimal places
  const roundedAmount = Math.round(amount * 100) / 100;
  
  // Split amount into rupees and paise
  const rupees = Math.floor(roundedAmount);
  const paise = Math.round((roundedAmount - rupees) * 100);
  
  let result = 'Rupees ' + numberToWords(rupees);
  
  if (paise > 0) {
    result += ' and ' + numberToWords(paise) + ' Paise';
  }
  
  return result + ' Only';
}

/**
 * Format a date string into a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a number as Indian currency (INR)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount with ₹ symbol
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a phone number with proper spacing
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export function formatPhone(phone) {
  if (!phone) return '';
  
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format as per Indian standards (e.g., 98765 43210)
  if (digits.length === 10) {
    return digits.replace(/(\d{5})(\d{5})/, '$1 $2');
  }
  
  return phone; // Return as is if not a standard 10-digit number
} 