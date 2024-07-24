let quotes = [
  { text: "Quote 1", author: "Author 1", category: "Inspiration" },
  { text: "Quote 2", author: "Author 2", category: "Motivation" },
  { text: "Quote 3", author: "Author 3", category: "Inspiration" }
];

const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Example API endpoint

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

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

function addQuote(text, category) {
  if (text && category) {
    const newQuote = { text, author: 'Unknown', category }; // Assume author is fixed for simplicity
    quotes.push(newQuote);
    saveQuotes();
    showRandomQuote(); // Update displayed quote
    updateCategoryFilter(category); // Update category filter options
  } else {
    alert('Please enter both a quote and a category.');
  }
}

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

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) {
        throw new Error('Invalid JSON format');
      }
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    } catch (error) {
      alert('Error importing quotes: ' + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function syncQuotes() {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch quotes from server');
      }
      return response.json();
    })
    .then(data => {
      const serverQuotes = data.map(item => ({
        text: item.title,
        author: item.body,
        category: 'Synced', // Example: set a default category for server quotes
        updatedAt: new Date(item.updatedAt)
      }));
      mergeData(serverQuotes);
      saveQuotes(); // Save merged data to local storage
      displayQuotes(); // Update displayed quotes
      alert('Quotes synced with server!');
    })
    .catch(error => {
      console.error('Error syncing quotes:', error.message);
    });
}

function mergeData(serverQuotes) {
  serverQuotes.forEach(serverQuote => {
    const existingQuoteIndex = quotes.findIndex(quote => quote.text === serverQuote.text && quote.author === serverQuote.author);
    if (existingQuoteIndex !== -1) {
      // Update existing quote if server version is newer
      if (serverQuote.updatedAt > quotes[existingQuoteIndex].updatedAt) {
        quotes[existingQuoteIndex] = serverQuote;
        console.log(`Updated quote: ${serverQuote.text}`);
      }
    } else {
      // Add new quote from server
      quotes.push(serverQuote);
      console.log(`Added new quote: ${serverQuote.text}`);
    }
  });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  loadQuotes(); // Load quotes from local storage
  showRandomQuote(); // Display a random quote initially
  createAddQuoteForm(); // Create add quote form dynamically
  
  // Event listener for adding a new quote
  document.getElementById('addQuoteBtn').addEventListener('click', function() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;
    addQuote(quoteText, quoteCategory);
  });

  // Event listener for syncing quotes with server
  document.getElementById('syncQuotesBtn').addEventListener('click', syncQuotes);
});






