import React, { Component } from 'react';
import Aux from './../../hoc/Auxil/Auxil';
import classes from './Layout.css';
import Toolbar from './../UI/Toolbar/Toolbar';
import Posts from './../../containers/Posts/Posts';
import NewPost from './../../containers/NewPost/NewPost';
import Login from '../../containers/Auth/Login/Login';
import Signup from '../../containers/Auth/SignUp/Signup';
import ForgotPassword from '../../containers/Auth/ForgotPassword';
import ChangePassword from '../../containers/Auth/ChangePassword';
import VerifyEmail from '../../containers/Auth/VerifyEmail';
import { Route, Switch, withRouter } from 'react-router-dom';
import User from './../Profile/User/User';
import MyPosts from './../Profile/MyPosts/MyPosts';
import EditPost from './../Profile/MyPosts/EditPost';
import axios from 'axios';
import UserContext, { UserProvider } from './../../hoc/Context/UserContext';
import Sidedrawer from './../Navigation/SideDrawer/SideDrawer';
class Layout extends Component {
  state = {
    isLoggedin: false,
    userRole: '',
    user: [],
    showSideDrawer: false,
  };
  static contextType = UserContext;
  checkIsLoggedIn = () => {
    axios
      .get('http://localhost:7000/api/v1/users/loginStatus', {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        this.setState({
          isLoggedin: true,
          userRole: response.data.user.role,
          user: response.data.user,
        });
      })
      .catch((err) => {
        this.setState({ isLoggedin: false });
      });
  };
  logoutUserHandler = (props) => {
    axios
      .get('http://localhost:7000/api/v1/users/logout', {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data);
        // this.setState({ isLoggedin: false });

        this.props.history.push('/login');
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };
  componentDidMount() {
    // console.log("checking status");
    this.checkIsLoggedIn();
  }
  // s
  showSideDrawer = () => {
    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  render() {
    return (
      <UserProvider
        value={{
          isLoggedin: this.state.isLoggedin,
          role: this.state.userRole,
          user: this.state.user,
        }}
      >
        <Aux>
          <Toolbar
            clicked={this.showSideDrawer}
            logout={this.logoutUserHandler}
          />
          {/* <article className={classes.Welcome}>WELCOME TO POSTBOX</article> */}
          <Sidedrawer
            open={this.state.showSideDrawer}
            closed={this.sideDrawerClosedHandler}
            logout={this.logoutUserHandler}
          />
          <div className={classes.Body}>
            <Switch>
              <Route path="/" exact component={Posts} />
              <Route path="/signup" exact component={Signup} />
              <Route path="/login" exact component={Login} />
              <Route path="/new-post" exact component={NewPost} />
              <Route path="/my-posts" exact component={MyPosts} />
              <Route path="/edit/:id" exact component={EditPost} />
              <Route path="/forgotPassword" exact component={ForgotPassword} />
              <Route path="/changePassword" exact component={ChangePassword} />
              <Route path="/verifyEmail" exact component={VerifyEmail} />
              <Route path="/profile" exact component={User} />
              <Route render={() => <h1>PAGE NOT FOUND</h1>} />
            </Switch>
          </div>
        </Aux>
      </UserProvider>
    );
  }
}

export default withRouter(Layout);
