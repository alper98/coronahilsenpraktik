import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import styles from "./MainPage.styles.js";
import Greetings from "../Greetings";
import Footer from "../Footer";
import Header from "../Header";

import * as firebase from "firebase/app";
import "firebase/firestore";

const useStyles = makeStyles(styles);

// react redux firebase

function MainPage({ user }) {
  const [greetings, setGreetings] = useState([]);
  const classes = useStyles();
  const db = firebase.firestore();

  // async function der henter greetings fra db
  useEffect(() => {
    async function getGreetings() {
      var collection = await db
        .collection("greetings")
        .get()
        .catch((err) => console.log(err));
      if (collection) {
        var greetings_temp = [];
        collection.forEach((doc) => {
          greetings_temp.push(doc);
        });
        setGreetings(greetings_temp);
      } else {
      }
    }
    getGreetings();
  }, [db]);

  // map rendering elements from db
  return (
    <>
      <Header user={user} />
      <Grid container justify="center">
        <Grid
          container
          item
          spacing={4}
          className={classes.greetingsContainer}
          justify="center"
        >
          {greetings.map((greetings, index) => (
            <Greetings key={index} greetings={greetings} user={user} />
          ))}
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default MainPage;
