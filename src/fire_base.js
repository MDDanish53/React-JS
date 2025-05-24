import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "authDomain",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize firebase authentication
const auth = getAuth(app);

//configure firestore for database
const db = getFirestore(app);

//user signup function
const signup = async (name, email, password) => {
  try {
    //creating user in firebase
    const res = await createUserWithEmailAndPassword(auth, email, password);
    //getting the user data
    const user = res.user;
    //storing the user in the firestore database
    await addDoc(collection(db, "user"), {
      //defining the data which will be stored in this user collection
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "))
  }
};

//user login function
const login = async (email, password) => {
    try {
        //code for user login(using this user will be logged in to our website)
        await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.log(error)
        toast.error(error.code.split("/")[1].split('-').join(" "))
    }
}

//user logout function
const logout = () => {
    signOut(auth)
}

export {auth, db, login, logout, signup}