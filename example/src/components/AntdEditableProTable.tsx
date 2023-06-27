import { VirtualEditableProTable } from "./src";
import { createColumns, tableSize } from "../utils";
import { useEffect, useState } from "react";

const columns = createColumns();

const data = Array.from({ length: 100000 }, (_, key) => {
  return Object.assign(
    { id: key },
    Object.fromEntries(columns.map((e) => [e.dataIndex, key]))
  );
});

const AntdEditableProTable: React.FC = () => {
  const [windowSize, setWindowSize] = useState(tableSize(50, 210));
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    function updateSize() {
      setWindowSize(tableSize(50, 210));
    }
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <VirtualEditableProTable
      columns={columns.map((c) => {
        return { ...c, shouldCellUpdate: () => false };
      })}
      value={data}
      rowKey={"id"}
      search={{}}
      scroll={{ x: windowSize[0], y: windowSize[1] }}
      editable={{ type: "multiple", editableKeys: selectedRowKeys }}
      recordCreatorProps={{ record: () => ({}) }}
      rowSelection={{
        selectedRowKeys,
        onChange(selectedRowKeys, selectedRows, info) {
          setSelectedRowKeys(selectedRowKeys);
          console.log("---", selectedRowKeys, selectedRows, info);
        },
        fixed: "left",
      }}
      onValuesChange={(values, record) => console.log(values, record)}
      pagination={false}
      bordered
    />
  );
};

export default AntdEditableProTable;
