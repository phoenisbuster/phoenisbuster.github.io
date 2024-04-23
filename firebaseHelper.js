import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics, logEvent, setUserProperties, setUserId } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
//Firebase cloud messaging
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging.js"

// Firebase Authentication
import { getAuth, signInWithPopup, TwitterAuthProvider } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-8419FXJhblNYzBxSXgbSRuPJGhlOtkQ",
  authDomain: "cocopark-f0d1f.firebaseapp.com",
  projectId: "cocopark-f0d1f",
  storageBucket: "cocopark-f0d1f.appspot.com",
  messagingSenderId: "1030437474910",
  appId: "1:1030437474910:web:47497aef2391e9f91c9acf",
  measurementId: "G-9VFKMFBZGJ",
};
//FCM-----------------------
const publicVapidKey =
  "BHU72gbUZspoVUkYJN4Ij2A8bzJAatxT-Uxn-QY3-KG1g9MK0T9zX6rxbY3iZ4qJyQTpHB5En3xo4-3YCzQK2OA";

var firebaseAnalytics;
var firebaseLogEvent;
var firebaseSetUserProperties;
var firebaseSetUserId;

//FCM-------------------
var swRegistration;
var firebaseMessaging;
var isSubscribed = false;
var getTokenTryCount = 10;
var fcmToken = null;
var fcmMessage = null;
//----------------------

// Initialize Firebase
const app = initializeApp(firebaseConfig);
firebaseAnalytics = getAnalytics(app);
firebaseLogEvent = logEvent;
firebaseSetUserProperties = setUserProperties;
firebaseSetUserId = setUserId;

console.log("Firebase initialized", app);

//Firebase Authentication -------------------------------------------------
const provider = new TwitterAuthProvider();
const auth = getAuth(app);
auth.languageCode = 'it';
console.log("auth", auth);

window.signInWithTwitterPopup = function()
{
  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      const credential = TwitterAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const secret = credential.secret;

      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...

      console.log("Sign In Twitter", credential, token, secret, user);
      return {token: token, secret: secret, user: user, error: false};
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = TwitterAuthProvider.credentialFromError(error);
      // ...
      console.error("Sign In Twitter Error", errorCode, errorMessage, email, credential);
      return {token: "", secret: "", user: null, error: true};
    });
} 

window.signInWithTwitterCred = function()
{
  return signInWithCredential(auth, credential)
    .then((result) => 
    {
      // Signed in 
      const credential = TwitterAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const secret = credential.secret;

      console.log("Sign In Twitter", credential, token, secret);
      return {token: token, secret: secret, error: false};
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = TwitterAuthProvider.credentialFromError(error);
      // ...
      console.error("Sign In Twitter Error", errorCode, errorMessage, email, credential);
      return {token: "", secret: "", error: true};
    });
}

//FirebaseAnalytics -------------------------------------------------
window.logEvent = function(event_name, param1, param2) {
  firebaseLogEvent(firebaseAnalytics, event_name, param1, param2);
}

window.setUserProperties = function(property) {
  firebaseSetUserProperties(firebaseAnalytics, property);
}

window.setUserId = function(userId) {
  firebaseSetUserId(firebaseAnalytics, userId);
}
//End sFirebaseAnalytics -------------------------------------------------