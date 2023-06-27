import { VirtualProTable } from "./src";
import { createColumns, tableSize } from "../utils";
import { useEffect, useState } from "react";

const columns = createColumns();

const data = Array.from({ length: 100000 }, (_, key) => {
  return Object.assign(
    { id: key },
    Object.fromEntries(columns.map((e) => [e.dataIndex, key]))
  );
});

const AntdProTable: React.FC = () => {
  const [windowSize, setWindowSize] = useState(tableSize(50, 170));
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    function updateSize() {
      setWindowSize(tableSize(50, 170));
    }
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <VirtualProTable
      columns={columns}
      dataSource={data}
      scroll={{ x: windowSize[0], y: windowSize[1] }}
      rowSelection={{
        selectedRowKeys,
        onChange(selectedRowKeys, selectedRows, info) {
          setSelectedRowKeys(selectedRowKeys);
          console.log("---", selectedRowKeys, selectedRows, info);
        },
        fixed: "left",
      }}
      columnsState={{
        onChange(map) {
          console.log(map);
        },
      }}
      pagination={false}
      bordered
      rowKey={"id"}
    />
  );
};

export default AntdProTable;
