document.addEventListener('DOMContentLoaded', () => {
    const logEntries = document.getElementById('log-entries');
    const searchInput = document.querySelector('input[type="search"]');
    const sortSelect = document.querySelector('select');
    const settingsButton = document.querySelector('footer button:nth-child(4)');

    let entries = [];

    function loadEntries() {
        entries = JSON.parse(localStorage.getItem('writingEntries')) || [];
        if (entries.length === 0) {
            logEntries.innerHTML = '<p class="text-center text-muted-foreground">No entries in the writing log yet.</p>';
            return;
        }

        renderEntries(entries);
    }

    function renderEntries(entriesToRender) {
        logEntries.innerHTML = '<div class="space-y-4"></div>';
        const entriesContainer = logEntries.querySelector('div');

        entriesToRender.forEach((entry, index) => {
            const entryElement = document.createElement('div');
            entryElement.className = 'bg-card text-card-foreground rounded-md shadow';
            entryElement.innerHTML = `
                <div class="p-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-sm font-medium">Entry ${index + 1}</h3>
                        <span class="text-xs text-muted-foreground">${new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <p class="mt-2 text-sm text-muted-foreground">${entry.text.substring(0, 100)}${entry.text.length > 100 ? '...' : ''}</p>
                </div>
            `;
            entriesContainer.appendChild(entryElement);
        });
    }

    function filterAndSortEntries() {
        const searchTerm = searchInput.value.toLowerCase();
        const sortBy = sortSelect.value;

        let filteredEntries = entries.filter(entry => 
            entry.text.toLowerCase().includes(searchTerm)
        );

        filteredEntries.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.date) - new Date(a.date);
            } else {
                return a.text.localeCompare(b.text);
            }
        });

        renderEntries(filteredEntries);
    }

    // Open settings page
    settingsButton.addEventListener('click', () => {
        window.location.href = 'settings.html';
    });

    searchInput.addEventListener('input', filterAndSortEntries);
    sortSelect.addEventListener('change', filterAndSortEntries);

    // Navigation functionality
    const footerButtons = document.querySelectorAll('footer button');
    footerButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            switch(index) {
                case 0: // Book icon (writing log)
                    // Do nothing, already on writing log page
                    break;
                case 1: // Analytics icon
                    window.location.href = 'analytics.html';
                    break;
                case 2: // Pencil icon (return to index)
                    window.location.href = 'index.html';
                    break;
                case 3: // Settings icon
                    window.location.href = 'settings.html';
                    break;
                case 4: // Map icon
                    // Functionality for map icon, if any
                    break;
            }
        });
    });

    loadEntries();
});