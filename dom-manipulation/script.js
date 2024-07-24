let quotes = [
  { text: "Quote 1", author: "Author 1", category: "Inspiration" },
  { text: "Quote 2", author: "Author 2", category: "Motivation" },
  { text: "Quote 3", author: "Author 3", category: "Inspiration" }
];

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
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  console.log(`${quote.text} - ${quote.author}`);
}

function addQuote(text, author, category) {
  if (text && category) {
    const newQuote = { text, author, category };
    quotes.push(newQuote);
    saveQuotes();
  } else {
    console.error('Please enter both a quote and a category.');
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
      console.log('Quotes imported successfully!');
    } catch (error) {
      console.error('Error importing quotes:', error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Example usage
loadQuotes();
addQuote("New Quote", "New Author", "Motivation");
showRandomQuote();
exportToJsonFile();





