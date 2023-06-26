import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

import "./components/src/style/index.css";
import AntdTable from "./components/AntdTable";
import SelectedTable from "./components/SelectedTable";
import AntdProTable from "./components/AntdProTable";
import AntdResizableTable from "./components/AntdResizableTable";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: `Antd Table`,
    children: <AntdTable />,
  },
  {
    key: "2",
    label: `Antd Selected Table`,
    children: <SelectedTable />,
  },
  {
    key: "3",
    label: `Antd Pro Table`,
    children: <AntdProTable />,
  },
  {
    key: "4",
    label: `Antd Resizable Table`,
    children: <AntdResizableTable />,
  },
];

const App: React.FC = () => <Tabs defaultActiveKey="1" items={items} />;

export default App;
