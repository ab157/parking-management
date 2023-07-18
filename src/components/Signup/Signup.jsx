import { useState, useEffect } from "react";
import validator from "validator";
import { Form, redirect, useNavigate } from "react-router-dom";
import {
  TextInput,
  Button,
  InlineNotification,
  Dropdown,
  PasswordInput,
} from "@carbon/react";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import "./Signup.scss";

const SignupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isEmail, setIsEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [isPassword, setIsPassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPassword, setIsConfirmPassword] = useState(true);
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isCreated, setIsCreated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3031/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleSignUp = (e) => {
    e.preventDefault();
    let newUser;
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      setError("User already exists");
    } else {
      newUser = {
        id: uuidv4(),
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashPassword(password, 10),
        role,
      };
      // Create new user in backend
      createUser(newUser);
      // Save in localstorage
      localStorage.setItem("user", JSON.stringify(newUser));
      // Creation Successful
      setIsCreated(true);
      // Navigate
      setTimeout(() => {
        setIsCreated(false);
        redirect("/login");
      }, 2000);
    }
  };

  function hashPassword(password, rounds) {
    const hashedPassword = bcrypt.hashSync(password, rounds);
    return hashedPassword;
  }

  async function createUser(user) {
    try {
      await fetch("http://localhost:3031/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Form className="signup-form" onSubmit={handleSignUp}>
      {error && (
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          lowContrast={true}
          onCloseButtonClick={() => setError("")}
        />
      )}
      {isCreated && (
        <InlineNotification
          kind="success"
          title="Success"
          subtitle={"Signup Successful"}
          lowContrast={true}
          onCloseButtonClick={() => setIsCreated(false)}
        />
      )}
      {/* Name */}
      <div className="form-group">
        <TextInput
          id="first_name"
          labelText="Enter First Name"
          placeholder="Enter full Name"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
        <TextInput
          id="last_name"
          labelText="Enter Last Name"
          placeholder="Enter full Name"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        />
      </div>
      {/* Email */}
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
      <PasswordInput
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
      <PasswordInput
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
      <Dropdown
        id="roles"
        items={["USER", "ADMIN"]}
        titleText="Select a role"
        label="Select a role"
        onChange={(data) => setRole(data.selectedItem)}
        value={role}
      />
      <div className="button-group">
        <Button
          type="submit"
          kind="primary"
          disabled={
            !email ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword
          }
        >
          SignUp
        </Button>
        <Button
          type="button"
          kind="secondary"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </div>
    </Form>
  );
};

export default SignupForm;
