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
				const clampedLevel = Math.min(level, 4); // Ensure level never exceeds 4
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
		const intervalDuration = remainingTime;
		let startTime = Date.now();
		updateTimerDisplay(remainingTime);
		intervalId = setInterval(() => {
			let timePassed = Math.floor((Date.now() - startTime)/1000);
			if (intervalDuration > timePassed) {
				remainingTime = intervalDuration - timePassed;
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
                            addXP(10);
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
			remainingTime = type === "pomo" ? 25 * 60 : 5 * 60;
			updateOnFinish = type === "pomo";
			isTimerRunning = true;
			startCountdown();
		}
	}

	const pomoBtn = document.getElementById("pomo-btn");
	pomoBtn.addEventListener("click", () => {
		handleTimerClick("pomo");
	});
	breakBtn.addEventListener("click", () => {
		handleTimerClick("break");
	});

	updateHeatmap();

	let xp = parseInt(localStorage.getItem("xp")) || 0;
	let level = parseInt(localStorage.getItem("level")) || 1;
	let title = localStorage.getItem("title") || "Noob";

	// Function to calculate XP required for the next level
	function getXPForNextLevel(currentLevel) {
		return 100 * currentLevel; // Example: Level 1 = 100 XP, Level 2 = 200 XP, etc.
	}

	// Function to calculate the user's current level based on XP
	function getLevelFromXP(xp) {
		let level = 1;
		let xpNeeded = 100;
		while (xp >= xpNeeded) {
			xp -= xpNeeded;
			level++;
			xpNeeded = 100 * level;
		}
		return level;
	}

	// Function to get the user's title based on their level
	function getTitleFromLevel(level) {
		if (level === 1) return "Noob";
		if (level >= 2 && level <= 5) return "Beginner";
		if (level >= 6 && level <= 10) return "Rising Star";
		if (level >= 11 && level <= 20) return "Master";
		if (level >= 21) return "Grand Master";
		return "Noob";
	}

	// Function to update the XP bar and level info
	function updateXPBar() {
		const xpBar = document.getElementById("xp-bar");
		const currentXP = document.getElementById("current-xp");
		const nextLevelXP = document.getElementById("next-level-xp");
		const levelDisplay = document.getElementById("level");
		const titleDisplay = document.getElementById("title");

		const xpNeededForNextLevel = getXPForNextLevel(level);
		const progress = (xp / xpNeededForNextLevel) * 100;

		xpBar.style.width = `${progress}%`;
		currentXP.textContent = xp;
		nextLevelXP.textContent = xpNeededForNextLevel;
		levelDisplay.textContent = `Level ${level}`;
		titleDisplay.textContent = title;
	}

	// Function to add XP and update level/title
	function addXP(amount) {
		xp += amount;
		const newLevel = getLevelFromXP(xp);
		if (newLevel > level) {
			level = newLevel;
			title = getTitleFromLevel(level);
			localStorage.setItem("level", level);
			localStorage.setItem("title", title);
		}
		localStorage.setItem("xp", xp);
		updateXPBar();
	}

	// Initialize the XP bar on page load
	updateXPBar();
}

window.onload = main;
