import { EditableProTable } from "@ant-design/pro-table";
import type { ParamsType } from "@ant-design/pro-provider";
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
  const [isVirtual, setIsVirtual] = useState(false);
  const columnsState: EditableProTableProps<T, U, ValueType>["columnsState"] = {
    ...props.columnsState,
  };

  const onLoad = (dataSource: T[]) => {
    const _virtual = dataSource.length > 20;
    if (_virtual !== isVirtual) {
      setIsVirtual(_virtual);
    }
    props.onLoad?.(dataSource);
  };

  const tableViewRender: EditableProTableProps<
    T,
    U,
    ValueType
  >["tableViewRender"] = (tableProps) => {
    const _props = tableProps as EditableProTableProps<T, U, ValueType>;
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
        {...(props as unknown as VirtualTableProps<T>)}
        {...(tableProps as unknown as VirtualTableProps<T>)}
        columns={newColumns as any}
      />
    );
  };

  return (
    <EditableProTable
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
