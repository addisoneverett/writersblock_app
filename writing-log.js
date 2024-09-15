document.addEventListener('DOMContentLoaded', () => {
    const logEntries = document.getElementById('log-entries');
    const searchInput = document.querySelector('input[type="search"]');
    const sortSelect = document.querySelector('select');
    const addEntryButton = document.getElementById('add-entry-button');

    let entries = [];

    function loadEntries() {
        entries = JSON.parse(localStorage.getItem('writingEntries')) || [];
        if (entries.length === 0) {
            logEntries.innerHTML = '<p class="text-center text-muted-foreground">No entries in the writing log yet.</p>';
            return;
        }

        // Sort entries by date (most recent first) before rendering
        entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        renderEntries(entries);
    }

    function renderEntries(entriesToRender) {
        logEntries.innerHTML = entriesToRender.map(entry => `
            <div class="entry mb-2 p-3 bg-card rounded-lg shadow">
                <div class="flex justify-between items-start">
                    <div class="flex-grow mr-2">
                        <h3 class="text-md font-semibold truncate">${entry.title || ''}</h3>
                        <p class="text-xs text-muted-foreground">${new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                    <div class="flex items-center">
                        <button class="edit-button mr-2 text-primary hover:text-primary-dark" data-id="${entry.date}">
                            <ion-icon name="create-outline" class="text-lg"></ion-icon>
                        </button>
                        <button class="delete-button text-red-500 hover:text-red-700" data-id="${entry.date}">
                            <ion-icon name="trash-outline" class="text-lg"></ion-icon>
                        </button>
                    </div>
                </div>
                <p class="text-sm text-muted-foreground mt-1 line-clamp-2">${entry.text.substring(0, 100)}${entry.text.length > 100 ? '...' : ''}</p>
            </div>
        `).join('');

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', () => editEntry(button.dataset.id));
        });
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', () => showDeleteConfirmation(button.dataset.id));
        });
    }

    function showDeleteConfirmation(id) {
        const confirmationCard = document.createElement('div');
        confirmationCard.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
        confirmationCard.innerHTML = `
            <div class="bg-card p-4 rounded-lg shadow-lg max-w-xs w-full mx-4">
                <h3 class="text-md font-semibold mb-2">Delete Entry</h3>
                <p class="text-sm mb-4">Are you sure you want to delete this saved entry? This action cannot be undone.</p>
                <div class="flex justify-end space-x-4">
                    <button class="cancel-delete text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
                    <button class="confirm-delete text-sm text-red-500 hover:text-red-700 transition-colors">Delete</button>
                </div>
            </div>
        `;

        document.body.appendChild(confirmationCard);

        confirmationCard.querySelector('.cancel-delete').addEventListener('click', () => {
            document.body.removeChild(confirmationCard);
        });

        confirmationCard.querySelector('.confirm-delete').addEventListener('click', () => {
            deleteEntry(id);  // This calls the deleteEntry function when user confirms
            document.body.removeChild(confirmationCard);
        });
    }

    function filterAndSortEntries() {
        const searchTerm = searchInput.value.toLowerCase();
        const sortBy = sortSelect.value;

        let filteredEntries = entries.filter(entry => 
            (entry.title && entry.title.toLowerCase().includes(searchTerm)) ||
            entry.text.toLowerCase().includes(searchTerm)
        );

        filteredEntries.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.date) - new Date(a.date); // Most recent first
            } else {
                return a.title.localeCompare(b.title);
            }
        });

        renderEntries(filteredEntries);
    }

    function editEntry(id) {
        // Implement edit functionality
        console.log('Edit entry:', id);
        // You might want to redirect to the main writing page with this entry loaded
        window.location.href = `index.html?edit=${id}`;
    }

    function deleteEntry(id) {
        // Filter out the entry with the matching id
        entries = entries.filter(entry => entry.date !== id);
        
        // Save the updated entries array back to localStorage
        localStorage.setItem('writingEntries', JSON.stringify(entries));
        
        // Reload the entries to update the display
        loadEntries();
    }

    // Event listeners
    searchInput.addEventListener('input', filterAndSortEntries);
    sortSelect.addEventListener('change', filterAndSortEntries);
    addEntryButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Navigation functionality
    const footerButtons = document.querySelectorAll('footer button');
    footerButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            switch(index) {
                case 0: // Book icon (current page)
                    // Do nothing or reload
                    break;
                case 1: // Analytics icon
                    window.location.href = 'analytics.html';
                    break;
                case 2: // Pencil icon
                    window.location.href = 'index.html';
                    break;
                case 3: // Settings icon
                    window.location.href = 'settings.html';
                    break;
            }
        });
    });

    loadEntries();
});

// Add this function at the end of the file
function setupNavigation() {
    const footerButtons = document.querySelectorAll('footer button');
    footerButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            switch(index) {
                case 0: // Book icon (current page)
                    // Do nothing or reload
                    break;
                case 1: // Analytics icon
                    window.location.href = 'analytics.html';
                    break;
                case 2: // Pencil icon
                    window.location.href = 'index.html';
                    break;
                case 3: // Settings icon
                    window.location.href = 'settings.html';
                    break;
            }
        });
    });
}

// Call this function at the end of the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    setupNavigation();
});