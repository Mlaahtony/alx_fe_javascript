// Array to hold quote objects
let quotes = [
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "Inspiration" },
    { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.", category: "Life" },
];

// Function to display a random quote from a selected category
function showRandomQuote() {
    const selectedCategory = document.getElementById('category-select').value;
    const quoteDisplay = document.getElementById('quote-display');

    // Filter quotes based on the selected category
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length > 0) {
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><strong>- ${randomQuote.category}</strong></p>`;
    } else {
        quoteDisplay.innerHTML = `<p>No quotes found for this category.</p>`;
    }
}

// Function to create the form to add a new quote
function createAddQuoteForm() {
    const formContainer = document.getElementById('add-quote-container');
    formContainer.innerHTML = '';

    const form = document.createElement('form');
    form.setAttribute('id', 'add-quote-form');

    const categoryLabel = document.createElement('label');
    categoryLabel.setAttribute('for', 'new-category');
    categoryLabel.textContent = 'Category:';
    const categoryInput = document.createElement('input');
    categoryInput.setAttribute('type', 'text');
    categoryInput.setAttribute('id', 'new-category');
    categoryInput.setAttribute('placeholder', 'Enter a new category');

    const quoteLabel = document.createElement('label');
    quoteLabel.setAttribute('for', 'new-quote');
    quoteLabel.textContent = 'Quote:';
    const quoteInput = document.createElement('input');
    quoteInput.setAttribute('type', 'text');
    quoteInput.setAttribute('id', 'new-quote');
    quoteInput.setAttribute('placeholder', 'Enter a new quote');

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Add Quote';
    submitButton.setAttribute('type', 'submit');

    form.appendChild(categoryLabel);
    form.appendChild(categoryInput);
    form.appendChild(quoteLabel);
    form.appendChild(quoteInput);
    form.appendChild(submitButton);
    
    formContainer.appendChild(form);

    // Handle form submission to add a new quote
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const newCategory = document.getElementById('new-category').value.trim();
        const newQuote = document.getElementById('new-quote').value.trim();

        if (newCategory && newQuote) {
            // Add the new quote to the quotes array
            quotes.push({ text: newQuote, category: newCategory });

            // Clear the form fields
            categoryInput.value = '';
            quoteInput.value = '';

            // Update the category dropdown and display list of quotes
            updateCategoryDropdown();
            displayQuoteList();

            // Display success message
            alert('New quote added successfully!');
        } else {
            alert('Please enter both a category and a quote.');
        }
    });
}

// Function to update the category dropdown
function updateCategoryDropdown() {
    const categorySelect = document.getElementById('category-select');
    const categories = Array.from(new Set(quotes.map(quote => quote.category)));

    categorySelect.innerHTML = '<option value="">Select Category</option>'; // Reset dropdown

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Function to display all quotes grouped by category
function displayQuoteList() {
    const quoteListContent = document.getElementById('quote-list-content');
    quoteListContent.innerHTML = ''; // Clear current list

    // Group quotes by category
    const categories = Array.from(new Set(quotes.map(quote => quote.category)));

    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `<strong>${category}</strong>`;

        const quotesList = document.createElement('ul');
        quotes.filter(quote => quote.category === category).forEach(quote => {
            const quoteItem = document.createElement('li');
            quoteItem.textContent = quote.text;
            quotesList.appendChild(quoteItem);
        });

        categoryItem.appendChild(quotesList);
        quoteListContent.appendChild(categoryItem);
    });
}

// Initialize the page
function init() {
    // Populate the category dropdown with existing categories
    updateCategoryDropdown();

    // Add event listener for the "Generate Quote" button
    const generateQuoteButton = document.getElementById('generate-quote-btn');
    generateQuoteButton.addEventListener('click', showRandomQuote);

    // Initialize the "Add Quote" form
    createAddQuoteForm();

    // Display the initial list of quotes
    displayQuoteList();
}

// Run the init function when the page loads
window.onload = init;
