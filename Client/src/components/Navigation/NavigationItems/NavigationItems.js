import React, { useContext } from 'react';
import NavigationItem from './../NavigationItem/NavigationItem';
import Aux from './../../../hoc/Auxil/Auxil';
// import { loginStatus } from "./../../LoginStatus";
import UserContext from './../../../hoc/Context/UserContext';
import classes from './NavigationItems.css';
// import NavDropdown from "react-bootstrap/NavDropdown";
// import Nav from "react-bootstrap/Nav";
import Button from './../../UI/Button/Button';

// import { AiOutlineHome } from "react-icons/ai";
const NavigationItems = (props) => {
  const value = useContext(UserContext);
  // const Profile = (
  //   // <Nav>
  //   //   <NavDropdown title="Authentication">
  //   //     <NavDropdown.Item href="/users/login">Login</NavDropdown.Item>
  //   //     <NavDropdown.Item href="/users/signup">SignUp</NavDropdown.Item>
  //   //     <NavDropdown.Divider />
  //   //     <NavDropdown.Item href="/users/guestSession">
  //   //       Continue <br /> as Guest
  //   //     </NavDropdown.Item>
  //   //   </NavDropdown>
  //   // </Nav>

  // );
  return (
    <Aux>
      {!value.isLoggedin ? (
        <ul className={classes.NavigationItems}>
          {/* <p>
            <AiOutlineHome color="white" size="13px" /> */}
          {/* <h1 className={classes.Header}>POSTBOX</h1> */}
          <NavigationItem link="/" active icon="home">
            Home
          </NavigationItem>
          {/* </p> */}
          <NavigationItem link="/login">Sign in</NavigationItem>
          <NavigationItem link="/signup">Sign up</NavigationItem>
          <NavigationItem link="/new-post">Create</NavigationItem>
        </ul>
      ) : (
        <ul className={classes.NavigationItems}>
          {/* <h1 className={classes.Header}>POSTBOX</h1> */}
          <NavigationItem link="/" active>
            Home
          </NavigationItem>
          <NavigationItem link="/profile">
            {value.user.name.charAt(0).toUpperCase() + value.user.name.slice(1)}
          </NavigationItem>
          <NavigationItem link="/new-post">Create</NavigationItem>
          {/* {Profile} */}

          <Button clicked={props.logout} btnType="logout">
            Logout
          </Button>
        </ul>
      )}
    </Aux>
  );
};

export default NavigationItems;
