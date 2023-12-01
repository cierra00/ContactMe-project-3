// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, onSnapshot, doc, getDoc, getDocs, collection, addDoc, deleteDoc, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

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
const db = getFirestore(app);

async function getTasks(db) {
    const namesCol = collection(db, 'Contacts');
    const nameSnapshot = await getDocs(namesCol);
    const nameList = nameSnapshot.docs.map(doc => doc.data());
    return nameList;
  }
  enableIndexedDbPersistence(db).catch((err)=>{
    if(err.code == 'failed-precondition'){
      console.log("Persistence failed");
    } else if(err.code == "unimplemented"){
      console.log("Persistence Does Not exist")
    }
  })
  /*const unSub = onSnapshot(collection(db, "Contacts"), (doc)=>{
    //console.log(doc.docChanges());
    doc.docChanges().forEach((change)=> {
        //console.log(change, change.doc.data(), change.doc.id);
        change.type ==="added"? renderContact(change.doc.data(), change.doc.id) : console.log("No changes")
    })
  })
*/

const unsub = onSnapshot(collection(db, "Contacts"), (doc) => {
    //   console.log(doc.docChanges());
    doc.docChanges().forEach((change) => {
      // console.log(change, change.doc.data(), change.doc.id);
      if (change.type === "added") {
        //Call render function in UI
        renderTask(change.doc.data(), change.doc.id);
      }
      if (change.type === "removed") {
        removeTask(change.doc.id)
      }
    });
  });
  
  // Add names

  const form = document.querySelector("form");
  form.addEventListener("submit", (event)=>{
    event.preventDefault();

    addDoc(collection(db, "Contacts"),{
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      phone: form.phone.value,
      website: form.website.value


    }).catch((err)=> console.log(err));
    form.firstName.value = "";
    form.lastName.value = "";
    form.email.value = "";
    form.phone.value = "";
    form.website.value = "";
  })

  //delete names

  const taskContainer = document.querySelector(".tasks");
  taskContainer.addEventListener("click", (event)=>{
    if(event.target.tagName === "I"){
      const id = event.target.getAttribute("data-id");
      deleteDoc(doc(db, "Contacts", id));
    }
  })

  

  