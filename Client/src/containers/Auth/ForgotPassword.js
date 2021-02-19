import React, { Component } from "react";
import Aux from "./../../hoc/Auxil/Auxil";
import Spinner from "../../components/UI/Spinner/Spinner";
import axios from "axios";
import classes from "./Login/Login.css";
import UserContext from "./../../hoc/Context/UserContext";
// import { Link } from "react-router-dom";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
// import NavigationItem from "../../components/Navigation/NavigationItem/NavigationItem";
import ResetPassword from "./ResetPassword";
class ForgotPassword extends Component {
  state = {
    LoginForm: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your Email",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
    },
    isLoading: false,
    isLoggedin: false,
    resetTokenSent: false,
  };
  static contextType = UserContext;
  ///
  //if a user is logged in we have to get the status from the backend//

  // checkIsLoggedIn = () => {
  //   this.setState({ isLoading: true });
  //   axios
  //     .get("http://localhost:7000/api/v1/users/loginStatus", {
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //       this.setState({ isLoggedin: true, isLoading: false });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       this.setState({ isLoading: false });
  //     });
  // };
  componentDidMount() {
    this.setState({ isLoggedin: this.context.isLoggedin });
  }

  resetTokenSent = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const user = {
      email: this.state.LoginForm.email.value,
    };
    console.log(user);

    axios
      .post("http://localhost:7000/api/v1/users/forgotPassword", user, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        this.setState({ resetTokenSent: true, isLoading: false });
        // this.props.history.push("/");
        // window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkValidity(value, rules) {
    let isValid = false;
    if (rules.required) {
      isValid = value.trim() !== "";
    }
    if (rules.minLength && isValid) {
      isValid = value.length >= rules.minLength;
    }
    if (rules.maxLength && isValid) {
      isValid = value.length <= rules.maxLength;
    }
    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.LoginForm,
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    // console.log(updatedFormElement);
    this.setState({ LoginForm: updatedOrderForm, touched: true });
  };
  render() {
    const formElementsArray = [];

    for (let key in this.state.LoginForm) {
      formElementsArray.push({
        id: key,
        config: this.state.LoginForm[key],
      });
    }
    let form = (
      <div className={classes.Login}>
        <div className={classes.Form}>
          <h1>Forgot Password</h1>
          <p>
            No Problem! We will send you an instruction email to reset your
            password.
          </p>
          {formElementsArray.map((formElement) => (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              inValid={!formElement.config.valid}
              touched={formElement.config.touched}
              changedValue={(event) =>
                this.inputChangedHandler(event, formElement.id)
              }
            />
          ))}
          <br></br>
          <div className={classes.Button}>
            <Button btnType="Authenticate" clicked={this.resetTokenSent}>
              Send Email
            </Button>
          </div>
        </div>
      </div>
    );

    return (
      <Aux>
        {!this.state.isLoading ? (
          this.state.resetTokenSent ? (
            <ResetPassword email={this.state.LoginForm.email.value} />
          ) : (
            form
          )
        ) : (
          <Spinner />
        )}
      </Aux>
    );
  }
}

export default ForgotPassword;
