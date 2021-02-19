import React from "react";
import classes from "./Profile.css";
// import NavigationItems from "./../Navigation/NavigationItems/NavigationItems";
// import Button from "./../UI/Button/Button";
// import MyPosts from "./MyPosts/MyPosts";
import Aux from "./../../hoc/Auxil/Auxil";
import NavigationItem from "../Navigation/NavigationItem/NavigationItem";
import classes1 from "../Navigation/NavigationItems/NavigationItems.css";
import User from "./User/User";
// import { Switch, Route } from "react-router-dom";
const Profile = (props) => {
  return (
    <Aux>
      <article className={classes.Profile}>
        <h1>Profile</h1>
        <User />
      </article>
    </Aux>
  );
};
export default Profile;
