import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext({
  user: "",
  setUser: () => null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ email: "", password: "" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
