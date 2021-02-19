import React from 'react';
import classes from './Toolbar.css';
import NavigationItems from './../../Navigation/NavigationItems/NavigationItems';
import Logo from './../../../components/Logo/Logo';
import DrawerToggle from './../../Navigation/SideDrawer/DrawerToggle/DrawerToggle';
const toolbar = (props) => (
  <header className={classes.toolbar}>
    <h2 className={classes.header}>POSTBOX</h2>
    <Logo />
    <DrawerToggle clicked={props.clicked} />
    <nav className={classes.DesktopOnly}>
      <NavigationItems logout={props.logout} />
    </nav>
  </header>
);

export default toolbar;
