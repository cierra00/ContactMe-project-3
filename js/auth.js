// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcayCxc0WoW1R70LwvlyeBJ6jBrbAr2pE",
  authDomain: "mobile-task-manager.firebaseapp.com",
  projectId: "mobile-task-manager",
  storageBucket: "mobile-task-manager.appspot.com",
  messagingSenderId: "954902763591",
  appId: "1:954902763591:web:fdf9d3adf643f01b057962"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//listen for auth status changes
onAuthStateChanged(auth, (user) => {
  // Check for user status
  // console.log(user);
  if (user) {
    console.log("User logged in: ", user.email);
    getTasks(db).then((snapshot) => {
      setupTasks(snapshot);
    });
    setupUI(user);
    const form = document.querySelector("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      addDoc(collection(db, "Contacts"), {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        phone: form.phone.value,
        website: form.website.value
      }).catch((error) => console.log(error));
      form.firstName.value = "";
      form.lastName.value = "";
      form.email.value = "";
      form.phone.value = "";
      form.website.value = "";
    });
  } else {
    // console.log("User Logged out");
    setupUI();
    setupTasks([]);
  }
});

//signup
const signupForm = document.querySelector("#signup-form");
// const auth = getAuth(app);
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
});

//logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      // console.log("user has signed out");
    })
    .catch((error) => {
      // An error happened.
    });
});

//login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // console.log(user);
      //close the login modal and reset the form
      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});