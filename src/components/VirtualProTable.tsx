import ProTable, { ProTableProps, ColumnsState } from "@ant-design/pro-table";
import type { ParamsType } from "@ant-design/pro-provider";
import { useDebounce } from "ahooks";
import { useState } from "react";
import { VirtualTable, VirtualTableProps } from "./VirtualTable";
import { columnSort, genColumnKey } from "../utils";

export interface VirtualProTableProps<T, U, ValueType>
  extends Omit<
    ProTableProps<T, U, ValueType>,
    "tableRender" | "tableViewRender"
  > {}

export const VirtualProTable = <
  T extends Record<string, any>,
  U extends ParamsType = ParamsType,
  ValueType = "text"
>(
  props: VirtualProTableProps<T, U, ValueType>
) => {
  const [values, setValues] = useState<Record<string, ColumnsState>>();
  const columnsConfig = useDebounce(values, { wait: 500 });

  const columnsState: ProTableProps<T, U, ValueType>["columnsState"] = {
    ...props.columnsState,
    value: columnsConfig,
    onChange(map) {
      setValues(map);
      props.columnsState?.onChange?.(map);
    },
  };

  const tableViewRender: ProTableProps<T, U, ValueType>["tableViewRender"] = (
    props
  ) => {
    let newColumns = props.columns?.filter((e, i) => {
      const columnKey = genColumnKey(e.key, i);
      if (columnsConfig) {
        return columnsConfig[columnKey]?.show;
      }
      return true;
    });
    if (!newColumns?.length) {
      // 至少保留一列
      newColumns = props.columns?.slice(0, 3);
    }
    if (columnsConfig && newColumns) {
      newColumns?.sort(columnSort(columnsConfig));
    }
    return (
      <VirtualTable
        {...(props as unknown as VirtualTableProps<T>)}
        columns={newColumns as any}
      />
    );
  };

  return (
    <ProTable
      {...props}
      tableViewRender={tableViewRender}
      options={{ ...props.options, density: false }}
      columnsState={columnsState}
    />
  );
};
