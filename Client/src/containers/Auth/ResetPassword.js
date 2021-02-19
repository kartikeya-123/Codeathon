import React, { Component } from "react";
import Aux from "./../../hoc/Auxil/Auxil";
import Spinner from "../../components/UI/Spinner/Spinner";
import Modal from "../../components/UI/Modal/Modal";
import axios from "axios";
import classes from "./Login/Login.css";
import UserContext from "./../../hoc/Context/UserContext";
import { withRouter } from "react-router-dom";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
// import NavigationItem from "../../components/Navigation/NavigationItem/NavigationItem";

class ResetPassword extends Component {
  state = {
    LoginForm: {
      token: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Reset link token",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "New Password",
        },
        value: "",
        validation: {
          required: true,
          minLength: 8,
        },
        valid: false,
        touched: false,
      },
      passwordConfirm: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Confirm your password",
        },
        value: "",
        validation: {
          required: true,
          minLength: 8,
        },
        valid: false,
        touched: false,
      },
    },
    isLoading: false,
    isLoggedin: false,
    resetTokenSent: false,
    showResetPasswordMessage: false,
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

  SendTokenHandler = (event) => {
    event.preventDefault();
    const user = {
      password: this.state.LoginForm.password.value,
      passwordConfirm: this.state.LoginForm.passwordConfirm.value,
    };
    console.log(user);

    axios
      .patch(
        `http://localhost:7000/api/v1/users/resetPassword/${this.state.LoginForm.token.value}`,
        user,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        this.setState({
          reset: true,
          isLoading: false,
          showResetPasswordMessage: true,
        });

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
  continue = () => {
    this.props.history.push("/login");
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
          <h1>Reset Password</h1>
          {/* <p>
            No Problem! We will send you an instruction email to reset your
            password.
          </p> */}
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
            <Button btnType="Authenticate" clicked={this.SendTokenHandler}>
              Change Password
            </Button>
          </div>
        </div>
      </div>
    );
    const resetPasswordSuccessful = (
      <div>
        <h1>Postbox</h1>
        <h3>Your Password has been successfully resetted</h3>
        <Button btnType="Danger" clicked={this.continue}>
          Continue
        </Button>
      </div>
    );

    return (
      <Aux>
        {!this.state.isLoading ? (
          !this.state.showResetPasswordMessage ? (
            form
          ) : (
            <Modal show={this.state.showResetPasswordMessage}>
              {resetPasswordSuccessful}
            </Modal>
          )
        ) : (
          <Spinner />
        )}
      </Aux>
    );
  }
}

export default withRouter(ResetPassword);
