// Enhance dark mode visibility for digits/numbers in input fields
document.addEventListener('DOMContentLoaded', function() {
  // Function to adjust input text colors based on theme
  function adjustInputColors() {
    const isDarkMode = document.body.classList.contains('dark-theme');
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      if (isDarkMode) {
        input.style.color = '#ffffff'; // Bright white in dark mode
        input.style.backgroundColor = '#2a2a2a'; // Darker background
      } else {
        input.style.color = '#1e293b'; // Original dark text color
        input.style.backgroundColor = '#ffffff'; // Original background
      }
    });
  }

  // Run once at startup
  adjustInputColors();
  
  // Listen for theme changes via the theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Wait a small moment for the theme class to be toggled
      setTimeout(adjustInputColors, 50);
    });
  }
  
  // Additional listener for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', adjustInputColors);
}); 