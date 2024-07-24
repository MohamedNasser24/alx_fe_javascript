// Initialize quotes array
let quotes = [];
// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}
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
function addQuote(text, category) {
  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    showRandomQuote(); // Update displayed quote
    updateCategoryFilter(category); // Update category filter options
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Function to create and add a new quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');
  
  const form = document.createElement('form');
  
  const quoteInput = document.createElement('input');
  quoteInput.setAttribute('type', 'text');
  quoteInput.setAttribute('placeholder', 'Enter a new quote');
  quoteInput.setAttribute('id', 'newQuoteText');
  form.appendChild(quoteInput);
  
  const categoryInput = document.createElement('input');
  categoryInput.setAttribute('type', 'text');
  categoryInput.setAttribute('placeholder', 'Enter quote category');
  categoryInput.setAttribute('id', 'newQuoteCategory');
  form.appendChild(categoryInput);
  
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', function(event) {
    event.preventDefault();
    const text = quoteInput.value.trim();
    const category = categoryInput.value.trim();
    addQuote(text, category);
    quoteInput.value = '';
    categoryInput.value = '';
  });
  form.appendChild(addButton);
  
  formContainer.appendChild(form);
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
  
  // Create add quote form
  createAddQuoteForm();
  
  // Event listener for the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
});

// Initialize by loading quotes from local storage
loadQuotes();



