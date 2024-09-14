document.addEventListener('DOMContentLoaded', () => {
    const writingArea = document.getElementById('writing-area');
    const currentCount = document.querySelector('.current-count');
    const progressBar = document.querySelector('.progress-bar .progress');
    const progressPercentage = document.querySelector('.progress-percentage');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const popupContainer = document.querySelector('.popup-container');
    const addTitleBtn = document.getElementById('add-title-btn');
    const titleContainer = document.getElementById('title-container');
    const titleInput = document.getElementById('title-input');
    const removeTitleBtn = document.getElementById('remove-title');
    const container = document.querySelector('.container');
    const saveButton = document.getElementById('save-button');

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

    // Dropdown functionality
    dropdownBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        popupContainer.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!popupContainer.contains(event.target) && event.target !== dropdownBtn) {
            popupContainer.classList.remove('show');
        }
    });

    // Add Title functionality
    addTitleBtn.addEventListener('click', () => {
        titleContainer.classList.remove('hidden');
        titleInput.focus();
        popupContainer.classList.remove('show');
    });

    // Remove title functionality
    removeTitleBtn.addEventListener('click', () => {
        titleContainer.classList.add('hidden');
        titleInput.value = '';
    });

    // Generate Writing Prompt functionality
    document.querySelector('a[href="#"]:nth-child(2)').addEventListener('click', () => {
        const prompts = [
            "Write about a time you faced a fear.",
            "Describe your perfect day.",
            "If you could have dinner with anyone, living or dead, who would it be and why?",
            "Write a story that begins with 'The door creaked open...'",
            "Describe a place you've never been but would love to visit.",
            "Write your favorite things about Chris"
        ];
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        
        // Remove existing prompt if any
        const existingPrompt = document.querySelector('.prompt-container');
        if (existingPrompt) {
            existingPrompt.remove();
        }

        // Create prompt container
        const promptContainer = document.createElement('div');
        promptContainer.className = 'prompt-container bg-gray-200 text-gray-800 p-4 rounded-md relative mx-4 mb-4';
        promptContainer.style.textAlign = 'center';
        
        // Create prompt text
        const promptText = document.createElement('p');
        promptText.textContent = randomPrompt;
        promptText.className = 'italic';
        promptContainer.appendChild(promptText);
        
        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '&times;';
        removeBtn.className = 'absolute top-1 right-2 text-lg font-light hover:text-primary focus:outline-none';
        removeBtn.addEventListener('click', () => promptContainer.remove());
        promptContainer.appendChild(removeBtn);
        
        // Insert prompt container above the save button
        const mainElement = document.querySelector('main');
        const saveButtonContainer = document.querySelector('.px-4.py-2.border-t');
        mainElement.insertBefore(promptContainer, saveButtonContainer);
        
        popupContainer.classList.remove('show');
    });

    // Scan Document functionality (placeholder)
    document.querySelector('a[href="#"]:nth-child(3)').addEventListener('click', () => {
        alert("Document scanning functionality would be implemented here.");
        popupContainer.classList.remove('show');
    });

    // Placeholder functions for other footer buttons
    document.querySelectorAll('footer button:not(.dropdown-btn)').forEach(button => {
        button.addEventListener('click', () => {
            console.log('Button clicked:', button.querySelector('ion-icon').name);
            // Implement functionality for each button here
        });
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

    // Add event listener for the new save button
    saveButton.addEventListener('click', saveEntry);

    // Update the existing footer button functionality
    const footerButtons = document.querySelectorAll('footer button');
    footerButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            switch(index) {
                case 0: // Book icon (go to writing log)
                    window.location.href = 'writing-log.html';
                    break;
                case 1: // Analytics icon
                    window.location.href = 'analytics.html';
                    break;
                case 2: // Add icon (dropdown)
                    // Your existing dropdown functionality
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

    // Add this near the end of the file
    const settingsButton = document.querySelector('footer button:nth-child(4)');
    settingsButton.addEventListener('click', () => {
        window.location.href = 'settings.html';
    });

    // Add this function at the end of the file
    function setupNavigation() {
        const footerButtons = document.querySelectorAll('footer button');
        footerButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                switch(index) {
                    case 0: // Book icon
                        window.location.href = 'writing-log.html';
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
                    case 4: // Lightbulb icon
                        window.location.href = 'writing-companion.html';
                        break;
                }
            });
        });
    }

    // Call this function at the end of the DOMContentLoaded event listener
    setupNavigation();

    // Add an event listener to check for changes in settings
    window.addEventListener('storage', (event) => {
        if (event.key === 'writerSettings') {
            wordCountGoal = loadWordCountGoal();
            wordCountDisplay.innerHTML = `<span class="text-primary current-count">${currentCount.textContent}</span> / ${wordCountGoal}`;
            updateWordCount(); // Recalculate progress based on new goal
        }
    });
});