// Define an array to store quotes
let quotes = [];

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p>- ${quote.category}</p>`;
  } else {
    quoteDisplay.innerHTML = '<p>No quotes available</p>';
  }
}

// Function to add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  
  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    showRandomQuote(); // Update displayed quote
    updateCategoryFilter(category); // Update category filter options
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to update the category filter options
function updateCategoryFilter(newCategory) {
  const categoryFilter = document.getElementById('categoryFilter');
  if (newCategory && !categoryFilter.querySelector(`option[value="${newCategory}"]`)) {
    const option = document.createElement('option');
    option.value = newCategory;
    option.textContent = newCategory;
    categoryFilter.appendChild(option);
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Load quotes from local storage
  loadQuotes();
  
  // Display a random quote initially
  showRandomQuote();
  
  // Event listener for the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Event listener for the "Add Quote" button
  document.getElementById('addQuote').addEventListener('click', addQuote);
});


