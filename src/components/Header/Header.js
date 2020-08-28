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
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [authExists, setAuthExists] = user.auth;
  const [userId, setUserId] = user.userId;
  const [userVotes, setUserVotes] = user.userVotes;
  const [userPhotoUrl, setUserPhotoUrl] = user.userPhotoUrl;
  const [userName, setUserName] = user.userName;
  const [authProvider, setAuthProvider] = user.authProvider;

  function loggedInUser() {
    return (
      <div>
        <h2>Velkommen {userName}</h2>
        <Avatar alt="Remy Sharp" src={userPhotoUrl} className={classes.large} />
      </div>
    );
  }

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
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        // ...

        setUserPhotoUrl(user.photoURL);
        setUserName(user.displayName);
        setUserId(user.uid);
        setAuthProvider(user.providerData[0].providerId);
        console.log(userName, "Logged in from Facebook");
        setAuthExists(true);
      })
      .catch(function (error) {
        console.log(error);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
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
        setAuthExists(true);

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
            <h2 className={classes.headerTitle}>Coronahilsen</h2>
          </Grid>
          <h3 className={classes.headerTitle}>
            Log ind, og stem på din favorit hilsen
          </h3>
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
              style={{ width: 300, paddingTop: 0 }}
              className={classes.loginOption}
              onClick={() => {
                googleLogin();
              }}
            >
              <span>Log ind med Google</span>
            </GoogleLoginButton>

            <FacebookLoginButton
              style={{ width: 300 }}
              className={classes.loginOption}
              onClick={() => {
                facebookLogin();
              }}
            >
              <span>Log ind med Facebook</span>
            </FacebookLoginButton>
            <TwitterLoginButton
              style={{ width: 300 }}
              className={classes.loginOption}
              onClick={() => {
                alert("todo: twitter login");
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
          <h2 className={classes.headerTitle}>Coronahilsen</h2>
        </Grid>
        <h3 className={classes.loggedInAsTitle}>Logget ind som {userName}</h3>
      </Grid>
    );
  }
}

export default Header;
