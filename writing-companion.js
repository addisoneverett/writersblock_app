document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
});

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
                case 4: // Lightbulb icon (current page)
                    // Do nothing or reload
                    break;
            }
        });
    });
}