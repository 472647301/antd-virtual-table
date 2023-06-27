import ProTable, { ProTableProps } from "@ant-design/pro-table";
import type { ParamsType } from "@ant-design/pro-provider";
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
  const columnsState: ProTableProps<T, U, ValueType>["columnsState"] = {
    ...props.columnsState,
  };

  console.log("--VirtualProTable--");

  const tableViewRender: ProTableProps<T, U, ValueType>["tableViewRender"] = (
    tableProps
  ) => {
    console.log("--tableViewRender--");
    const _props = tableProps as ProTableProps<T, U, ValueType>;
    let newColumns = _props.columns?.filter((e, i) => {
      const columnKey = genColumnKey(e.key, i);
      if (_props.columnsState?.value) {
        return _props.columnsState?.value[columnKey]?.show;
      }
      return true;
    });
    if (_props.columnsState?.value && newColumns) {
      newColumns?.sort(columnSort(_props.columnsState?.value));
    }
    return (
      <VirtualTable
        {...(props as unknown as VirtualTableProps<T>)} // 不给会丢失rowKey等
        {...(tableProps as unknown as VirtualTableProps<T>)}
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
