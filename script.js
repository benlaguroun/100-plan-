const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer",
    "It always seems impossible until it’s done. - Nelson Mandela",
    // Add more quotes as needed
];

document.addEventListener("DOMContentLoaded", function() {
    const calendarElement = document.getElementById("calendar");
    const quoteElement = document.getElementById("quote");
    const totalProgressElement = document.getElementById("total-progress");

    let actions = JSON.parse(localStorage.getItem("habitActions")) || initializeActions();

    function initializeActions() {
        let initialActions = [];
        for (let i = 0; i < 100; i++) {
            initialActions.push({ action: null }); // null indicates no action yet
        }
        localStorage.setItem("habitActions", JSON.stringify(initialActions));
        return initialActions;
    }

    function saveActions() {
        localStorage.setItem("habitActions", JSON.stringify(actions));
    }

    function calculateDayPercentage(dayIndex) {
        const dayActions = actions[dayIndex];
        if (dayActions.action === null) return 0;
        return dayActions.action === "positive" ? 100 : 0;
    }

    function updateWeekProgress(weekIndex) {
        let positive = 0;
        let total = 0;
        for (let i = 0; i < 7; i++) {
            const dayIndex = weekIndex * 7 + i;
            if (dayIndex < actions.length) {
                if (actions[dayIndex].action === "positive") positive++;
                if (actions[dayIndex].action !== null) total++;
            }
        }
        return total === 0 ? 0 : (positive / total) * 100;
    }

    function renderCalendar() {
        calendarElement.innerHTML = ""; // Clear the calendar

        for (let week = 0; week < Math.ceil(actions.length / 7); week++) {
            const weekCard = document.createElement("div");
            weekCard.classList.add("week-card");

            const weekTitle = document.createElement("div");
            weekTitle.classList.add("week-title");
            weekTitle.textContent = `Week ${week + 1}`;
            weekCard.appendChild(weekTitle);

            for (let day = 0; day < 7; day++) {
                const dayIndex = week * 7 + day;
                if (dayIndex >= actions.length) break;

                const dayContainer = document.createElement("div");
                dayContainer.classList.add("day-container");

                const dayLabel = document.createElement("div");
                dayLabel.classList.add("day-label");

                const daySpan = document.createElement("span");
                daySpan.textContent = `Day ${dayIndex + 1}`;
                dayLabel.appendChild(daySpan);

                const actionButtons = document.createElement("div");
                actionButtons.classList.add("action-buttons");

                const greenBox = document.createElement("div");
                greenBox.classList.add("green-box");
                greenBox.innerHTML = actions[dayIndex].action === "positive" ? "✔" : "";
                greenBox.addEventListener("click", function () {
                    if (actions[dayIndex].action === null) {
                        actions[dayIndex].action = "positive";
                        saveActions();
                        renderCalendar();
                    }
                });
                actionButtons.appendChild(greenBox);

                const redBox = document.createElement("div");
                redBox.classList.add("red-box");
                redBox.innerHTML = actions[dayIndex].action === "negative" ? "✔" : "";
                redBox.addEventListener("click", function () {
                    if (actions[dayIndex].action === null) {
                        actions[dayIndex].action = "negative";
                        saveActions();
                        renderCalendar();
                    }
                });
                actionButtons.appendChild(redBox);

                dayLabel.appendChild(actionButtons);

                const dayPercentage = document.createElement("div");
                dayPercentage.classList.add("day-percentage");
                dayPercentage.textContent = `${calculateDayPercentage(dayIndex)}%`;

                dayContainer.appendChild(dayLabel);
                dayContainer.appendChild(dayPercentage);

                weekCard.appendChild(dayContainer);
            }

            const weekProgress = updateWeekProgress(week);
            const weekProgressElement = document.createElement("div");
            weekProgressElement.textContent = `Week Progress: ${weekProgress.toFixed(2)}%`;
            weekProgressElement.classList.add("week-progress");
            weekCard.appendChild(weekProgressElement);

            const resetButton = document.createElement("button");
            resetButton.textContent = "Reset Week";
            resetButton.classList.add("reset-button");
            resetButton.addEventListener("click", function () {
                resetWeek(week);
            });
            weekCard.appendChild(resetButton);

            calendarElement.appendChild(weekCard);
        }

        updateTotalProgress();
    }

    function updateTotalProgress() {
        const totalProgress = actions.reduce((sum, day) => sum + (day.action === "positive" ? 1 : 0), 0);
        totalProgressElement.textContent = ((totalProgress / actions.length) * 100).toFixed(2);
    }

    function resetWeek(weekIndex) {
        for (let i = 0; i < 7; i++) {
            const dayIndex = weekIndex * 7 + i;
            if (dayIndex < actions.length) {
                actions[dayIndex].action = null;
            }
        }
        saveActions();
        renderCalendar();
    }

    function displayRandomQuote() {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.textContent = randomQuote;
    }

    renderCalendar();
    displayRandomQuote();
    setInterval(displayRandomQuote, 60000); // Change quote every minute
});
