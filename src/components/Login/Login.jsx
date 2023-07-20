import { useEffect, useState } from "react";
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
import bcrypt from "bcryptjs";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [isEmail, setIsEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  useEffect(() => {
    fetch("http://localhost:3031/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const verifyUser = (email, password) => {
    return users.find(
      (user) =>
        user.email === email && bcrypt.compareSync(password, user.password)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingUser = verifyUser(email, password);
    if (!existingUser) {
      setIsError(true);
      setError("Invalid Credentials");
    } else {
      localStorage.setItem("user", JSON.stringify(existingUser));
      setUser(existingUser);
      redirect("/tickets");
    }

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
