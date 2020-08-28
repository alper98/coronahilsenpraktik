import React from "react";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    height: "40px",
    width: "100%",
    paddingTop: "15px",
  },
  text: {
    textDecoration: "none",
    fontWeight: "bold",
  },
});

function Footer() {
  const classes = useStyles();

  return <div className={classes.root}></div>;
}

export default Footer;
