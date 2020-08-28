import React, { useState, useEffect } from "react";
import "./App.css";
import MainPage from "./components/MainPage";
import { makeStyles } from "@material-ui/styles";

import * as firebase from "firebase/app";
import firebaseConfig from "./config.js";

import "firebase/auth";
import "firebase/firestore";

firebase.initializeApp(firebaseConfig);
const useStyles = makeStyles();

function App() {
  const db = firebase.firestore();
  const auth = useState(false);
  const userId = useState("");
  const userVotes = useState([]);
  const userPhotoUrl = useState("");
  const userName = useState("");
  const authProvider = useState("");
  const likedGreeting = useState(false);

  const user = {
    auth: auth,
    userId: userId,
    userVotes: userVotes,
    userPhotoUrl: userPhotoUrl,
    userName: userName,
    authProvider: authProvider,
    likedGreeting: likedGreeting,
  };
  useEffect(() => {
    if (auth[0] && userId[0] && userVotes[0].toString() !== "") {
      db.collection("users").doc(userId[0]).set({
        votes: userVotes[0],
      });
    }
  }, [db, auth, userVotes, userId]);

  return (
    <div className="App">
      <MainPage user={user} />
    </div>
  );
}

export default App;
