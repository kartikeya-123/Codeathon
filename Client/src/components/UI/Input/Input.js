import React from "react";
import classes from "./Input.css";

import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const input = (props) => {
  let validationError;
  let inputElement = null;
  const inputClasses = [classes.InputElement];

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //   if (props.inValid && props.touched) {
  //     inputClasses.push(classes.Invalid);
  //     validationError = <p>please enter a valid value</p>;
  //   }
  switch (props.elementType) {
    case "input":
      if (props.elementConfig.type === "password") {
        inputElement = (
          <OutlinedInput
            fullWidth
            placeholder={props.elementConfig.placeholder}
            type={showPassword ? "text" : "password"}
            onChange={props.changedValue}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        );
      } else {
        inputElement = (
          <OutlinedInput
            fullWidth
            {...props.elementConfig}
            onChange={props.changedValue}
          />
        );
      }
      break;

    case "textarea":
      inputElement = (
        <textarea
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          onChange={props.changedValue}
        />
      );
      break;

    case "select":
      inputElement = (
        <select
          className={inputClasses.join(" ")}
          onChange={props.changedValue}
        >
          {props.elementConfig.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          onChange={props.changedValue}
        />
      );
  }
  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
      {validationError}
    </div>
  );
};

export default input;
