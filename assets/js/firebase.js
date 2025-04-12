import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
	getAuth,
	EmailAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import * as firebaseui from "https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.js";

const firebaseConfig = {
	apiKey: "AIzaSyDr1MLlIMbJyi36DWBxMlL_z8BN760TOHE",
	authDomain: "pomodoro-app-775fc.firebaseapp.com",
	projectId: "pomodoro-app-775fc",
	storageBucket: "pomodoro-app-775fc.appspot.com",
	messagingSenderId: "418755239953",
	appId: "1:418755239953:web:8fb1fd26af5cea43dd11b0",
	measurementId: "G-R3PC6T083R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(auth);

const uiConfig = {
	callbacks: {
		signInSuccessWithAuthResult: function (authResult, redirectUrl) {
			return true;
		},
		uiShown: function () {
			document.getElementById("loader").style.display = "none";
		},
	},
	signInFlow: "popup",
	signInSuccessUrl: "https://nash268.github.io/pomodoro/",
	signInOptions: [EmailAuthProvider.PROVIDER_ID],
};

// Start FirebaseUI
ui.start("#firebaseui-auth-container", uiConfig);
