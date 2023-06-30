import "./App.scss";
import { Outlet } from "react-router-dom";
import { Header, HeaderName } from "@carbon/react";

const App = () => {
  return (
    <>
      <Header className="header">
        <HeaderName className="header_name" prefix={null}>
          Parking Management
        </HeaderName>
      </Header>
      <main className="main">
        <Outlet />
      </main>
    </>
  );
};

export default App;
