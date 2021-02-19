import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./NavigationItem.css";

const NavigationItem = (props) => {
  let classProperty = classes.NavigationItem;
  switch (props.classProperty) {
    case "my-posts":
      classProperty = classes.NavigationItemmyposts;
      break;
    default:
      break;
  }
  // let icon = {props.children};
  // let icon;
  // if (props.icon === "home") {
  //   icon = <AiOutlineHome>{props.children}</AiOutlineHome>;
  // }
  return (
    <li className={classProperty}>
      <NavLink
        to={props.link}
        exact
        activeClassName="active-doc"
        activeStyle={{
          color: "skyblue",
          fontSize: "bolder",
        }}
      >
        {props.children}
      </NavLink>
    </li>
  );
};

export default NavigationItem;
