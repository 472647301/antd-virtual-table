import { EditableProTable } from "@ant-design/pro-table";
import type { ParamsType } from "@ant-design/pro-provider";
import { useEffect, useState } from "react";
import { ScrollConfig, VirtualTable, VirtualTableProps } from "./VirtualTable";
import { columnSort, genColumnKey } from "../utils";
import type { EditableProTableProps } from "@ant-design/pro-table/es/components/EditableTable";

export interface VirtualEditableProTableProps<
  T,
  U extends ParamsType,
  ValueType
> extends Omit<
    EditableProTableProps<T, U, ValueType>,
    "tableRender" | "tableViewRender"
  > {
  offsetBottom?: number;
}

export const VirtualEditableProTable = <
  T extends Record<string, any>,
  U extends ParamsType = ParamsType,
  ValueType = "text"
>(
  props: VirtualEditableProTableProps<T, U, ValueType>
) => {
  const id = `${Date.now()}`;
  const [size, setSize] = useState<ScrollConfig>({ x: 100, y: 100 });
  const columnsState: EditableProTableProps<T, U, ValueType>["columnsState"] = {
    ...props.columnsState,
  };

  const onResize = () => {
    let toolbarHeight = 0;
    const offsetBottom = props.offsetBottom || 0;
    const dom = document.getElementById(id);
    if (!dom) return;
    const toolbarElm = dom.getElementsByClassName(
      ".ant-pro-table-list-toolbar"
    );
    if (toolbarElm.length) {
      toolbarHeight = toolbarElm[0].getBoundingClientRect().height;
    }
    const rect = dom.getBoundingClientRect();
    const paginationHeight = props.pagination ? 48 : 0; // 分页
    const y = window.innerHeight - rect.top - paginationHeight - toolbarHeight;
    setSize({ x: rect.width, y: y - offsetBottom }); // 在减去头部
  };

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    document.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("resize", onResize);
    };
  }, [props.rowSelection]);

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
        columns={newColumns as VirtualTableProps<T>["columns"]}
        scroll={size}
      />
    );
  };

  return (
    <EditableProTable
      {...props}
      tableViewRender={tableViewRender}
      options={{ ...props.options, density: false }}
      columnsState={columnsState}
      id={id}
    />
  );
};
