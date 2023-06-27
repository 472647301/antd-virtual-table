import { VirtualProTable } from "@byron-react/antd-virtual-table";
import { createColumns, tableSize } from "../utils";
import { useEffect, useState, useMemo } from "react";
import { useAntdResizableHeader } from "@minko-fe/use-antd-resizable-header";
import "@minko-fe/use-antd-resizable-header/index.css";

const columns = createColumns();

const data = Array.from({ length: 100000 }, (_, key) => {
  return Object.assign(
    { id: key },
    Object.fromEntries(columns.map((e) => [e.dataIndex, key]))
  );
});

const AntdResizableTable: React.FC = () => {
  const [windowSize, setWindowSize] = useState(tableSize(50, 220));
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    function updateSize() {
      setWindowSize(tableSize(50, 220));
    }
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const { components, resizableColumns } = useAntdResizableHeader({
    columns: useMemo(() => columns, []),
    // 保存拖拽宽度至本地localStorage
    columnsState: {
      persistenceKey: "localKey",
      persistenceType: "localStorage",
    },
  });

  return (
    <VirtualProTable
      components={components}
      columns={resizableColumns}
      dataSource={data}
      scroll={{ x: windowSize[0], y: windowSize[1] }}
      columnsState={{
        persistenceKey: "localKey",
        persistenceType: "localStorage",
      }}
      rowSelection={{
        selectedRowKeys,
        onChange(selectedRowKeys, selectedRows, info) {
          setSelectedRowKeys(selectedRowKeys);
          console.log("---", selectedRowKeys, selectedRows, info);
        },
        fixed: "left",
      }}
      pagination={false}
      bordered
      rowKey={"id"}
    />
  );
};

export default AntdResizableTable;
