
// Sample quotes array with categories
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "Inspiration" },
    { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.", category: "Life" },
];

// Save quotes to localStorage
function saveQuotesToLocalStorage() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Save categories to localStorage
function saveCategoriesToLocalStorage() {
    const categories = Array.from(new Set(quotes.map(quote => quote.category))); // Extract unique categories
    localStorage.setItem("categories", JSON.stringify(categories));
}

// Populate categories dynamically based on existing quotes
function populateCategories() {
    const categoryFilter = document.getElementById('category-filter');
    const categories = JSON.parse(localStorage.getItem('categories')) || Array.from(new Set(quotes.map(quote => quote.category))); // Get categories from localStorage if available

    // Clear existing options in the dropdown
    categoryFilter.innerHTML = '<option value="">Select Category</option>';

    // Populate the dropdown with categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Check localStorage for last selected category and set it if available
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
        filterQuotes(lastSelectedCategory); // Apply the filter on page load
    }
}

// Filter quotes based on the selected category
function filterQuotes(category) {
    const filteredQuotesDisplay = document.getElementById('filtered-quotes-display');
    const categoryFilter = document.getElementById('category-filter');

    // Save the selected category to localStorage for persistence
    localStorage.setItem('lastSelectedCategory', category);

    if (category === "") {
        filteredQuotesDisplay.innerHTML = "<p>Select a category to see quotes.</p>";
    } else {
        const filteredQuotes = quotes.filter(quote => quote.category === category);

        if (filteredQuotes.length > 0) {
            filteredQuotesDisplay.innerHTML = `<h3>Quotes from the "${category}" category:</h3>`;
            const ul = document.createElement('ul');
            filteredQuotes.forEach(quote => {
                const li = document.createElement('li');
                li.textContent = quote.text;
                ul.appendChild(li);
            });
            filteredQuotesDisplay.appendChild(ul);
        } else {
            filteredQuotesDisplay.innerHTML = `<p>No quotes found for this category.</p>`;
        }
    }
}

// Create the form to add a new quote
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

            // Save the updated quotes to localStorage
            saveQuotesToLocalStorage();

            // Update categories in localStorage
            saveCategoriesToLocalStorage();

            // Clear the form fields
            categoryInput.value = '';
            quoteInput.value = '';

            // Update the category dropdown and display list of quotes
            populateCategories();
            alert('New quote added successfully!');
        } else {
            alert('Please enter both a category and a quote.');
        }
    });
}

// Event listener for when the category filter is changed
document.getElementById('category-filter').addEventListener('change', function(event) {
    const selectedCategory = event.target.value;
    filterQuotes(selectedCategory); // Filter quotes based on selected category
});

// Export Quotes to JSON file
document.getElementById('export-quotes').addEventListener('click', function() {
    const quotesJSON = JSON.stringify(quotes, null, 2);
    const blob = new Blob([quotesJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Import Quotes from JSON file
document.getElementById('import-quotes').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes = importedQuotes;
                saveQuotesToLocalStorage();
                saveCategoriesToLocalStorage();
                populateCategories();
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid JSON format');
            }
        } catch (err) {
            alert('Error reading the file');
        }
    };

    reader.readAsText(file);
});

// Initialize the app on page load
function initializeApp() {
    populateCategories(); // Populate category filter dropdown
    createAddQuoteForm(); // Call the function for creating the quote adding form
}

// Initialize the app when the page loads
window.onload = initializeApp;
