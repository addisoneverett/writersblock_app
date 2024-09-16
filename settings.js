document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Load saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    darkModeToggle.checked = isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);

    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', darkModeToggle.checked);
        localStorage.setItem('darkMode', darkModeToggle.checked);
    });

    const wordCountGoal = document.getElementById('wordCountGoal');
    const resetTime = document.getElementById('resetTime');
    const wordCountValue = document.querySelector('.text-muted-foreground');
    const saveButton = document.querySelector('button.bg-primary');

    // Load saved settings
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('writerSettings')) || {};
        darkModeToggle.checked = settings.darkMode || false;
        wordCountGoal.value = settings.wordCountGoal || 500;
        resetTime.value = settings.resetTime || '00:00';
        wordCountValue.textContent = wordCountGoal.value;

        applySettings();
    }

    // Save settings
    function saveSettings() {
        const settings = {
            darkMode: darkModeToggle.checked,
            wordCountGoal: parseInt(wordCountGoal.value),
            resetTime: resetTime.value
        };
        localStorage.setItem('writerSettings', JSON.stringify(settings));
        showSavedPopup();
    }

    // Show "Saved!" popup
    function showSavedPopup() {
        const saveButton = document.querySelector('button.bg-primary');
        const savedMessage = document.createElement('div');
        savedMessage.textContent = 'Saved!';
        savedMessage.className = 'fixed text-sm font-light text-gray-400 z-50 opacity-0 transition-opacity duration-300';
        
        // Position the popup above the save button
        const saveButtonRect = saveButton.getBoundingClientRect();
        savedMessage.style.left = `${saveButtonRect.left + saveButtonRect.width / 2}px`;
        savedMessage.style.bottom = `${window.innerHeight - saveButtonRect.top + 5}px`;
        savedMessage.style.transform = 'translateX(-50%)';

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
    }

    // Apply settings
    function applySettings() {
        document.body.classList.toggle('dark', darkModeToggle.checked);
        // Apply other settings as needed
    }

    // Event listeners
    darkModeToggle.addEventListener('change', () => {
        applySettings();
        saveSettings();
    });

    wordCountGoal.addEventListener('input', () => {
        wordCountValue.textContent = wordCountGoal.value;
    });

    saveButton.addEventListener('click', saveSettings);

    resetTime.addEventListener('change', saveSettings);

    // Navigation functionality
    const footerButtons = document.querySelectorAll('footer button');
    footerButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            switch(index) {
                case 0: // Create icon (always go to index)
                    window.location.href = 'index.html';
                    break;
                case 1: // Book icon (go to writing log)
                    window.location.href = 'writing-log.html';
                    break;
                case 2: // Analytics icon
                    window.location.href = 'analytics.html';
                    break;
                case 3: // Settings icon (current page)
                    // Do nothing or reload
                    location.reload();
                    break;
            }
        });
    });

    // Load settings on page load
    loadSettings();
});