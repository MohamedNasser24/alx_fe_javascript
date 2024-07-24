// Initialize quotes array
let quotes = [];

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

// Example function to add a new quote (you'll integrate this into your existing code)
function addQuote(newQuote) {
  quotes.push(newQuote);
  saveQuotes(); // Save to local storage after adding
  displayQuotes(); // Update displayed quotes
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

// Initialize by loading quotes from local storage
loadQuotes();



