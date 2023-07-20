import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function getAllUsers(cb) {
  try {
    const res = await fetch("http://localhost:3031/users");
    const data = await res.json();
    cb(null, data);
  } catch (err) {
    cb(err, null);
  }
}

export async function getUserById(id, cb) {
  try {
    const res = await fetch(`http://localhost:3031/users/${id}`);
    const data = await res.json();
    cb(null, data);
  } catch (err) {
    cb(err, null);
  }
}

export async function signUpUser(user, cb) {
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

    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

export async function loginUser({ email, password }, cb) {
  try {
    getAllUsers((err, users) => {
      const loginUser = users.find((user) => user?.email === email);

      if (!loginUser) throw new Error("No user found");
      //   Compare Password
      const isCorrectPassword = bcrypt.compareSync(
        password,
        loginUser?.password
      );
      if (loginUser && !isCorrectPassword)
        throw new Error("Incorrect password");

      cb(null, loginUser);
    });
  } catch (err) {
    cb(err, null);
  }
}
