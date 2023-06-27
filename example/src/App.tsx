import React from "react";
import { Menu } from "antd";

import "@byron-react/antd-virtual-table/es/style/index.css";
import AntdTable from "./components/AntdTable";
import SelectedTable from "./components/SelectedTable";
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
    path: "SelectedTable",
    element: <SelectedTable />,
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
