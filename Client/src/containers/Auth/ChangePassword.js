import React, { Component } from "react";
import Aux from "./../../hoc/Auxil/Auxil";
import Spinner from "../../components/UI/Spinner/Spinner";
import axios from "axios";
import classes from "./Login/Login.css";
import UserContext from "./../../hoc/Context/UserContext";
import Modal from "./../../components/UI/Modal/Modal";
// import { Link } from "react-router-dom";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
// import NavigationItem from "../../components/Navigation/NavigationItem/NavigationItem";

class ResetPassword extends Component {
  state = {
    LoginForm: {
      oldPassword: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Old Password",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      newPassword: {
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
      newPasswordConfirm: {
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
    showChangedPasswordConfirm: false,
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
  changePasswordHandler = () => {
    const data = {
      passwordCurrent: this.state.LoginForm.oldPassword.value,
      password: this.state.LoginForm.newPassword.value,
      passwordConfirm: this.state.LoginForm.newPasswordConfirm.value,
    };
    axios
      .patch("http://localhost:7000/api/v1/users/updateMyPassword", data, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        this.setState({ showChangedPasswordConfirm: true });
      })
      .catch((err) => console.log(err));
  };
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
    this.props.history.push("/");
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
          <h1>Change Password</h1>
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
            <Button btnType="Authenticate" clicked={this.changePasswordHandler}>
              Change Password
            </Button>
          </div>
        </div>
      </div>
    );

    const passwordChangeMessage = (
      <div>
        <h1>Postbox</h1>
        <h2>Password changed successfully</h2>
        <Button btnType="Success" clicked={this.continue}>
          Continue
        </Button>
      </div>
    );
    return (
      <Aux>
        <Modal show={this.state.showChangedPasswordConfirm}>
          {passwordChangeMessage}
        </Modal>
        {!this.state.isLoading ? form : <Spinner />}
      </Aux>
    );
  }
}

export default ResetPassword;
