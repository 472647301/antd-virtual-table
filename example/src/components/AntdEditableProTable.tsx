import { VirtualEditableProTable } from "@byron-react/antd-virtual-table";
import { createColumns, tableSize } from "../utils";
import { useEffect, useState } from "react";
import { VirtualEditableProTableProps } from "@byron-react/antd-virtual-table";

interface ItemT {
  id: number;
}

const columns: VirtualEditableProTableProps<ItemT, {}, "text">["columns"] =
  createColumns();

const data = Array.from({ length: 100000 }, (_, key) => {
  return Object.assign(
    { id: key },
    Object.fromEntries(columns.map((e) => [e.dataIndex, key]))
  );
});

const AntdEditableProTable: React.FC = () => {
  const [windowSize, setWindowSize] = useState(tableSize(50, 270));
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState(data);

  useEffect(() => {
    function updateSize() {
      setWindowSize(tableSize(50, 270));
    }
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const option: VirtualEditableProTableProps<ItemT, {}, "text">["columns"] = [
    {
      title: "操作",
      valueType: "option",
      width: 200,
      fixed: "right",
      render: (_text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <VirtualEditableProTable
      columns={columns.concat(option)}
      value={dataSource}
      rowKey={"id"}
      search={{}}
      scroll={{ x: windowSize[0], y: windowSize[1] }}
      editable={{ type: "multiple" }}
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
