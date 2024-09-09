document.addEventListener('DOMContentLoaded', () => {
    console.log('Analytics script loaded');

    const analyticsContent = document.getElementById('analytics-content');
    if (!analyticsContent) {
        console.error('Analytics content element not found');
        return;
    }

    // Add content to the page
    analyticsContent.innerHTML = `
        <div class="flex flex-col items-center w-full max-w-xl mx-auto p-4 space-y-6">
            <div class="flex flex-col items-center space-y-2">
                <div class="text-5xl font-bold">4</div>
                <div class="text-xl font-semibold">Total Words Written</div>
                <div class="text-muted-foreground text-center">That's equivalent to writing a short blog post!</div>
            </div>
            <div class="w-full p-4 bg-white rounded-lg shadow-md">
                <div class="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div class="text-2xl font-bold">22</div>
                        <div class="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold">312</div>
                        <div class="text-xs text-muted-foreground">Avg. Daily Words</div>
                    </div>
                    <div>
                        <div>
                            <div class="text-2xl font-bold">
                                8:30 <span class="text-sm">AM</span>
                            </div>
                        </div>
                        <div class="text-xs text-muted-foreground">Avg. Goal Time</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold">231</div>
                        <div class="text-xs text-muted-foreground">Total Pages</div>
                    </div>
                </div>
            </div>
            <div class="w-full p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
                <div>
                    <div class="text-sm font-semibold text-muted-foreground">You've been promoted to</div>
                    <div class="text-lg font-bold">Novice Writer</div>
                </div>
                <svg class="w-12 h-12 text-yellow-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
            </div>
            <div class="w-full p-4 bg-white rounded-lg shadow-md">
                <div class="text-center text-sm font-semibold text-gray-500 mb-4">June</div>
                <div class="grid grid-cols-7 gap-2" id="calendar"></div>
            </div>
        </div>
    `;

    // Generate calendar
    const calendar = document.getElementById('calendar');
    const days = 31;

    for (let i = 1; i <= days; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = `flex items-center justify-center h-8 w-8 text-white rounded-full ${i === 6 ? 'bg-red-500' : i <= 28 ? 'bg-green-500' : 'bg-gray-300'}`;
        dayElement.textContent = i;
        calendar.appendChild(dayElement);
    }

    // Navigation functionality
    const footerButtons = document.querySelectorAll('footer button');
    footerButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            switch(index) {
                case 0: // Book icon (go to writing log)
                    window.location.href = 'writing-log.html';
                    break;
                case 1: // Analytics icon (stay on analytics)
                    // Do nothing or reload the page
                    break;
                case 2: // Pencil icon (return to index)
                    window.location.href = 'index.html';
                    break;
                case 3: // Settings icon
                    window.location.href = 'settings.html';
                    break;
                case 4: // Lightbulb icon
                    // Functionality for lightbulb icon, if any
                    break;
            }
        });
    });

    console.log('Analytics script finished');
});