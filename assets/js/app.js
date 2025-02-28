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

	// Timer state variables
	let intervalId = null;
	let currentTimerType = null;
	let remainingTime = 0;
	let isTimerRunning = false;
	let updateOnFinish = false;

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

	// Reset heatmap
	function resetHeatMap() {
		contributions = Array(totalDays).fill(0);
		localStorage.setItem("contributions", JSON.stringify(contributions));
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

	function startCountdown() {
		updateTimerDisplay(remainingTime);
		intervalId = setInterval(() => {
			if (remainingTime > 0) {
				remainingTime--;
				updateTimerDisplay(remainingTime);
			} else {
				clearInterval(intervalId);
				intervalId = null;
				isTimerRunning = false;
				document.getElementById("timer").textContent = "Finished!";
				if (updateOnFinish) {
					const currentDayIndex = getCurrentDayIndex();
					if (currentDayIndex >= 0 && currentDayIndex < totalDays) {
						if (contributions[currentDayIndex] < 20) {
							contributions[currentDayIndex]++;
							localStorage.setItem(
								"contributions",
								JSON.stringify(contributions)
							);
							updateHeatmap();
						}
					} else {
						console.log("currentDayIndex out of range!");
						resetHeatMap();
					}
				}
				currentTimerType = null;
			}
		}, 1000);
	}

	function handleTimerClick(type) {
		if (currentTimerType === type) {
			// Toggle pause/resume
			if (isTimerRunning) {
				// Pause
				clearInterval(intervalId);
				isTimerRunning = false;
			} else {
				// Resume
				isTimerRunning = true;
				startCountdown();
			}
		} else {
			// Switch to different timer type
			if (isTimerRunning) {
				clearInterval(intervalId);
				isTimerRunning = false;
			}
			currentTimerType = type;
			remainingTime = type === 'pomo' ? 25 * 60 : 5 * 60;
			updateOnFinish = type === 'pomo';
			isTimerRunning = true;
			startCountdown();
		}
	}

	const pomoBtn = document.getElementById("pomo-btn");
	pomoBtn.addEventListener("click", () => {
		handleTimerClick('pomo');
	});
	breakBtn.addEventListener("click", () => {
		handleTimerClick('break');
	});

	updateHeatmap();
}

window.onload = main;