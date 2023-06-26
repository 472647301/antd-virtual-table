import { VirtualTable } from "@byron-react/antd-virtual-table";
import { VirtualTableProps } from "@byron-react/antd-virtual-table";
import ProTable, { ColumnsState } from "@ant-design/pro-table";
import { createColumns, tableSize } from "../utils";
import { useEffect, useState } from "react";
import { useDebounce } from "ahooks";

interface ItemT {}

const columns = createColumns();

const data = Array.from({ length: 100000 }, (_, key) => {
  return Object.fromEntries(columns.map((e) => [e.dataIndex, key]));
});

const AntdProTable: React.FC = () => {
  const [windowSize, setWindowSize] = useState(tableSize(170));
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [columnsState, setColumnsState] =
    useState<Record<string, ColumnsState>>();
  const debouncedValue = useDebounce(columnsState, { wait: 500 });

  useEffect(() => {
    function updateSize() {
      setWindowSize(tableSize(170));
    }
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <ProTable
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
        value: debouncedValue,
        onChange(map) {
          setColumnsState(map);
        },
      }}
      pagination={false}
      bordered
      tableRender={(props, _, domList) => {
        let newColumns = props.columns?.filter((e) => {
          if (debouncedValue) {
            return debouncedValue[e.dataIndex as unknown as string].show;
          }
          return true;
        });
        if (!newColumns?.length) {
          newColumns = props.columns;
        }
        return (
          <>
            {domList.toolbar}
            <VirtualTable
              {...(props as unknown as VirtualTableProps<ItemT>)}
              columns={newColumns as any}
            />
          </>
        );
      }}
    />
  );
};

export default AntdProTable;
