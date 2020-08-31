import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, IconButton, Grid, Typography } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import styles from "./Greetings.styles.js";

import * as firebase from "firebase/app";
import "firebase/firestore";

const useStyles = makeStyles(styles);

function Greetings({ greetings, user }) {
  const db = firebase.firestore();
  const [authExists, setAuthExists] = user.auth;
  const [userId, setUserId] = user.userId;
  const [userVotes, setUserVotes] = user.userVotes;
  const [greetingVotes, setGreetingVotes] = useState(0);
  const [greetingLiked, setGreetingLiked] = useState("");
  const [greetingId, setGreetingId] = useState("");

  require.context("../../static", true, /\.mp4$/);

  const url = greetings.data().url;
  const name = greetings.data().name;
  const beskrivelse = greetings.data().beskrivelse;

  const classes = useStyles();

  useEffect(() => {
    db.collection("greetings")
      .doc(greetings.id)
      .get()
      .then((response) => {
        setGreetingVotes(response.data().votes);
      });
  }, [userVotes, db, greetings.id]);

  // like knap componenet
  function LikeButton() {
    if (userVotes.includes(greetings.id)) {
      return (
        <div>
          <IconButton
            onClick={decrementVote}
            aria-label="add to favorites"
            className={classes.unLikeButton}
          >
            <FavoriteIcon />
          </IconButton>
        </div>
      );
    } else {
      return (
        <div>
          <IconButton
            onClick={incrementVote}
            aria-label="add to favorites"
            className={classes.likeButton}
          >
            <FavoriteBorderIcon />
          </IconButton>
        </div>
      );
    }
  }

  // function for incrementering af stemmer
  function incrementVote() {
    if (authExists && !userVotes.includes(greetings.id)) {
      db.collection("greetings")
        .doc(greetings.id)
        .update({
          votes: firebase.firestore.FieldValue.increment(1),
        });
      setUserVotes((userVotes) => {
        return [...userVotes, greetings.id];
      });
    } else {
      console.log("log in for at stemme ellers har du allerede stemt på den");
    }
  }

  // function for decrementering af stemmer
  function decrementVote() {
    if (authExists) {
      db.collection("greetings")
        .doc(greetings.id)
        .update({
          votes: firebase.firestore.FieldValue.increment(-1),
        });
      setUserVotes((userVotes) =>
        userVotes.filter((item) => item !== greetings.id)
      );
    }
  }

  // render element
  return (
    <Grid container item xs={12} sm={6} md={4} justify="center">
      <Card className={classes.card} elevation={0}>
        <Typography variant="h5" className={classes.nameOfGreeting}>
          {name}
        </Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {beskrivelse}
          </Typography>
        </CardContent>
        <video
          src={url}
          className={classes.video}
          loop
          muted
          autoPlay
          height="450"
        />

        <Grid container alignItems="center">
          <Grid item xs={3}></Grid>

          <LikeButton />

          <Grid container item xs={6} justify="center">
            <Grid item xs={12}>
              <Typography className={classes.votesText}>Stemmer</Typography>
            </Grid>
            <Grid item xs={12}>
              <span className={classes.voteCount}>{greetingVotes}</span>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}

export default Greetings;
