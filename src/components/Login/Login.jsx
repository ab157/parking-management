import { useState } from "react";
import {
  TextInput,
  Button,
  InlineNotification,
  PasswordInput,
} from "@carbon/react";
import { Form, useNavigate, redirect } from "react-router-dom";
import validator from "validator";
import { useAuthContext } from "../../context/AuthContext";
import "./Login.scss";
import { loginUser } from "../../utils/users";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [isEmail, setIsEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({ email, password }, (err, user) => {
      if (err) {
        setIsError(true);
        setError(err?.message);
        return;
      }
      // If no error in login, then proceed
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setTimeout(() => {
        redirect("/tickets");
      }, 1500);
    });

    setEmail("");
    setPassword("");
  };

  return (
    <>
      <Form className="login-form" onSubmit={handleSubmit}>
        {isError && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            lowContrast={true}
            onCloseButtonClick={() => {
              setError("");
              setIsError(false);
            }}
          />
        )}
        <TextInput
          id="email"
          labelText="Enter Email :"
          placeholder="enter your email id"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsEmail(validator.isEmail(e.target.value));
          }}
          invalid={!isEmail}
          invalidText={!isEmail && "The email you entered is invalid"}
        />

        <PasswordInput
          id="password"
          labelText="Enter password :"
          placeholder="enter password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <div className="button-group">
          <Button type="submit" kind="primary" disabled={!email || !password}>
            LogIn
          </Button>

          <Button onClick={() => navigate("/signup")} kind="secondary">
            SignUp
          </Button>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
