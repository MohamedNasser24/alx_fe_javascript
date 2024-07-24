// Array to hold quotes
let quotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Motivational" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", category: "Life" },
  { text: "The only way to do great work is to love what you do.", category: "Motivational" },
  { text: "You only live once, but if you do it right, once is enough.", category: "Life" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteTextElement = document.getElementById('quoteText');
  const quoteCategoryElement = document.getElementById('quoteCategory');

  quoteTextElement.textContent = randomQuote.text;
  quoteCategoryElement.textContent = `Category: ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      text: newQuoteText,
      category: newQuoteCategory
    };

    quotes.push(newQuote);
    // Optionally, clear the input fields after adding the quote
    document.getElementById('newQuoteText').value = '';
    document.getElementById
