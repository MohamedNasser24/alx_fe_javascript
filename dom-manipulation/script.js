// Initialize quotes array
let quotes = [{ text: "Quote 1", author: "Author 1", category: "Inspiration" },
  { text: "Quote 2", author: "Author 2", category: "Motivation" },
  { text: "Quote 3", author: "Author 3", category: "Inspiration" }];
const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Example API endpoint

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
    const newQuote = { text, category };
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
// Simulate fetching data from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch quotes from server');
    }
    const data = await response.json();
    // Assume server returns an array of quotes
    return data.map(item => ({
      id: item.id,
      text: item.title, // Assuming title as quote text
      author: item.body, // Assuming body as quote author
      updatedAt: new Date(item.updatedAt) // Assuming updatedAt field for last updated time
    }));
  } catch (error) {
    console.error('Error fetching quotes from server:', error.message);
    return []; // Return empty array on error
  }
}
// Simulate updating data on the server
async function updateQuotesOnServer(newQuote) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        title: newQuote.text,
        body: newQuote.author,
        userId: 1 // Example user ID for JSONPlaceholder
      })
    });
    if (!response.ok) {
      throw new Error('Failed to add quote to server');
    }
    const data = await response.json();
    return {
      id: data.id,
      text: newQuote.text,
      author: newQuote.author,
      updatedAt: new Date(data.updatedAt) // Assuming updatedAt field for last updated time
    };
  } catch (error) {
    console.error('Error adding quote to server:', error.message);
    return null; // Return null on error
  }
}
// Function to merge server data with local data
function mergeData(serverQuotes) {
  serverQuotes.forEach(serverQuote => {
    const existingQuoteIndex = quotes.findIndex(quote => quote.id === serverQuote.id);
    if (existingQuoteIndex !== -1) {
      // Update existing quote if server version is newer
      if (serverQuote.updatedAt > quotes[existingQuoteIndex].updatedAt) {
        quotes[existingQuoteIndex] = serverQuote;
        // Notify user or handle conflict resolution
        console.log(`Updated quote ${serverQuote.id} from server`);
      }
    } else {
      // Add new quote from server
      quotes.push(serverQuote);
      console.log(`Added new quote ${serverQuote.id} from server`);
    }
  });
}
// Function to sync quotes with the server
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    mergeData(serverQuotes);
    saveQuotes(); // Save merged data to local storage
    displayQuotes(); // Update displayed quotes
    console.log('Data synced from server');
  } catch (error) {
    console.error('Error syncing quotes:', error.message);
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
 fileReader.readAsText(event.target.files[0]);
}
// Initialize by loading quotes from local storage
loadQuotes();
// Initialize by loading quotes from local storage
loadQuotes();

// Example function to add a new quote (you'll integrate this into your existing code)
function addQuote(newQuote) {
  updateQuotesOnServer(newQuote)
    .then(serverQuote => {
      if (serverQuote) {
        quotes.push(serverQuote);
        saveQuotes(); // Save to local storage after adding
        displayQuotes(); // Update displayed quotes
      } else {
        console.error('Failed to add quote to server.');
      }
    })
    .catch(error => {
      console.error('Error adding quote:', error.message);
    });
}

// Example usage:
// Assume adding a new quote triggers this function:
const newQuote = { text: "New Quote", author: "New Author", updatedAt: new Date() };
addQuote(newQuote);

// Periodically sync data from server every 5 minutes (adjust timing as needed)
setInterval(syncQuotes, 300000); // Sync quotes every 5 minutes



