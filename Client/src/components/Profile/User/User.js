import React, { useContext } from 'react';
import classes from './User.css';
import UserContext from './../../../hoc/Context/UserContext';
import Aux from './../../../hoc/Auxil/Auxil';

import { FaUserAlt } from 'react-icons/fa';
import NavigationItem from './../../Navigation/NavigationItem/NavigationItem';
const User = (props) => {
  const value = useContext(UserContext);
  console.log(value.user);
  return (
    <Aux>
      <div className={classes.User}>
        <div className={classes.wrapper}>
          <div className={classes.left}>
            <FaUserAlt color="rgb(26, 26, 230)" size="70px" />
            <h1 style={{ textTransform: 'capitalize' }}>{value.user.name}</h1>
          </div>
          <div className={classes.right}>
            <div className={classes.info}>
              <h3>Profile</h3>
              <div className={classes.info_data}>
                <div className={classes.data}>
                  <h4>Email</h4>
                  <p>{value.user.email}</p>
                </div>
                {/* <div className={classes.data}>
                  <h4>Total Posts</h4>
                  <p>{value.user.posts}</p>
                </div> */}
                <div className={classes.data}>
                  <h4>Role</h4>
                  <p>{value.user.role}</p>
                </div>
              </div>
            </div>

            <div className={classes.projects}>
              <h3>Links</h3>
              <div className={classes.projects_data}>
                <div className={classes.data}>
                  <h4 style={{ textTransform: 'capitalize', padding: '8px' }}>
                    {value.user.name ? value.user.name + "'s " : null}posts{' '}
                  </h4>

                  <NavigationItem link="/my-posts" classProperty="my-posts">
                    My Posts
                  </NavigationItem>
                </div>
                <div className={classes.data}>
                  <h4 style={{ padding: '8px' }}>Change Password </h4>

                  <NavigationItem
                    link="/changePassword"
                    classProperty="my-posts"
                  >
                    changePassword
                  </NavigationItem>
                </div>
                {/* <div className={classes.data}>
                  <h4>Most Viewed</h4>
                  <p>dolor sit amet.</p>
                </div> */}
              </div>
            </div>

            {/* <div className="social_media">
            <ul>
              <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
              <li><a href="#"><i class="fab fa-twitter"></i></a></li>
              <li><a href="#"><i class="fab fa-instagram"></i></a></li>
          </ul>
      </div> */}
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default User;
