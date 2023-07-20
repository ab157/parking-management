import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// Get all users
export async function getAllUsers(cb) {
  try {
    const res = await fetch("http://localhost:3031/users");
    const data = await res.json();
    cb(null, data);
  } catch (err) {
    cb(err, null);
  }
}

// Get user by ID
export async function getUserById(id, cb) {
  try {
    const res = await fetch(`http://localhost:3031/users/${id}`);
    const data = await res.json();
    cb(null, data);
  } catch (err) {
    cb(err, null);
  }
}

// Get user by Email
export async function getUserByEmail(email, cb) {
  try {
    const res = await fetch(`http://localhost:3031/users`);
    const data = await res.json();
    const user = await data.find((user) => user.email === email);
    if (!user) throw new Error("No user found, Incorrect email");
    cb(null, user);
  } catch (err) {
    if (err) {
      cb(err, null);
    }
  }
}

// Signup User
export async function signUpUser(user, cb) {
  // Add ID and encrypt password in user
  const newUser = {
    id: uuidv4(),
    ...user,
    password: bcrypt.hashSync(user.password, 10),
  };

  try {
    const res = await fetch("http://localhost:3031/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!res.ok) throw new Error("Signup failed, please try again");

    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

// Login User
export async function loginUser({ email, password }, cb) {
  try {
    const res = await fetch(`http://localhost:3031/users`);
    const data = await res.json();
    // Check if user exists
    const user = await data.find((user) => user.email === email);
    // Throw error if doesnt
    if (!user) throw new Error("Invalid Credentials");
    // Check if password match
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    // If not throw error
    if (!isCorrectPassword) throw new Error("Invalid Credentials");
    cb(null, user);
  } catch (err) {
    cb(err, null);
  }
}
