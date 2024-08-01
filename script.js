const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer",
    "It always seems impossible until it’s done. - Nelson Mandela",
    // Add more quotes up to 100
];

document.addEventListener("DOMContentLoaded", function() {
    const calendarElement = document.getElementById("calendar");
    const quoteElement = document.getElementById("quote");
    const totalProgressElement = document.getElementById("total-progress");

    let actions = JSON.parse(localStorage.getItem("habitActions")) || initializeActions();

    function initializeActions() {
        let initialActions = [];
        for (let i = 0; i < 100; i++) {
            initialActions.push({ positive: 0, negative: 0 });
        }
        localStorage.setItem("habitActions", JSON.stringify(initialActions));
        return initialActions;
    }

    function saveActions() {
        localStorage.setItem("habitActions", JSON.stringify(actions));
    }

    function calculateDayPercentage(dayIndex) {
        const dayActions = actions[dayIndex];
        const total = dayActions.positive + dayActions.negative;
        if (total === 0) return 0;
        return (dayActions.positive / total) * 100;
    }

    function updateWeekProgress(weekIndex) {
        let positive = 0;
        let total = 0;
        for (let i = 0; i < 7; i++) {
            const dayIndex = weekIndex * 7 + i;
            if (dayIndex < actions.length) {
                positive += actions[dayIndex].positive;
                total += actions[dayIndex].positive + actions[dayIndex].negative;
            }
        }
        return total === 0 ? 0 : (positive / total) * 100;
    }

    function renderCalendar() {
        calendarElement.innerHTML = "";
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
                greenBox.addEventListener("click", function () {
                    actions[dayIndex].positive++;
                    updateDay(dayIndex);
                });
                actionButtons.appendChild(greenBox);

                const redBox = document.createElement("div");
                redBox.classList.add("red-box");
                redBox.addEventListener("click", function () {
                    actions[dayIndex].negative++;
                    updateDay(dayIndex);
                });
                actionButtons.appendChild(redBox);

                dayLabel.appendChild(actionButtons);

                const dayPercentage = document.createElement("div");
                dayPercentage.classList.add("day-percentage");
                dayPercentage.textContent = `${calculateDayPercentage(dayIndex).toFixed(2)}%`;

                dayContainer.appendChild(dayLabel);
                dayContainer.appendChild(dayPercentage);

                weekCard.appendChild(dayContainer);
            }

            const weekProgress = updateWeekProgress(week);
            const weekProgressElement = document.createElement("div");
            weekProgressElement.textContent = `Week Progress: ${weekProgress.toFixed(2)}%`;
            weekProgressElement.classList.add("week-progress");
            weekCard.appendChild(weekProgressElement);

            calendarElement.appendChild(weekCard);
        }
        updateTotalProgress();
    }

    function updateDay(dayIndex) {
        saveActions();
        renderCalendar();
    }

    function updateTotalProgress() {
        let totalPositive = 0;
        let totalActions = 0;
        actions.forEach(day => {
            totalPositive += day.positive;
            totalActions += day.positive + day.negative;
        });
        const totalProgress = totalActions === 0 ? 0 : (totalPositive / totalActions) * 100;
        totalProgressElement.textContent = totalProgress.toFixed(2);

        // Update the motivational quote
        const dayIndex = Math.floor(totalActions / 7); // or a different logic
        quoteElement.textContent = quotes[dayIndex < quotes.length ? dayIndex : quotes.length - 1];
    }

    renderCalendar();
});
