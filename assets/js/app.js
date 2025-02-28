if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("/service-worker.js")
		.then(() => console.log("Service Worker Registered"))
		.catch((error) =>
			console.log("Service Worker Registration Failed:", error)
		);
}

function main() {
	// Set initial time (hours, minutes, seconds)
	function updateTimerDisplay(timeInSeconds) {
		let minutes = Math.floor(timeInSeconds / 60);
		let seconds = timeInSeconds % 60;

		// Format time with leading zeros
		document.getElementById("timer").textContent = `${String(minutes).padStart(
			2,
			"0"
		)}:${String(seconds).padStart(2, "0")}`;
	}

	function startCountdown(timeInSeconds) {
		updateTimerDisplay(timeInSeconds); // Initial display
		let countdown = setInterval(() => {
			if (timeInSeconds > 0) {
				timeInSeconds--;
				updateTimerDisplay(timeInSeconds);
			} else {
				clearInterval(countdown);
				document.getElementById("timer").textContent = "Finished!";
			}
		}, 1000);
	}

	// Start the countdown when the page loads
	const pomoBtn = document.getElementById("pomo-btn");
	pomoBtn.addEventListener("click", () => {
		startCountdown(25 * 60);
		console.log("pomo clicked");
	});

	function generateHeatmap() {
		const heatmap = document.getElementById("heatmap");
		const totalDays = 28 * 7; // 53 weeks x 7 days

		for (let i = 0; i < totalDays; i++) {
			const day = document.createElement("div");
			day.classList.add("day");

			// Random contribution level (0-4)
			let contributionLevel = Math.floor(Math.random() * 5);
			if (contributionLevel > 0) {
				day.classList.add(`level-${contributionLevel}`);
			}

			heatmap.appendChild(day);
		}
	}

	generateHeatmap();
}

window.onload = main;
