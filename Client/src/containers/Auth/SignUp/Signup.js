import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from 'axios';
import Input from './../../../components/UI/Input/Input';
import { Link } from 'react-router-dom';
import classes from './../Login/Login.css';
import UserContext from './../../../hoc/Context/UserContext';
import Modal from './../../../components/UI/Modal/Modal';
import { FaUserLock } from 'react-icons/fa';
class Signup extends Component {
  state = {
    LoginForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'name',
          placeholder: 'Your name',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        name: 'name',
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        name: 'email',
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Your password (min 8 characters)',
        },
        value: '',
        validation: {
          minLength: 8,
          required: true,
        },
        valid: false,
        touched: false,
        name: 'password',
      },
      passwordConfirm: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'confirm password',
        },
        value: '',
        validation: {
          minLength: 8,
          required: true,
        },
        valid: false,
        touched: false,
        name: 'confirm password',
      },
    },
    errorMessage: '',
    sendSignupToken: false,
    isLoggedin: false,
    isLoading: false,
  };
  static contextType = UserContext;
  componentDidMount() {
    this.setState({ isLoggedin: this.context.isLoggedin });
  }

  SignupUserHandler = (event) => {
    event.preventDefault();
    let error = false;
    for (let input in this.state.LoginForm) {
      if (this.state.LoginForm[input].valid === false) {
        error = true;
        this.setState({
          errorMessage: `please enter valid ${this.state.LoginForm[input].name}`,
        });
        break;
      }
    }
    if (!error) {
      if (
        this.state.LoginForm.password.value !==
        this.state.LoginForm.passwordConfirm.value
      ) {
        this.setState({ errorMessage: 'password does not match' });
        error = true;
      }
    }
    if (!error) {
      const user = {
        name: this.state.LoginForm.name.value,
        email: this.state.LoginForm.email.value,
        password: this.state.LoginForm.password.value,
        passwordConfirm: this.state.LoginForm.passwordConfirm.value,
      };
      console.log(user);
      // this.setState({ isLoading: true });
      axios
        .post('http://localhost:7000/api/v1/users/signup', user, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
          this.setState({
            isLoggedin: true,
            isLoading: false,
            sendSignupToken: true,
          });
        })
        .catch((error) => {
          this.setState({
            errorMessage: 'email id is invalid or already used',
            isLoading: false,
          });
        });
    }
  };
  checkValidity(value, rules) {
    let isValid = false;
    if (rules.required) {
      isValid = value.trim() !== '';
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
    this.props.history.push('/');
    window.location.reload(false);
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
          <FaUserLock color="green" size="70px" />
          <h2>Signup</h2>
          <p style={{ color: 'red' }}>
            {this.state.errorMessage ? '*' + this.state.errorMessage : null}
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

          <div className={classes.Button}>
            <Button btnType="Authenticate" clicked={this.SignupUserHandler}>
              Signup
            </Button>
          </div>
          <span className={classes.left}>
            <p className={classes.link}>
              <Link to="/login">Already a member? Sign in</Link>
            </p>
            <p className={classes.link}>
              <Link to="/verifyEmail">Already have a signup token ?</Link>
            </p>
          </span>
        </div>
      </div>
    );
    const signupMessage = (
      <div>
        <h1>Postbox</h1>
        <h3>Welcome to postbox</h3>
        <p>We have sent a confirmation email to your email id</p>
        <p className={classes.link}>
          <Link to="/verifyEmail">Verify Email</Link>
        </p>
      </div>
    );
    return (
      <div>
        {!this.state.isLoading ? (
          this.state.sendSignupToken ? (
            <Modal show={this.state.sendSignupToken}>{signupMessage}</Modal>
          ) : (
            form
          )
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

export default Signup;
