if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("/service-worker.js")
		.then(() => console.log("Service Worker Registered"))
		.catch((error) =>
			console.log("Service Worker Registration Failed:", error)
		);
}

function main() {
	const heatmap = document.getElementById("heatmap");
	const breakBtn = document.getElementById("break-btn");
	const totalDays = 21 * 7;
	let startDate = localStorage.getItem("startDate");
	if (!startDate) {
		startDate = new Date();
		localStorage.setItem("startDate", startDate.toISOString());
	} else {
		startDate = new Date(startDate);
	}
	const tooltip = document.createElement("div");

	// Tooltip styling
	tooltip.style.position = "absolute";
	tooltip.style.background = "rgba(0, 0, 0, 0.8)";
	tooltip.style.color = "white";
	tooltip.style.padding = "4px 8px";
	tooltip.style.borderRadius = "4px";
	tooltip.style.display = "none";
	document.body.appendChild(tooltip);

	let contributions =
		JSON.parse(localStorage.getItem("contributions")) ||
		Array(totalDays).fill(0);

	function getCurrentDayIndex() {
		const today = new Date();
		return Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
	}

	function updateHeatmap() {
		heatmap.innerHTML = "";
		const currentDayIndex = getCurrentDayIndex();

		contributions.forEach((level, index) => {
			const day = document.createElement("div");
			day.classList.add("day");
            if (level > 0) {
                const clampedLevel = Math.min(level, 4);  // Ensure level never exceeds 4
                day.classList.add(`level-${clampedLevel}`);
            }

			// Store date for tooltip
			const date = new Date(startDate);
			date.setDate(date.getDate() + index);

			// Hover effects
			day.addEventListener("mouseenter", (e) => {
				tooltip.style.display = "block";
				tooltip.textContent = `${date.toDateString()}: ${
					level === 0
						? "No Pomodoro"
						: `${level} Pomodoro${level > 1 ? "s" : ""}`
				}`;
			});

			day.addEventListener("mousemove", (e) => {
				tooltip.style.top = `${e.clientY + 10}px`;
				tooltip.style.left = `${e.clientX + 10}px`;
			});

			day.addEventListener("mouseleave", () => {
				tooltip.style.display = "none";
			});

			heatmap.appendChild(day);
		});
	}

	// Rest heatmap
	function resetHeatMap() {
		contributions = Array(totalDays).fill(0);
		localStorage.setItem("contributions", JSON.stringify(contributions));

		// Reset start date to today
		startDate = new Date();
		localStorage.setItem("startDate", startDate.toISOString());

		updateHeatmap();
	}


	function updateTimerDisplay(timeInSeconds) {
		let minutes = Math.floor(timeInSeconds / 60);
		let seconds = timeInSeconds % 60;
		document.getElementById("timer").textContent = `${String(minutes).padStart(
			2,
			"0"
		)}:${String(seconds).padStart(2, "0")}`;
	}

	function startCountdown(timeInSeconds, update_bool) {
		updateTimerDisplay(timeInSeconds);
		let countdown = setInterval(() => {
			if (timeInSeconds > 0) {
				timeInSeconds--;
				updateTimerDisplay(timeInSeconds);
			} else {
				clearInterval(countdown);
				document.getElementById("timer").textContent = "Finished!";
                if (!update_bool) return;
				const currentDayIndex = getCurrentDayIndex();
				if (currentDayIndex >= 0 && currentDayIndex < totalDays) {
					if (contributions[currentDayIndex] < 10) {
						contributions[currentDayIndex]++;
						localStorage.setItem(
							"contributions",
							JSON.stringify(contributions)
						);
						updateHeatmap();
					}
				} else {
					console("currentDayIndex out of range!");
					resetHeatMap();
				}
			}
		}, 1000);
	}

	const pomoBtn = document.getElementById("pomo-btn");
	pomoBtn.addEventListener("click", () => {
		startCountdown(25 * 60, true);
	});
    breakBtn.addEventListener("click", () => {
        startCountdown(5 * 60, false)
    });

	updateHeatmap();
}

window.onload = main;
