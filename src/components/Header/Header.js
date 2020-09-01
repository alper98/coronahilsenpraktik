import React, { useEffect } from "react";

import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
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

  function signOut() {
    firebase
      .auth()
      .signOut()
      .then(function () {
        console.log("Signout successful.");
        setAuthExists(false);
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
        console.log(token);

        // The signed-in user info.
        var user = result.user;
        setUserPhotoUrl(user.photoURL);
        setUserName(user.displayName);
        setUserId(user.uid);
        setAuthProvider(user.providerData[0].providerId);
        console.log(userName, "Logged in from Google");
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

  if (!authExists) {
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
              style={{ width: 300, paddingTop: 0, borderRadius: "16px" }}
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
  } else {
    return (
      <Grid container justify="center">
        <Grid container justify="center">
          <h1 className={classes.headerTitle}>Coronahilsen</h1>
        </Grid>
        <Grid container justify="center">
          <h2 className={classes.subHeaderTitle}>Stem på din favorit hilsen</h2>
        </Grid>
        <div className={classes.userInfo}>
          <div className={classes.userNameAndProfilePic}>
            <h2 className={classes.loggedInAsTitle}>{userName} </h2>
            <img src={userPhotoUrl} className={classes.profilePic} />
          </div>
          <div className={classes.logOutBox} onClick={signOut}>
            <h3 className={classes.logOutText}>Log ud</h3>
            <ExitToAppIcon className={classes.logOutIcon} />
          </div>
        </div>
      </Grid>
    );
  }
}

export default Header;
