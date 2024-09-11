document.addEventListener('DOMContentLoaded', () => {
    const analyticsContent = document.getElementById('analytics-content');
    
    function calculateAnalytics() {
        const entries = JSON.parse(localStorage.getItem('writingEntries')) || [];
        const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
        const streak = calculateStreak(entries);
        const avgWordsPerDay = calculateAverageWordsPerDay(entries);
        const totalPages = Math.ceil(totalWords / 250); // Assuming 250 words per page
        const avgGoalTime = calculateAverageGoalTime(entries);
        const rank = calculateRank(totalWords);

        return { totalWords, streak, avgWordsPerDay, totalPages, avgGoalTime, rank };
    }

    function calculateStreak(entries) {
        if (entries.length === 0) return 0;
        
        // Sort entries by date, most recent first
        entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let streak = 1;
        let currentDate = new Date(entries[0].date);
        currentDate.setHours(0, 0, 0, 0); // Normalize to start of day
        
        for (let i = 1; i < entries.length; i++) {
            const entryDate = new Date(entries[i].date);
            entryDate.setHours(0, 0, 0, 0); // Normalize to start of day
            
            const daysDifference = (currentDate - entryDate) / (1000 * 60 * 60 * 24);
            
            if (daysDifference === 1) {
                streak++;
                currentDate = entryDate;
            } else if (daysDifference > 1) {
                // Streak is broken
                break;
            }
        }
        
        return streak;
    }

    function calculateAverageWordsPerDay(entries) {
        if (entries.length === 0) return 0;
        
        const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestDate = new Date(sortedEntries[0].date);
        const earliestDate = new Date(sortedEntries[sortedEntries.length - 1].date);
        
        const daysDifference = Math.ceil((latestDate - earliestDate) / (1000 * 60 * 60 * 24)) + 1;
        const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
        
        return Math.round(totalWords / daysDifference);
    }

    function calculateAverageGoalTime(entries) {
        const wordCountGoal = parseInt(localStorage.getItem('wordCountGoal')) || 500; // Default to 500 if not set
        let totalMinutes = 0;
        let daysReachedGoal = 0;

        // Group entries by date
        const entriesByDate = entries.reduce((acc, entry) => {
            const date = new Date(entry.date).toDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(entry);
            return acc;
        }, {});

        for (const dateEntries of Object.values(entriesByDate)) {
            let dailyWordCount = 0;
            let goalReachedTime = null;

            dateEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

            for (const entry of dateEntries) {
                dailyWordCount += entry.wordCount;
                if (dailyWordCount >= wordCountGoal && !goalReachedTime) {
                    goalReachedTime = new Date(entry.date);
                    break;
                }
            }

            if (goalReachedTime) {
                totalMinutes += goalReachedTime.getHours() * 60 + goalReachedTime.getMinutes();
                daysReachedGoal++;
            }
        }

        if (daysReachedGoal === 0) return "N/A";

        const averageMinutes = Math.round(totalMinutes / daysReachedGoal);
        const hours = Math.floor(averageMinutes / 60);
        const minutes = averageMinutes % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    function calculateRank(totalWords) {
        const ranks = [
            { name: "Word Dabbler", threshold: 1 },
            { name: "Novice Scribe", threshold: 500 },
            { name: "Adept Penman", threshold: 1000 },
            { name: "Word Wanderer", threshold: 1500 },
            { name: "Quill Rookie", threshold: 2000 },
            { name: "Page Apprentice", threshold: 2500 },
            { name: "Wordsmith in Training", threshold: 3000 },
            { name: "Prose Pupil", threshold: 3500 },
            { name: "Paragraph Novice", threshold: 4000 },
            { name: "Script Explorer", threshold: 4500 },
            { name: "Sentence Seeker", threshold: 5000 },
            { name: "Journeyman of Ink", threshold: 6000 },
            { name: "Verse Weaver", threshold: 7500 },
            { name: "Tale Teller", threshold: 9000 },
            { name: "Chapter Crafter", threshold: 10000 },
            { name: "Narrative Navigator", threshold: 12500 },
            { name: "Manuscript Maven", threshold: 15000 },
            { name: "Syntax Scholar", threshold: 17500 },
            { name: "Grammar Guardian", threshold: 20000 },
            { name: "Plot Architect", threshold: 22500 },
            { name: "Poetry Pioneer", threshold: 25000 },
            { name: "Story Shaper", threshold: 30000 },
            { name: "Text Curator", threshold: 35000 },
            { name: "Prose Philosopher", threshold: 40000 },
            { name: "Plot Magician", threshold: 45000 },
            { name: "Narrative Alchemist", threshold: 50000 },
            { name: "Epic Scribe", threshold: 55000 },
            { name: "Literary Luminary", threshold: 60000 },
            { name: "Verse Virtuoso", threshold: 65000 },
            { name: "Story Strategist", threshold: 70000 },
            { name: "Paragraph Prophet", threshold: 75000 },
            { name: "Master of Manuscripts", threshold: 80000 },
            { name: "Plot Sage", threshold: 85000 },
            { name: "Syntax Sorcerer", threshold: 90000 },
            { name: "Legend Crafter", threshold: 95000 },
            { name: "Virtuoso of Verse", threshold: 100000 },
            { name: "Word Weaver", threshold: 125000 },
            { name: "Tome Tactician", threshold: 150000 },
            { name: "Epic Composer", threshold: 175000 },
            { name: "Text Titan", threshold: 200000 },
            { name: "Guardian of Grammar", threshold: 225000 },
            { name: "Sentinel of Stories", threshold: 250000 },
            { name: "Master of Rhetoric", threshold: 275000 },
            { name: "Narrative Nomad", threshold: 300000 },
            { name: "Archon of Articulation", threshold: 350000 },
            { name: "Oracle of Oratory", threshold: 400000 },
            { name: "Syntax Sovereign", threshold: 450000 },
            { name: "Scribe Supreme", threshold: 500000 },
            { name: "Epic Emissary", threshold: 600000 },
            { name: "Legendary Lexicographer", threshold: 800000 },
            { name: "Emissary of Eloquence", threshold: 1000000 }
        ];

        for (let i = ranks.length - 1; i >= 0; i--) {
            if (totalWords >= ranks[i].threshold) {
                return ranks[i].name;
            }
        }
        return ranks[0].name; // Default to the lowest rank
    }

    function getComparisonText(totalWords) {
        console.log("Getting comparison for", totalWords, "words");
        
        if (totalWords < 200) {
            return "You're just getting started! Keep writing and watch your word count grow!";
        }
        
        const comparisons = [
            { title: "Green Eggs and Ham", author: "Dr. Seuss", words: 750 },
            { title: "The Gettysburg Address", author: "Abraham Lincoln", words: 270 },
            { title: "The Tell-Tale Heart", author: "Edgar Allan Poe", words: 2200 },
            { title: "The Yellow Wallpaper", author: "Charlotte Perkins Gilman", words: 6000 },
            { title: "A Scandal in Bohemia", author: "Arthur Conan Doyle", words: 7500 },
            { title: "The Lottery", author: "Shirley Jackson", words: 3400 },
            { title: "A Good Man Is Hard to Find", author: "Flannery O'Connor", words: 6200 },
            { title: "Animal Farm", author: "George Orwell", words: 30000 },
            { title: "Of Mice and Men", author: "John Steinbeck", words: 29000 },
            { title: "Breakfast at Tiffany's", author: "Truman Capote", words: 26000 },
            { title: "The Old Man and the Sea", author: "Ernest Hemingway", words: 27000 },
            { title: "The Metamorphosis", author: "Franz Kafka", words: 21000 },
            { title: "The Great Gatsby", author: "F. Scott Fitzgerald", words: 47000 },
            { title: "The Outsiders", author: "S.E. Hinton", words: 48500 },
            { title: "The Strange Case of Dr. Jekyll and Mr. Hyde", author: "Robert Louis Stevenson", words: 15000 },
            { title: "The Legend of Sleepy Hollow", author: "Washington Irving", words: 11000 },
            { title: "Fahrenheit 451", author: "Ray Bradbury", words: 46000 },
            { title: "Slaughterhouse-Five", author: "Kurt Vonnegut", words: 49500 },
            { title: "The Catcher in the Rye", author: "J.D. Salinger", words: 73000 },
            { title: "Lord of the Flies", author: "William Golding", words: 59900 },
            { title: "The Picture of Dorian Gray", author: "Oscar Wilde", words: 78000 },
            { title: "The Road", author: "Cormac McCarthy", words: 87000 },
            { title: "To Kill a Mockingbird", author: "Harper Lee", words: 100000 },
            { title: "1984", author: "George Orwell", words: 88900 },
            { title: "Brave New World", author: "Aldous Huxley", words: 64000 },
            { title: "The Stranger", author: "Albert Camus", words: 36000 },
            { title: "The Alchemist", author: "Paulo Coelho", words: 39000 },
            { title: "Siddhartha", author: "Hermann Hesse", words: 41500 },
            { title: "Fight Club", author: "Chuck Palahniuk", words: 49000 },
            { title: "The Perks of Being a Wallflower", author: "Stephen Chbosky", words: 62000 },
            { title: "The Hobbit", author: "J.R.R. Tolkien", words: 95000 },
            { title: "Coraline", author: "Neil Gaiman", words: 30000 },
            { title: "The Giver", author: "Lois Lowry", words: 43000 },
            { title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", words: 77000 },
            { title: "Ender's Game", author: "Orson Scott Card", words: 100000 },
            { title: "The Hunger Games", author: "Suzanne Collins", words: 99750 },
            { title: "Twilight", author: "Stephenie Meyer", words: 118000 },
            { title: "Divergent", author: "Veronica Roth", words: 105000 },
            { title: "Ready Player One", author: "Ernest Cline", words: 136000 },
            { title: "The Maze Runner", author: "James Dashner", words: 101000 },
            { title: "The Da Vinci Code", author: "Dan Brown", words: 138000 },
            { title: "Gone Girl", author: "Gillian Flynn", words: 145000 },
            { title: "The Fault in Our Stars", author: "John Green", words: 67000 },
            { title: "American Psycho", author: "Bret Easton Ellis", words: 145000 },
            { title: "The Girl on the Train", author: "Paula Hawkins", words: 107000 },
            { title: "The Shining", author: "Stephen King", words: 160000 },
            { title: "Jurassic Park", author: "Michael Crichton", words: 120000 },
            { title: "A Game of Thrones", author: "George R.R. Martin", words: 298000 },
            { title: "The Fellowship of the Ring", author: "J.R.R. Tolkien", words: 187000 },
            { title: "The Two Towers", author: "J.R.R. Tolkien", words: 156000 },
            { title: "The Return of the King", author: "J.R.R. Tolkien", words: 137000 },
            { title: "The Martian", author: "Andy Weir", words: 100000 },
            { title: "IT", author: "Stephen King", words: 445000 },
            { title: "A Clash of Kings", author: "George R.R. Martin", words: 326000 },
            { title: "A Storm of Swords", author: "George R.R. Martin", words: 414000 },
            { title: "The Winds of Winter", author: "George R.R. Martin", words: 600000 },
            { title: "Don Quixote", author: "Miguel de Cervantes", words: 430000 },
            { title: "Moby-Dick", author: "Herman Melville", words: 206000 },
            { title: "War and Peace", author: "Leo Tolstoy", words: 587000 },
            { title: "Les Misérables", author: "Victor Hugo", words: 655000 },
            { title: "The Count of Monte Cristo", author: "Alexandre Dumas", words: 464000 },
            { title: "Ulysses", author: "James Joyce", words: 265000 },
            { title: "Gone with the Wind", author: "Margaret Mitchell", words: 418000 },
            { title: "Infinite Jest", author: "David Foster Wallace", words: 543000 },
            { title: "The Stand", author: "Stephen King", words: 472000 },
            { title: "Atlas Shrugged", author: "Ayn Rand", words: 645000 },
            { title: "Middlemarch", author: "George Eliot", words: 316000 },
            { title: "Gravity's Rainbow", author: "Thomas Pynchon", words: 280000 },
            { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", words: 365000 },
            { title: "David Copperfield", author: "Charles Dickens", words: 360000 },
            { title: "Bleak House", author: "Charles Dickens", words: 360000 },
            { title: "A Tale of Two Cities", author: "Charles Dickens", words: 135000 },
            { title: "Anna Karenina", author: "Leo Tolstoy", words: 350000 },
            { title: "Crime and Punishment", author: "Fyodor Dostoevsky", words: 211000 },
            { title: "The Grapes of Wrath", author: "John Steinbeck", words: 169000 },
            { title: "The Hunchback of Notre-Dame", author: "Victor Hugo", words: 195000 },
            { title: "The Odyssey", author: "Homer", words: 121000 },
            { title: "Pride and Prejudice", author: "Jane Austen", words: 122000 },
            { title: "Frankenstein", author: "Mary Shelley", words: 74000 },
            { title: "Jane Eyre", author: "Charlotte Brontë", words: 183000 },
            { title: "Wuthering Heights", author: "Emily Brontë", words: 107000 },
            { title: "Emma", author: "Jane Austen", words: 160000 },
            { title: "Sense and Sensibility", author: "Jane Austen", words: 119000 },
            { title: "Dracula", author: "Bram Stoker", words: 160000 },
            { title: "The Time Machine", author: "H.G. Wells", words: 32000 },
            { title: "The War of the Worlds", author: "H.G. Wells", words: 60000 },
            { title: "Heart of Darkness", author: "Joseph Conrad", words: 38000 },
            { title: "Dune", author: "Frank Herbert", words: 188000 },
            { title: "The Call of the Wild", author: "Jack London", words: 47000 },
            { title: "The Bell Jar", author: "Sylvia Plath", words: 70000 },
            { title: "The Scarlet Letter", author: "Nathaniel Hawthorne", words: 63000 },
            { title: "The Handmaid's Tale", author: "Margaret Atwood", words: 90000 },
            { title: "Rebecca", author: "Daphne du Maurier", words: 118000 },
            { title: "Dr. Jekyll and Mr. Hyde", author: "Robert Louis Stevenson", words: 60000 },
            { title: "A Clockwork Orange", author: "Anthony Burgess", words: 60000 },
            { title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", words: 46000 },
            { title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", words: 144000 },
            { title: "The Sound and the Fury", author: "William Faulkner", words: 110000 },
            { title: "Beloved", author: "Toni Morrison", words: 111000 },
            { title: "The Godfather", author: "Mario Puzo", words: 139000 },
            { title: "The Book Thief", author: "Markus Zusak", words: 118000 }
        ];

        const closestComparisons = comparisons
            .map(comp => ({ ...comp, diff: Math.abs(comp.words - totalWords) }))
            .sort((a, b) => a.diff - b.diff)
            .slice(0, 3);

        let comparisonText = "";

        if (totalWords < closestComparisons[0].words) {
            comparisonText = `That's almost as many words as "${closestComparisons[0].title}" by ${closestComparisons[0].author} (${closestComparisons[0].words} words)!`;
        } else if (totalWords === closestComparisons[0].words) {
            comparisonText = `That's exactly the same number of words as "${closestComparisons[0].title}" by ${closestComparisons[0].author}!`;
        } else {
            const exceedingComparisons = closestComparisons.filter(comp => totalWords > comp.words);
            if (exceedingComparisons.length > 0) {
                const randomComp = exceedingComparisons[Math.floor(Math.random() * exceedingComparisons.length)];
                comparisonText = `That's more words than "${randomComp.title}" by ${randomComp.author} (${randomComp.words} words)!`;
            } else {
                comparisonText = `That's equivalent to "${closestComparisons[0].title}" by ${closestComparisons[0].author} (${closestComparisons[0].words} words) and then some!`;
            }
        }

        console.log("Comparison text:", comparisonText);
        return comparisonText;
    }

    function updateAnalyticsDisplay(analytics) {
        console.log("Updating analytics display", analytics);
        const comparisonText = getComparisonText(analytics.totalWords);
        
        const rankLevel = getRankLevel(analytics.rank);
        let rankIcon, rankColor;
        if (rankLevel <= 10) {
            rankIcon = "medal-outline";
            rankColor = "text-yellow-600"; // Bronze
        } else if (rankLevel <= 25) {
            rankIcon = "medal-outline";
            rankColor = "text-gray-400"; // Silver
        } else if (rankLevel <= 40) {
            rankIcon = "medal-outline";
            rankColor = "text-yellow-400"; // Gold
        } else {
            rankIcon = "flame-outline";
            rankColor = "text-red-500"; // Red
        }
        
        const nextRankInfo = getNextRankInfo(analytics.totalWords);
        const wordsToNextRank = nextRankInfo.threshold - analytics.totalWords;
        const progressPercentage = ((analytics.totalWords - nextRankInfo.currentThreshold) / (nextRankInfo.threshold - nextRankInfo.currentThreshold)) * 100;
        
        let progressText;
        if (nextRankInfo.name === "Emissary of Eloquence" && analytics.totalWords >= 1000000) {
            progressText = "Congratulations! You've reached the highest rank!";
        } else {
            progressText = `Only ${wordsToNextRank} words to go! Keep writing to become a "${nextRankInfo.name}"!`;
        }

        analyticsContent.innerHTML = 
            '<div class="flex flex-col items-center w-full max-w-xl mx-auto space-y-8">' +
                '<div class="w-full">' +
                    '<div class="flex flex-col items-center space-y-2">' +
                        '<div class="text-5xl font-bold">' + analytics.totalWords + '</div>' +
                        '<div class="text-xl font-semibold">Total Words Written</div>' +
                        '<div class="text-muted-foreground text-center">' + comparisonText + '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="w-full p-4 bg-white rounded-lg shadow-md">' +
                    '<div class="grid grid-cols-2 gap-4 text-center">' +
                        '<div>' +
                            '<div class="text-2xl font-bold">' + analytics.streak + '</div>' +
                            '<div class="text-xs text-muted-foreground">Day Streak</div>' +
                        '</div>' +
                        '<div>' +
                            '<div class="text-2xl font-bold">' + analytics.avgWordsPerDay + '</div>' +
                            '<div class="text-xs text-muted-foreground">Avg. Daily Words</div>' +
                        '</div>' +
                        '<div>' +
                            '<div class="text-2xl font-bold">' + analytics.avgGoalTime + '</div>' +
                            '<div class="text-xs text-muted-foreground">Avg. Goal Time</div>' +
                        '</div>' +
                        '<div>' +
                            '<div class="text-2xl font-bold">' + analytics.totalPages + '</div>' +
                            '<div class="text-xs text-muted-foreground">Total Pages</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="w-full p-4 bg-white rounded-lg shadow-md flex flex-col items-center">' +
                    '<div class="flex items-start justify-between w-full">' +
                        '<div class="flex-grow">' +
                            '<div class="text-sm font-semibold text-muted-foreground">Your current rank</div>' +
                            '<div class="text-lg font-bold">' + analytics.rank + '</div>' +
                        '</div>' +
                        '<ion-icon name="' + rankIcon + '" class="w-12 h-12 ' + rankColor + ' ml-4"></ion-icon>' +
                    '</div>' +
                    '<div class="w-full mt-4">' +
                        '<div class="text-xs text-muted-foreground text-center mb-2">' +
                            progressText +
                        '</div>' +
                        '<div class="w-full bg-gray-200 rounded-full h-1.5">' +
                            '<div class="bg-primary h-1.5 rounded-full" style="width: ' + progressPercentage + '%"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

        generateCalendar();
    }

    function getRankLevel(rank) {
        const ranks = [
            { name: "Word Dabbler", threshold: 1 },
            { name: "Novice Scribe", threshold: 500 },
            { name: "Adept Penman", threshold: 1000 },
            { name: "Word Wanderer", threshold: 1500 },
            { name: "Quill Rookie", threshold: 2000 },
            { name: "Page Apprentice", threshold: 2500 },
            { name: "Wordsmith in Training", threshold: 3000 },
            { name: "Prose Pupil", threshold: 3500 },
            { name: "Paragraph Novice", threshold: 4000 },
            { name: "Script Explorer", threshold: 4500 },
            { name: "Sentence Seeker", threshold: 5000 },
            { name: "Journeyman of Ink", threshold: 6000 },
            { name: "Verse Weaver", threshold: 7500 },
            { name: "Tale Teller", threshold: 9000 },
            { name: "Chapter Crafter", threshold: 10000 },
            { name: "Narrative Navigator", threshold: 12500 },
            { name: "Manuscript Maven", threshold: 15000 },
            { name: "Syntax Scholar", threshold: 17500 },
            { name: "Grammar Guardian", threshold: 20000 },
            { name: "Plot Architect", threshold: 22500 },
            { name: "Poetry Pioneer", threshold: 25000 },
            { name: "Story Shaper", threshold: 30000 },
            { name: "Text Curator", threshold: 35000 },
            { name: "Prose Philosopher", threshold: 40000 },
            { name: "Plot Magician", threshold: 45000 },
            { name: "Narrative Alchemist", threshold: 50000 },
            { name: "Epic Scribe", threshold: 55000 },
            { name: "Literary Luminary", threshold: 60000 },
            { name: "Verse Virtuoso", threshold: 65000 },
            { name: "Story Strategist", threshold: 70000 },
            { name: "Paragraph Prophet", threshold: 75000 },
            { name: "Master of Manuscripts", threshold: 80000 },
            { name: "Plot Sage", threshold: 85000 },
            { name: "Syntax Sorcerer", threshold: 90000 },
            { name: "Legend Crafter", threshold: 95000 },
            { name: "Virtuoso of Verse", threshold: 100000 },
            { name: "Word Weaver", threshold: 125000 },
            { name: "Tome Tactician", threshold: 150000 },
            { name: "Epic Composer", threshold: 175000 },
            { name: "Text Titan", threshold: 200000 },
            { name: "Guardian of Grammar", threshold: 225000 },
            { name: "Sentinel of Stories", threshold: 250000 },
            { name: "Master of Rhetoric", threshold: 275000 },
            { name: "Narrative Nomad", threshold: 300000 },
            { name: "Archon of Articulation", threshold: 350000 },
            { name: "Oracle of Oratory", threshold: 400000 },
            { name: "Syntax Sovereign", threshold: 450000 },
            { name: "Scribe Supreme", threshold: 500000 },
            { name: "Epic Emissary", threshold: 600000 },
            { name: "Legendary Lexicographer", threshold: 800000 },
            { name: "Emissary of Eloquence", threshold: 1000000 }
        ];
        return ranks.findIndex(r => r.name === rank) + 1;
    }

    function getNextRankInfo(totalWords) {
        const ranks = [
            { name: "Word Dabbler", threshold: 1 },
            { name: "Novice Scribe", threshold: 500 },
            { name: "Adept Penman", threshold: 1000 },
            { name: "Word Wanderer", threshold: 1500 },
            { name: "Quill Rookie", threshold: 2000 },
            { name: "Page Apprentice", threshold: 2500 },
            { name: "Wordsmith in Training", threshold: 3000 },
            { name: "Prose Pupil", threshold: 3500 },
            { name: "Paragraph Novice", threshold: 4000 },
            { name: "Script Explorer", threshold: 4500 },
            { name: "Sentence Seeker", threshold: 5000 },
            { name: "Journeyman of Ink", threshold: 6000 },
            { name: "Verse Weaver", threshold: 7500 },
            { name: "Tale Teller", threshold: 9000 },
            { name: "Chapter Crafter", threshold: 10000 },
            { name: "Narrative Navigator", threshold: 12500 },
            { name: "Manuscript Maven", threshold: 15000 },
            { name: "Syntax Scholar", threshold: 17500 },
            { name: "Grammar Guardian", threshold: 20000 },
            { name: "Plot Architect", threshold: 22500 },
            { name: "Poetry Pioneer", threshold: 25000 },
            { name: "Story Shaper", threshold: 30000 },
            { name: "Text Curator", threshold: 35000 },
            { name: "Prose Philosopher", threshold: 40000 },
            { name: "Plot Magician", threshold: 45000 },
            { name: "Narrative Alchemist", threshold: 50000 },
            { name: "Epic Scribe", threshold: 55000 },
            { name: "Literary Luminary", threshold: 60000 },
            { name: "Verse Virtuoso", threshold: 65000 },
            { name: "Story Strategist", threshold: 70000 },
            { name: "Paragraph Prophet", threshold: 75000 },
            { name: "Master of Manuscripts", threshold: 80000 },
            { name: "Plot Sage", threshold: 85000 },
            { name: "Syntax Sorcerer", threshold: 90000 },
            { name: "Legend Crafter", threshold: 95000 },
            { name: "Virtuoso of Verse", threshold: 100000 },
            { name: "Word Weaver", threshold: 125000 },
            { name: "Tome Tactician", threshold: 150000 },
            { name: "Epic Composer", threshold: 175000 },
            { name: "Text Titan", threshold: 200000 },
            { name: "Guardian of Grammar", threshold: 225000 },
            { name: "Sentinel of Stories", threshold: 250000 },
            { name: "Master of Rhetoric", threshold: 275000 },
            { name: "Narrative Nomad", threshold: 300000 },
            { name: "Archon of Articulation", threshold: 350000 },
            { name: "Oracle of Oratory", threshold: 400000 },
            { name: "Syntax Sovereign", threshold: 450000 },
            { name: "Scribe Supreme", threshold: 500000 },
            { name: "Epic Emissary", threshold: 600000 },
            { name: "Legendary Lexicographer", threshold: 800000 },
            { name: "Emissary of Eloquence", threshold: 1000000 }
        ];

        if (totalWords === 0) {
            return {
                name: "Word Dabbler",
                threshold: 1,
                currentThreshold: 0
            };
        }

        for (let i = 0; i < ranks.length; i++) {
            if (totalWords < ranks[i].threshold) {
                return {
                    name: ranks[i].name,
                    threshold: ranks[i].threshold,
                    currentThreshold: i > 0 ? ranks[i-1].threshold : 0
                };
            }
        }

        // If the user has surpassed all ranks
        return {
            name: "Emissary of Eloquence",
            threshold: ranks[ranks.length - 1].threshold,
            currentThreshold: ranks[ranks.length - 2].threshold
        };
    }

    function generateCalendar() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        let calendarHTML = `
            <div class="w-full p-4 bg-white rounded-lg shadow-md mt-8">
                <div class="text-center text-sm font-semibold text-gray-500 mb-2">${monthNames[currentMonth]}</div>
                <div class="grid grid-cols-7 gap-2">
        `;

        // Add empty cells for days before the 1st of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarHTML += '<div></div>';
        }

        const entries = JSON.parse(localStorage.getItem('writingEntries')) || [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const hasEntry = entries.some(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.getDate() === day && 
                       entryDate.getMonth() === currentMonth && 
                       entryDate.getFullYear() === currentYear;
            });

            const cellClass = hasEntry ? 'bg-green-500' : 
                              (date > currentDate ? 'bg-gray-300' : 'bg-red-500');

            calendarHTML += `
                <div class="flex items-center justify-center h-8 w-8 text-white text-xs rounded-full ${cellClass}">
                    ${day}
                </div>
            `;
        }

        calendarHTML += `
                </div>
            </div>
        `;

        const calendarContainer = document.createElement('div');
        calendarContainer.innerHTML = calendarHTML;
        analyticsContent.appendChild(calendarContainer);
    }

    const analytics = calculateAnalytics();
    updateAnalyticsDisplay(analytics);

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
});