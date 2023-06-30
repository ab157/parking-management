import { useState } from "react";
import { TextInput, Button } from "@carbon/react";
import { Form } from "react-router-dom";
import "./Signup.scss";
import validator from "validator";

const SignupForm = () => {
  const [email, setEmail] = useState(null);
  const [isEmail, setIsEmail] = useState(true);
  const [password, setPassword] = useState(null);
  const [isPassword, setIsPassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [isConfirmPassword, setIsConfirmPassword] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form className="signup-form" onSubmit={handleSubmit}>
      <TextInput
        id="email"
        labelText="Enter Email"
        placeholder="Enter your email id"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setIsEmail(validator.isEmail(e.target.value));
        }}
        invalid={!isEmail}
        invalidText={!isEmail && "The email you entered is invalid"}
      />
      {/* Password */}
      <TextInput.PasswordInput
        id="password"
        labelText="Enter Password"
        placeholder="enter password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setIsPassword(validator.isStrongPassword(e.target.value));
        }}
        invalid={!isPassword}
        invalidText={!isPassword && "The password you entered is invalid"}
      />
      {/* Confirm Password */}
      <TextInput.PasswordInput
        id="confirmPassword"
        labelText="Confirm Password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setIsConfirmPassword(password === e.target.value);
        }}
        invalid={!isConfirmPassword}
        invalidText={
          !isConfirmPassword && "The password you entered does not match"
        }
      />
      <div className="button-group">
        <Button
          as="a"
          href="/dashboard"
          kind="secondary"
          disabled={!email || !password || !confirmPassword}
        >
          SignUp
        </Button>
      </div>
    </Form>
  );
};

export default SignupForm;
