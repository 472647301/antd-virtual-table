import ProTable, { ProTableProps } from "@ant-design/pro-table";
import type { ParamsType } from "@ant-design/pro-provider";
import { ScrollConfig, VirtualTable, VirtualTableProps } from "./VirtualTable";
import { columnSort, genColumnKey } from "../utils";
import { useEffect, useState } from "react";

export interface VirtualProTableProps<T, U, ValueType>
  extends Omit<
    ProTableProps<T, U, ValueType>,
    "tableRender" | "tableViewRender"
  > {
  offsetY?: number;
  offsetX?: number;
}

export const VirtualProTable = <
  T extends Record<string, any>,
  U extends ParamsType = ParamsType,
  ValueType = "text"
>(
  props: VirtualProTableProps<T, U, ValueType>
) => {
  const id = `${Date.now()}`;
  const [size, setSize] = useState<ScrollConfig>(props.scroll as ScrollConfig);
  const columnsState: ProTableProps<T, U, ValueType>["columnsState"] = {
    ...props.columnsState,
  };

  const onResize = () => {
    let toolbarHeight = 0;
    const offsetX = props.offsetX || 0;
    const offsetY = props.offsetY || 0;
    const dom = document.getElementById(id);
    console.log("onResize", dom?.getBoundingClientRect());
    if (!dom) return;
    const toolbarElm = dom.getElementsByClassName(
      ".ant-pro-table-list-toolbar"
    );
    if (toolbarElm.length) {
      toolbarHeight = toolbarElm[0].getBoundingClientRect().height;
    }
    const rect = dom.getBoundingClientRect();
    const paginationHeight = props.pagination ? 78 : 28; // 分页
    const y = window.innerHeight - rect.top - paginationHeight - toolbarHeight;
    setSize({ x: rect.width + offsetX, y: y - offsetY }); // 在减去头部
  };

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    document.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("resize", onResize);
    };
  }, []);

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
    let sizeY = 0;
    if (
      _props.rowSelection !== false &&
      _props.rowSelection?.selectedRowKeys?.length
    ) {
      sizeY = 50;
    }
    return (
      <VirtualTable
        {...(props as unknown as VirtualTableProps<T>)} // 不给会丢失rowKey等
        {...(tableProps as unknown as VirtualTableProps<T>)}
        columns={newColumns as VirtualTableProps<T>["columns"]}
        scroll={{ ...size, y: size.y - sizeY }}
      />
    );
  };

  return (
    <ProTable
      {...props}
      tableViewRender={tableViewRender}
      options={{ ...props.options, density: false }}
      columnsState={columnsState}
      id={id}
    />
  );
};
