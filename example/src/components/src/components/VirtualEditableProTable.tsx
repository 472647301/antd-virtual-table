import { EditableProTable, ColumnsState } from "@ant-design/pro-table";
import type { ParamsType } from "@ant-design/pro-provider";
import { useDebounce } from "ahooks";
import { useState } from "react";
import { VirtualTable, VirtualTableProps } from "./VirtualTable";
import { columnSort, genColumnKey } from "../utils";
import type { EditableProTableProps } from "@ant-design/pro-table/es/components/EditableTable";

export interface VirtualEditableProTableProps<
  T,
  U extends ParamsType,
  ValueType
> extends Omit<
    EditableProTableProps<T, U, ValueType>,
    "tableRender" | "tableViewRender"
  > {}

export const VirtualEditableProTable = <
  T extends Record<string, any>,
  U extends ParamsType = ParamsType,
  ValueType = "text"
>(
  props: VirtualEditableProTableProps<T, U, ValueType>
) => {
  const [values, setValues] = useState<Record<string, ColumnsState>>();
  const columnsConfig = useDebounce(values, { wait: 500 });

  const columnsState: EditableProTableProps<T, U, ValueType>["columnsState"] = {
    ...props.columnsState,
    value: columnsConfig,
    onChange(map) {
      setValues(map);
      props.columnsState?.onChange?.(map);
    },
  };

  const tableViewRender: EditableProTableProps<
    T,
    U,
    ValueType
  >["tableViewRender"] = (tableProps) => {
    let newColumns = tableProps.columns?.filter((e, i) => {
      const columnKey = genColumnKey(e.key, i);
      if (columnsConfig) {
        return columnsConfig[columnKey]?.show;
      }
      return true;
    });
    if (!newColumns?.length) {
      // 至少保留一列
      newColumns = tableProps.columns?.slice(0, 3);
    }
    if (columnsConfig && newColumns) {
      newColumns?.sort(columnSort(columnsConfig));
    }
    return (
      <VirtualTable
        {...(props as unknown as VirtualTableProps<T>)}
        {...(tableProps as unknown as VirtualTableProps<T>)}
        columns={newColumns as any}
      />
    );
  };

  return (
    <EditableProTable
      {...props}
      tableViewRender={tableViewRender}
      options={{ ...props.options, density: false }}
      columnsState={columnsState}
    />
  );
};
