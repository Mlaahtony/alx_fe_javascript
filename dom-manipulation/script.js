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

// Display a random quote based on selected category
function showRandomQuote() {
    const selectedCategory = document.getElementById('category-select').value;
    const quoteDisplay = document.getElementById('quote-display');

    // Filter quotes based on the selected category
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length > 0) {
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><strong>- ${randomQuote.category}</strong></p>`;

        // Store the last viewed quote in sessionStorage
        sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
    } else {
        quoteDisplay.innerHTML = `<p>No quotes found for this category.</p>`;
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

// Update the category dropdown
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

// Display all quotes grouped by category
function displayQuoteList() {
    const quoteListContent = document.getElementById('quote-list-content');
    quoteListContent.innerHTML = ''; // Clear current list

    // Group quotes by category
    const categories = Array.from(new Set(quotes.map(quote => quote.category)));

    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `<strong>${category}</strong>`;

        const quotesList = document.createElement('ul');
        const categoryQuotes = quotes.filter(quote => quote.category === category);

        categoryQuotes.forEach(quote => {
            const listItem = document.createElement('li');
            listItem.textContent = quote.text;
            quotesList.appendChild(listItem);
        });

        categoryItem.appendChild(quotesList);
        quoteListContent.appendChild(categoryItem);
    });
}

// Load the last viewed quote from sessionStorage (if available)
function loadLastViewedQuote() {
    const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
    if (lastViewedQuote) {
        const quoteDisplay = document.getElementById('quote-display');
        quoteDisplay.innerHTML = `<p>"${lastViewedQuote.text}"</p><p><strong>- ${lastViewedQuote.category}</strong></p>`;
    }
}

// Export quotes to a JSON file
function exportQuotesToJSON() {
    const dataStr = JSON.stringify(quotes, null, 2);  // Format with indentation
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Clean up the link
}

// Import quotes from a JSON file
function importQuotesFromJSON(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes = importedQuotes;
                saveQuotesToLocalStorage();  // Save to localStorage after import
                updateCategoryDropdown();   // Update categories
                displayQuoteList();         // Display quotes list
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid JSON format.");
            }
        } catch (error) {
            alert("Failed to parse JSON file.");
        }
    };

    reader.readAsText(file);
}

// Initialize the app: Update category dropdown, display quote list, and load last viewed quote
function initializeApp() {
    updateCategoryDropdown();
    displayQuoteList();
    loadLastViewedQuote();
}

// Initialize the app on page load
window.onload = initializeApp;

// Add event listener to the "Generate Quote" button
document.getElementById('generate-quote-btn').addEventListener('click', showRandomQuote);

// Add event listener to the "Add New Quote" section
createAddQuoteForm();

// Add event listener for the "Export Quotes" button
document.getElementById('export-quotes-btn').addEventListener('click', exportQuotesToJSON);

// Add event listener for the "Import Quotes" file input
document.getElementById('import-quotes-file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        importQuotesFromJSON(file);
    }
});

