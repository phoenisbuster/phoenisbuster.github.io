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

//FCM -------------------------------------------------
// firebaseMessaging = getMessaging(app);

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("./firebase-messaging-sw.js")
//     .then(function (registration) {
//       console.log("Registration successful");
//       var serviceWorker;
//       if (registration.installing) {
//         serviceWorker = registration.installing;
//       } else if (registration.waiting) {
//         serviceWorker = registration.waiting;
//       } else if (registration.active) {
//         serviceWorker = registration.active;
//       }

//       if (serviceWorker) {
//         // swRegistration = serviceWorker;
//         console.log("sw current state", serviceWorker.state);
//         if (serviceWorker.state == "activated") {
//           //If push subscription wasnt done yet have to do here
//           console.log("sw already activated - Do watever needed here");
//           // subscribeUser();
//         }
//         serviceWorker.addEventListener("statechange", function (e) {
//           console.log("sw statechange : ", e.target.state);
//           if (e.target.state == "activated") {
//             // use pushManger for subscribing here.
//             console.log(
//               "Just now activated. now we can subscribe for push notification"
//             );
//             // subscribeUser();
//           }
//         });
//       }
//     })
//     .catch(function (err) {
//       console.log("Service worker registration failed, error:", err);
//     });
// }

// // Use serviceWorker.ready to ensure that you can subscribe for push
// navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
//   swRegistration = serviceWorkerRegistration;
//   const options = {
//     userVisibleOnly: true,
//     applicationServerKey: publicVapidKey,
//   };
//   serviceWorkerRegistration.pushManager.subscribe(options).then(
//     (pushSubscription) => {
//       // The push subscription details needed by the application
//       // server are now available, and can be sent to it using,
//       // for example, an XMLHttpRequest.
//     },
//     (error) => {
//       // During development it often helps to log errors to the
//       // console. In a production environment it might make sense to
//       // also report information about errors back to the
//       // application server.
//       console.error(error);
//     }
//   );
// });

// navigator.serviceWorker.addEventListener("message", (event) => {
//   console.log("zzz Received a message from service worker");
//   if (event.data.message == "push_message_received") {
//     fcmMessage = event.data.data;
//   }
// });

// function subscribeUserOnClick() {
//   console.log("zzz subscribeUserOnClick");
//   subscribeUser();
//   let canvas = document.getElementById("GameCanvas");
//   if (fcmToken == null) return;
//   if (canvas != null) {
//     canvas.removeEventListener("touchstart", subscribeUserOnClick);
//     canvas.removeEventListener("click", subscribeUserOnClick);
//   }
// }

// let canvas = document.getElementById("GameCanvas");
// if (canvas != null) {
//   canvas.addEventListener("touchstart", subscribeUserOnClick);
//   canvas.addEventListener("click", subscribeUserOnClick);
// }

// function subscribeUser() {
//   Notification.requestPermission().then((permission) => {
//     if (permission === "granted") {
//       console.log("zzzzz Notification permission granted.");
//       getFCMToken();
//     } else {
//       console.error("zzzzz Notification permission denied.");
//     }
//   });
// }

// async function getFCMToken() {
//   await swRegistration;

//   console.log("zzzz", getToken);
//   getToken(firebaseMessaging, {
//     vapidKey: publicVapidKey,
//     serviceWorkerRegistration: swRegistration,
//   })
//     .then((currentToken) => {
//       if (currentToken) {
//         console.log("zzzzz got Token");
//         fcmToken = currentToken;
//       } else {
//         console.log("zzzzz No registration token available.");
//       }
//     })
//     .catch((error) => {
//       console.log(
//         "zzzzz Error getting token:",
//         error,
//         "getTokenTryCount",
//         getTokenTryCount
//       );
//       if (getTokenTryCount > 0) {
//         getFCMToken();
//         getTokenTryCount--;
//       }
//     });
// }
//End FCM -------------------------------------------------

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