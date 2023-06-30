import { useState } from "react";
import { TextInput, Button } from "@carbon/react";
import { Form } from "react-router-dom";
import "./Login.scss";
import validator from "validator";

const LoginForm = () => {
  const [email, setEmail] = useState(null);
  const [isEmail, setIsEmail] = useState(true);
  const [password, setPassword] = useState(null);
  const [isPassword, setIsPassword] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form className="login-form" onSubmit={handleSubmit}>
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

      <TextInput
        id="password"
        labelText="Enter password :"
        placeholder="enter password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setIsPassword(validator.isStrongPassword(e.target.value));
        }}
        invalid={!isPassword}
        invalidText={!isPassword && "The password you entered is invalid"}
      />

      <div className="button-group">
        <Button
          href="/dashboard"
          type="submit"
          kind="primary"
          disabled={!email || !password}
          as="a"
        >
          LogIn
        </Button>

        <Button as="a" href="/signup" kind="secondary">
          SignUp
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
