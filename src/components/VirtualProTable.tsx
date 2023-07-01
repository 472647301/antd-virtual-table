import ProTable, { ProTableProps } from "@ant-design/pro-table";
import type { ParamsType } from "@ant-design/pro-provider";
import { VirtualTable, VirtualTableProps } from "./VirtualTable";
import { columnSort, genColumnKey } from "../utils";
import { useState } from "react";

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
  const [isVirtual, setIsVirtual] = useState(false);
  const columnsState: ProTableProps<T, U, ValueType>["columnsState"] = {
    ...props.columnsState,
  };

  const onLoad = (dataSource: T[]) => {
    const _virtual = dataSource.length > 20;
    if (_virtual !== isVirtual) {
      setIsVirtual(_virtual);
    }
    props.onLoad?.(dataSource);
  };

  const tableViewRender: ProTableProps<T, U, ValueType>["tableViewRender"] = (
    tableProps
  ) => {
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
      onLoad={onLoad}
      tableViewRender={isVirtual ? tableViewRender : void 0}
      options={{
        ...props.options,
        density: !isVirtual,
      }}
      columnsState={columnsState}
    />
  );
};
