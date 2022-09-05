import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";

import AuthContext from "../../store/auth-context";

import Card from "../UI/Card/Card";
import Button from "../UI/Button/Button";
import Input from "../UI/input/Input";

import classes from "./Login.module.css";

const emailReducer = (state, action) => {
  if (action.type === "EMAIL_CHANGE") {
    return {
      value: action.value,
      isValid: action.value.includes("@"),
    };
  }
  if (action.type === "EMAIL_BLUR") {
    return {
      value: state.value,
      isValid: state.value.includes("@"),
    };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "PASSWORD_CHANGE") {
    return {
      value: action.value,
      isValid: action.value.trim().length > 6,
    };
  }
  if (action.type === "PASSWORD_BLUR") {
    return {
      value: state.value,
      isValid: state.value.trim().length > 6,
    };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // // running Everytime the component is rendered
  // useEffect(() => {
  //   console.log("RUNNING");
  // });
  // // running first time the component is rendered only
  // useEffect(() => {
  //   console.log("RUNNING");
  // }, []);
  // // running first time the component is rendered with cleanup
  // useEffect(() => {
  //   console.log("RUNNING");
  //   // when the cmponent is unmounted or removed
  //   return () => {
  //     console.log("CLEANUP");
  //   };
  // }, []);

  const { isValid: isValidEmail } = emailState;
  const { isValid: isValidPassword } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("checking form validity!");
      setFormIsValid(isValidEmail && isValidPassword);
    }, 500);

    return () => {
      // console.log("cleanup");
      clearTimeout(identifier);
    };
  }, [isValidEmail, isValidPassword]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "EMAIL_CHANGE", value: event.target.value });
    // setEnteredEmail(event.target.value);
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "EMAIL_BLUR" });
    // setEmailIsValid(emailState.value.includes("@"));
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "PASSWORD_CHANGE", value: event.target.value });
    // setEnteredPassword(event.target.value);
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "PASSWORD_BLUR" });
    // setPasswordIsValid(passwordState.value.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value);
    } else if (!isValidEmail) {
      // console.log("Email is not valid!");
      emailInputRef.current.focus();
    } else {
      // console.log("Password is not valid!");
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id="email"
          label="E-Mail"
          type="email"
          isValid={isValidEmail}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordInputRef}
          id="password"
          label="Password"
          type="password"
          isValid={isValidPassword}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
