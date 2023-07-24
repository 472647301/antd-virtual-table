import React from "react";
import { Menu } from "antd";

import "./components/src/style/index.css";
import AntdTable from "./components/AntdTable";
import AntdProTable from "./components/AntdProTable";
import AntdResizableTable from "./components/AntdResizableTable";
import AntdEditableProTable from "./components/AntdEditableProTable";
import { useRoutes, Navigate, useNavigate } from "react-router-dom";
import { HashRouter, useLocation } from "react-router-dom";

const routes = [
  {
    path: "",
    element: <Navigate to={"AntdTable"} replace />,
  },
  {
    path: "AntdTable",
    element: <AntdTable />,
  },
  {
    path: "AntdProTable",
    element: <AntdProTable />,
  },
  {
    path: "AntdResizableTable",
    element: <AntdResizableTable />,
  },
  {
    path: "AntdEditableProTable",
    element: <AntdEditableProTable />,
  },
];

const items = routes
  .filter((e) => !!e.path)
  .map((e) => ({ key: e.path, label: e.path }));

const Router: React.FC = () => {
  return useRoutes(routes);
};

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <Menu
      items={items}
      mode="horizontal"
      onClick={(e) => navigate(e.key)}
      selectedKeys={[pathname.replaceAll("/", "")]}
    />
  );
};

const App: React.FC = () => {
  return (
    <>
      <HashRouter>
        <Header />
        <Router />
      </HashRouter>
    </>
  );
};

export default App;
