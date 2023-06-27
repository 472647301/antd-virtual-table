import { VirtualTable } from "./src";
import type { VirtualTableProps } from "@byron-react/antd-virtual-table";
import { createColumns, tableSize } from "../utils";
import { useEffect, useState } from "react";

interface ItemT {}

const columns: VirtualTableProps<ItemT>["columns"] = createColumns();

const data = Array.from({ length: 100000 }, (_, key) => {
  return Object.assign(
    { id: key },
    Object.fromEntries(columns.map((e) => [e.dataIndex, key]))
  );
});

const AntdTable: React.FC = () => {
  const [windowSize, setWindowSize] = useState(tableSize(0, 20));

  useEffect(() => {
    function updateSize() {
      setWindowSize(tableSize(0, 20));
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
      style={{ marginTop: 20 }}
      rowSelection={{}}
      bordered
      rowKey={"id"}
    />
  );
};

export default AntdTable;
