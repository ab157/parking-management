import "./App.scss";
import { Outlet, useNavigate } from "react-router-dom";
import { Header, HeaderName } from "@carbon/react";
import { useEffect } from "react";
import { useAuthContext } from "./context/AuthContext";

const App = () => {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) {
      navigate("/login");
    } else {
      navigate("/tickets");
    }
  }, [user, navigate]);

  return (
    <>
      <Header className="header" aria-label="Header">
        <HeaderName className="header_name" prefix={null}>
          Parking Management
        </HeaderName>

        {user?.email && (
          <div className="header_actions">
            <p>
              {user?.first_name} {user?.last_name} ({user?.role})
            </p>
            <span>|</span>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                setUser("");
              }}
            >
              Logout
            </button>
          </div>
        )}
      </Header>
      <main className="main">
        <Outlet />
      </main>
    </>
  );
};

export default App;
