// Example data structure for quotes (assuming they have an id and last updated timestamp)
let quotes = [
  { id: 1, text: "Quote 1", author: "Author 1", updatedAt: new Date('2024-07-25T08:00:00Z') },
  { id: 2, text: "Quote 2", author: "Author 2", updatedAt: new Date('2024-07-25T09:00:00Z') },
  { id: 3, text: "Quote 3", author: "Author 3", updatedAt: new Date('2024-07-25T10:00:00Z') }
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
    displayQuotes(); // Display quotes after loading
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
      body: JSON.stringify({
        title: newQuote.text,
        body: newQuote.author,
        userId: 1 // Example user ID for JSONPlaceholder
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
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

// Function to periodically sync data from server
function syncDataFromServer() {
  fetchQuotesFromServer()
    .then(serverQuotes => {
      mergeData(serverQuotes);
      saveQuotes(); // Save merged data to local storage
      displayQuotes(); // Update displayed quotes
      console.log('Data synced from server');
    })
    .catch(error => {
      console.error('Error syncing data from server:', error.message);
    });
}

// Example conflict resolution UI/notification
function notifyConflictResolved() {
  alert('Conflicts resolved. Data is now up to date.');
}

// Function to display quotes in the quote container
function displayQuotes() {
  const quoteContainer = document.getElementById('quoteContainer');
  quoteContainer.innerHTML = ''; // Clear previous content
  quotes.forEach((quote, index) => {
    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `<blockquote>${quote.text}</blockquote><cite>${quote.author}</cite>`;
    quoteContainer.appendChild(quoteElement);
  });
}

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
setInterval(syncDataFromServer, 300000);




