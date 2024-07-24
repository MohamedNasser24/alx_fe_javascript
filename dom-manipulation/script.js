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
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p>- ${quote.author}</p>`;
  } else {
    quoteDisplay.innerHTML = '<p>No quotes available</p>';
  }
}

function addQuote(text, author, category) {
  if (text && author && category) {
    const newQuote = { text, author, category };
    quotes.push(newQuote);
    saveQuotes();
    showRandomQuote(); // Update displayed quote
  } else {
    alert('Please enter both a quote, an author, and a category.');
  }
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
      showRandomQuote(); // Update displayed quotes
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
  
  // Event listener for adding a new quote
  document.getElementById('addQuoteBtn').addEventListener('click', function() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteAuthor = document.getElementById('newQuoteAuthor').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;
    addQuote(quoteText, quoteAuthor, quoteCategory);
  });

  // Event listener for syncing quotes with server
  document.getElementById('syncQuotesBtn').addEventListener('click', syncQuotes);
});


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






