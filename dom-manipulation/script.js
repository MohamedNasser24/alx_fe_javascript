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

// Function to add a new quote
function addQuote(text, author, category) {
  if (text && author && category) {
    const newQuote = { text, author, category };
    quotes.push(newQuote);
    saveQuotes();
    showRandomQuote(); // Update displayed quote
    updateCategoryFilter(category); // Update category filter options
  } else {
    alert('Please enter both a quote, an author, and a category.');
  }
}

// Function to fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch quotes from server');
    }
    const data = await response.json();
    return data.map(item => ({
      id: item.id,
      text: item.title,
      author: item.body,
      category: 'Synced', // Example: set a default category for server quotes
      updatedAt: new Date(item.updatedAt)
    }));
  } catch (error) {
    console.error('Error fetching quotes from server:', error.message);
    return [];
  }
}

// Function to update quotes on the server
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
      updatedAt: new Date(data.updatedAt)
    };
  } catch (error) {
    console.error('Error adding quote to server:', error.message);
    return null;
  }
}

// Function to merge server data with local data
function mergeData(serverQuotes) {
  serverQuotes.forEach(serverQuote => {
    const existingQuoteIndex = quotes.findIndex(quote => quote.id === serverQuote.id);
    if (existingQuoteIndex !== -1) {
      if (serverQuote.updatedAt > quotes[existingQuoteIndex].updatedAt) {
        quotes[existingQuoteIndex] = serverQuote;
        console.log(`Updated quote ${serverQuote.id} from server`);
      }
    } else {
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
    showRandomQuote(); // Update displayed quotes
    console.log('Data synced from server');
    alert('Quotes synced with server!');
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

// Periodically sync data from server every 5 minutes (adjust timing as needed)
setInterval(syncQuotes, 300000); // Sync quotes every 5 minutes







