document.addEventListener('DOMContentLoaded', () => {
    const writingArea = document.getElementById('writing-area');
    const currentCount = document.querySelector('.current-count');
    const progressBar = document.querySelector('.progress-bar .progress');
    const progressPercentage = document.querySelector('.progress-percentage');
    const titleContainer = document.getElementById('title-container');
    const titleInput = document.getElementById('title-input');
    const removeTitleBtn = document.getElementById('remove-title');
    const container = document.querySelector('.container');
    const saveButton = document.getElementById('save-button');
    const ellipsisButton = document.getElementById('ellipsis-button');

    // Load the saved word count goal
    function loadWordCountGoal() {
        const settings = JSON.parse(localStorage.getItem('writerSettings')) || {};
        return settings.wordCountGoal || 500; // Default to 500 if not set
    }

    let wordCountGoal = loadWordCountGoal();

    // Update the word count display in the header
    const wordCountDisplay = document.querySelector('.text-sm.font-medium');
    wordCountDisplay.innerHTML = `<span class="text-primary current-count">0</span> / ${wordCountGoal}`;

    function updateWordCount() {
        const text = writingArea.value.trim();
        const words = text ? text.split(/\s+/) : [];
        const count = words.length === 1 && words[0] === '' ? 0 : words.length;
        currentCount.textContent = count;

        // Update progress bar and percentage
        const percentage = Math.min((count / wordCountGoal) * 100, 100);
        progressBar.style.width = `${percentage}%`;
        progressPercentage.textContent = `${Math.round(percentage)}%`;
    }

    writingArea.addEventListener('input', updateWordCount);

    // Remove title functionality
    removeTitleBtn.addEventListener('click', () => {
        titleContainer.classList.add('hidden');
        titleInput.value = '';
    });

    function saveEntry() {
        const text = writingArea.value.trim();
        const title = titleInput.value.trim();
        if (text) {
            const entry = {
                title: title,
                text: text,
                date: new Date().toISOString(),
                wordCount: text.split(/\s+/).length
            };
            
            let entries = JSON.parse(localStorage.getItem('writingEntries')) || [];
            entries.push(entry);
            localStorage.setItem('writingEntries', JSON.stringify(entries));
            
            // Clear the writing area and title
            writingArea.value = '';
            titleInput.value = '';
            titleContainer.classList.add('hidden');
            
            // Show "Saved!" message
            const savedMessage = document.createElement('div');
            savedMessage.textContent = 'Saved!';
            savedMessage.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-light text-gray-400 z-50 opacity-0 transition-opacity duration-300';
            document.body.appendChild(savedMessage);
            
            // Fade in
            requestAnimationFrame(() => {
                savedMessage.style.opacity = '1';
            });
            
            // Fade out and remove
            setTimeout(() => {
                savedMessage.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(savedMessage);
                }, 300);
            }, 1500);

            // Reset word count and progress bar
            updateWordCount();
        }
    }

    // Add event listener for the save button
    saveButton.addEventListener('click', saveEntry);

    // Add event listener for the ellipsis button
    ellipsisButton.addEventListener('click', () => {
        // Add your desired functionality here
        console.log('Ellipsis button clicked');
        // For example, you could show a dropdown menu or open a modal
    });

    // Navigation functionality
    const footerButtons = document.querySelectorAll('footer button');
    footerButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            switch(index) {
                case 0: // Create icon (current page)
                    // Do nothing or reload
                    break;
                case 1: // Book icon (go to writing log)
                    window.location.href = 'writing-log.html';
                    break;
                case 2: // Analytics icon
                    window.location.href = 'analytics.html';
                    break;
                case 3: // Settings icon
                    window.location.href = 'settings.html';
                    break;
            }
        });
    });

    // Keep the event listener for settings changes
    window.addEventListener('storage', (event) => {
        if (event.key === 'writerSettings') {
            wordCountGoal = loadWordCountGoal();
            wordCountDisplay.innerHTML = `<span class="text-primary current-count">${currentCount.textContent}</span> / ${wordCountGoal}`;
            updateWordCount(); // Recalculate progress based on new goal
        }
    });
});