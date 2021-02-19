import React from "react";
import PostboxLogo from "../../assets/Images/postbox.png";
import classes from "./Logo.css";

const logo = (props) => (
  <div className={classes.Logo}>
    <img src={PostboxLogo} alt="My Postbox Logo"></img>
  </div>
);

export default logo;
