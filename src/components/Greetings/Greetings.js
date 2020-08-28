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

  useEffect(() => {
    db.collection("greetings")
      .doc(greetings.id)
      .get()
      .then((response) => {
        setGreetingVotes(response.data().votes);
      });
  }, [userVotes, db, greetings.id]);

  function incrementVote() {
    if (authExists) {
      db.collection("greetings")
        .doc(greetings.id)
        .update({
          votes: firebase.firestore.FieldValue.increment(1),
        });
      setUserVotes((userVotes) => {
        return [...userVotes, greetings.id];
      });
    } else {
      console.log("log in for at stemme");
    }
  }

  // function decrementVote() {
  //   console.log("liked");
  //   if (authExists) {
  //     db.collection("greetings")
  //       .doc(greetings.id)
  //       .update({
  //         votes: firebase.firestore.FieldValue.increment(-1),
  //       });
  //     setUserVotes((userVotes) => {
  //       return [...userVotes, greetings.id];
  //     });
  //   } else {
  //     alert("not logged in");
  //   }
  // }

  const name = greetings.data().name;
  const beskrivelse = greetings.data().beskrivelse;

  const classes = useStyles();

  // function CheckIfLiked() {
  //   const userLikedGreeting = db
  //     .collection("users")
  //     .doc(greetings.id)
  //     .get(userId);

  //   if (authExists) {
  //     if (userLikedGreeting == greetings.id) {
  //       return <FavoriteIcon />;
  //     } else {
  //       return (
  //         <IconButton
  //           onClick={incrementVote}
  //           aria-label="add to favorites"
  //           className={classes.likeButton}
  //         >
  //           <FavoriteBorderIcon />
  //         </IconButton>
  //       );
  //     }
  //   } else {
  //     return (
  //       <IconButton
  //         onClick={incrementVote}
  //         aria-label="add to favorites"
  //         className={classes.likeButton}
  //       >
  //         <FavoriteBorderIcon />
  //       </IconButton>
  //     );
  //   }
  // }

  // render element
  return (
    <Grid container item xs={12} sm={6} md={4} justify="center">
      <Card className={classes.card} elevation={0}>
        <Typography variant="h5">{name}</Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {beskrivelse}
          </Typography>
        </CardContent>
        <img src="handshaking.jpg" height="400" />
        <Grid container alignItems="center">
          <Grid item xs={3}></Grid>

          <IconButton
            onClick={incrementVote}
            aria-label="add to favorites"
            className={classes.likeButton}
          >
            <FavoriteBorderIcon />
          </IconButton>
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
