// Initialize quotes array
let quotes = [
  { text: "Quote 1", author: "Author 1", category: "Inspiration" },
  { text: "Quote 2", author: "Author 2", category: "Motivation" },
  { text: "Quote 3", author: "Author 3", category: "Inspiration" }
];

const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Example API endpoint

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
    displayQuotes(); // Update displayed quotes after loading
    populateCategories(); // Populate category filter after loading
  }
}

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p>- ${quote.author}</p>`;
  } else {
    quoteDisplay.innerHTML = '<p>No quotes available</p>';
  }
}

// Function to populate categories in the dropdown filter
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = '';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize first letter
    categoryFilter.appendChild(option);
  });
}

// Function to add a new quote
function addQuote(text, category) {
  if (text && category) {
    const newQuote = { text, author: "Unknown", category }; // Assuming author is not provided
    quotes.push(newQuote);
    saveQuotes();
    showRandomQuote(); // Update displayed quote
    updateCategoryFilter(category); // Update category filter options
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  let filteredQuotes;
  if (selectedCategory === 'all') {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }
  displayQuotes(filteredQuotes);
  saveLastFilter(selectedCategory);
}

// Function to display quotes in the quote container
function displayQuotes(quotesToDisplay = quotes) {
  const quoteContainer = document.getElementById('quoteContainer');
  quoteContainer.innerHTML = ''; // Clear previous content
  quotesToDisplay.forEach(quote => {
    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `<blockquote>${quote.text}</blockquote><cite>${quote.author}</cite>`;
    quoteContainer.appendChild(quoteElement);
  });
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

// Function to export quotes to JSON file
function exportToJsonFile() {
  const quotesJson = JSON.stringify(quotes, null, 2);
  const blob = new Blob([quotesJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) {
        throw new Error('Invalid JSON format');
      }
      quotes.push(...importedQuotes); // Add imported quotes to the existing array
      saveQuotes(); // Save updated quotes to local storage
      displayQuotes(); // Update displayed quotes
      alert('Quotes imported successfully!');
    } catch (error) {
      alert('Error importing quotes: ' + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Load quotes from local storage
  loadQuotes();
  
  // Display a random quote initially
  showRandomQuote();
  
  // Event listener for the "Add Quote" button
  document.getElementById('addQuote').addEventListener('click', function(event) {
    event.preventDefault();
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
    addQuote(newQuoteText, newQuoteCategory);
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  });

  // Event listener for the category filter




