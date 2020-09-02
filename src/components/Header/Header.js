import React, { useEffect } from "react";

import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { FacebookLoginButton } from "react-social-login-buttons";
import { GoogleLoginButton } from "react-social-login-buttons";
import { TwitterLoginButton } from "react-social-login-buttons";

import styles from "./Header.styles.js";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

function Header({ user }) {
  const db = firebase.firestore();

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [authExists, setAuthExists] = user.auth;
  const [userId, setUserId] = user.userId;
  const [userVotes, setUserVotes] = user.userVotes;
  const [userPhotoUrl, setUserPhotoUrl] = user.userPhotoUrl;
  const [userName, setUserName] = user.userName;
  const [authProvider, setAuthProvider] = user.authProvider;

  // hook setting states to values from the sessionstorage
  // whenever a change in authExists happens
  useEffect(() => {
    if (sessionStorage.getItem("sessionAuth")) {
      setUserPhotoUrl(sessionStorage.getItem("userPhotoUrl"));
      setUserName(sessionStorage.getItem("userName"));
      setUserId(sessionStorage.getItem("userId"));
      setAuthProvider(sessionStorage.getItem("authProvider"));
      db.collection("users")
        .doc(sessionStorage.getItem("userId"))
        .get()
        .then((response) => {
          setUserVotes(response.data().votes);
        })
        .catch((e) => {
          console.log(e);
        });
      setAuthExists(true);
    } else {
      sessionStorage.clear();
    }
  }, [authExists]);

  function signOut() {
    firebase
      .auth()
      .signOut()
      .then(function () {
        console.log("Signout successful.");
        setAuthExists(false);
        sessionStorage.clear();
        setUserId("");
        setUserVotes([]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Function to handle facebook auth with firebase
  function facebookLogin() {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
      display: "popup",
    });
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        console.log(token);
        // The signed-in user info.
        var user = result.user;
        setUserPhotoUrl(user.photoURL);
        setUserName(user.displayName);
        setUserId(user.uid);
        setAuthProvider(user.providerData[0].providerId);
        console.log(userName, "Logged in from Facebook");

        sessionStorage.setItem("userPhotoUrl", user.photoURL);
        sessionStorage.setItem("userName", user.displayName);
        sessionStorage.setItem("userId", user.uid);
        sessionStorage.setItem("authProvider", user.providerData[0].providerId);

        sessionStorage.setItem("sessionAuth", true);
        setAuthExists(true);

        // getting votes from user logged in

        db.collection("users")
          .doc(user.uid)
          .get()
          .then((response) => {
            setUserVotes(response.data().votes);
          })
          .catch((e) => {
            console.log(e);
          });
        // ...
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
  }

  // Function to handle google auth with firebase

  function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      display: "popup",
    });
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        setUserPhotoUrl(user.photoURL);
        setUserName(user.displayName);
        setUserId(user.uid);
        setAuthProvider(user.providerData[0].providerId);
        console.log(userName, "Logged in from Google");

        sessionStorage.setItem("userPhotoUrl", user.photoURL);
        sessionStorage.setItem("userName", user.displayName);
        sessionStorage.setItem("userId", user.uid);
        sessionStorage.setItem("authProvider", user.providerData[0].providerId);

        sessionStorage.setItem("sessionAuth", true);
        setAuthExists(true);

        // getting votes from user logged in
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((response) => {
            setUserVotes(response.data().votes);
          })
          .catch((e) => {
            console.log(e);
          });
        // ...
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
  }

  function twitterLogin() {
    var provider = new firebase.auth.TwitterAuthProvider();
    provider.setCustomParameters({
      display: "popup",
    });
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        console.log(result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        setUserPhotoUrl(user.photoURL);
        setUserName(user.displayName);
        setUserId(user.uid);
        setAuthProvider(user.providerData[0].providerId);

        console.log(userName, "Logged in from Twitter");

        sessionStorage.setItem("userPhotoUrl", user.photoURL);
        sessionStorage.setItem("userName", user.displayName);
        sessionStorage.setItem("userId", user.uid);
        sessionStorage.setItem("authProvider", user.providerData[0].providerId);

        sessionStorage.setItem("sessionAuth", true);
        setAuthExists(true);

        // getting votes from user logged in
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((response) => {
            setUserVotes(response.data().votes);
          })
          .catch((e) => {
            console.log(e);
          });
        // ...
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
  }

  function UserInfo() {
    return (
      <Grid container justify="center">
        <Grid container justify="center">
          <h1 className={classes.headerTitle}>Coronahilsen</h1>
        </Grid>
        <Grid container justify="center">
          <h2 className={classes.subHeaderTitleLoggedIn}>
            Stem på din favorit hilsen
          </h2>
        </Grid>
        <div className={classes.userInfo}>
          <div className={classes.userNameAndProfilePic}>
            <h2 className={classes.loggedInAsTitle}>{userName} </h2>
            <img
              src={userPhotoUrl}
              alt="Profil billede"
              className={classes.profilePic}
            />
          </div>
          <div className={classes.logOutBox} onClick={signOut}>
            <h3 className={classes.logOutText}>Log ud</h3>
            <ExitToAppIcon className={classes.logOutIcon} />
          </div>
        </div>
      </Grid>
    );
  }

  function LoginOptions() {
    return (
      <Grid container justify="center">
        <Grid container justify="center">
          <Grid container justify="center">
            <h1 className={classes.headerTitle}>Coronahilsen</h1>
          </Grid>
          <h2 className={classes.subHeaderTitle}>
            Log ind, og stem på din favorit hilsen
          </h2>
        </Grid>
        <Grid container justify="center">
          <Grid
            container
            item
            spacing={8}
            className={classes.loginOptionContainer}
            justify="center"
          >
            <GoogleLoginButton
              style={{
                width: 300,
                paddingTop: 0,
                borderRadius: "16px",
              }}
              className={classes.loginOption}
              onClick={() => {
                googleLogin();
              }}
            >
              <span>Log ind med Google</span>
            </GoogleLoginButton>

            <FacebookLoginButton
              style={{ width: 300, paddingTop: 0, borderRadius: "16px" }}
              className={classes.loginOption}
              onClick={() => {
                facebookLogin();
              }}
            >
              <span>Log ind med Facebook</span>
            </FacebookLoginButton>
            <TwitterLoginButton
              style={{ width: 300, paddingTop: 0, borderRadius: "16px" }}
              className={classes.loginOption}
              onClick={() => {
                twitterLogin();
              }}
            >
              <span>Log ind med Twitter</span>
            </TwitterLoginButton>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  // rendering of elements
  if (!authExists) {
    return <LoginOptions />;
  } else {
    return <UserInfo />;
  }
}

export default Header;
