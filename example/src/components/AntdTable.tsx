import { VirtualTable } from "@byron-react/antd-virtual-table";
import type { VirtualTableProps } from "@byron-react/antd-virtual-table";
import { createColumns, tableSize } from "../utils";
import { useEffect, useState } from "react";

interface ItemT {}

const columns: VirtualTableProps<ItemT>["columns"] = createColumns();

const data = Array.from({ length: 100000 }, (_, key) => {
  return Object.fromEntries(columns.map((e) => [e.dataIndex, key]));
});

const AntdTable: React.FC = () => {
  const [windowSize, setWindowSize] = useState(tableSize());

  useEffect(() => {
    function updateSize() {
      setWindowSize(tableSize());
    }
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <VirtualTable
      columns={columns}
      dataSource={data}
      scroll={{ x: windowSize[0], y: windowSize[1] }}
      pagination={false}
      bordered
    />
  );
};

export default AntdTable;
