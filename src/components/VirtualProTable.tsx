import ProTable, { ProTableProps } from "@ant-design/pro-table";
import type { ParamsType } from "@ant-design/pro-provider";
import { ScrollConfig, VirtualTable, VirtualTableProps } from "./VirtualTable";
import { columnSort, genColumnKey } from "../utils";
import { useEffect, useMemo, useState } from "react";
import { EditableProTable } from "@ant-design/pro-table";
import type { EditableProTableProps } from "@ant-design/pro-table/es/components/EditableTable";
import { Table } from "antd";

type VProps<T extends Record<string, any>, U, ValueType> = Omit<
  VirtualTableProps<T>,
  | "components"
  | "scroll"
  | "columns"
  | "columnsState"
  | "onScroll"
  | "tableViewRender"
> &
  Omit<ProTableProps<T, U, ValueType>, "tableRender" | "tableViewRender">;

export interface VirtualProTableProps<
  T extends Record<string, any>,
  U,
  ValueType
> extends VProps<T, U, ValueType> {
  offsetY?: number;
  offsetX?: number;
  autoHeight?: boolean;
}

export const VirtualProTable = <
  T extends Record<string, any>,
  U extends ParamsType = ParamsType,
  ValueType = "text"
>(
  props: VirtualProTableProps<T, U, ValueType>
) => {
  const id = useMemo(() => `${Date.now()}`, []);
  const {
    offsetX = 0,
    offsetY = 0,
    autoHeight,
    rowHeight = 32,
    ...rest
  } = props;
  const [size, setSize] = useState<ScrollConfig>(rest.scroll as ScrollConfig);
  const columnsState: ProTableProps<T, U, ValueType>["columnsState"] = {
    ...rest.columnsState,
  };

  const onResize = () => {
    let toolbarHeight = 0;
    const dom = document.getElementById(id);
    // console.log("onResize", dom?.getBoundingClientRect());
    if (!dom) return;
    const toolbarElm = dom.getElementsByClassName(
      ".ant-pro-table-list-toolbar"
    );
    if (toolbarElm.length) {
      toolbarHeight = toolbarElm[0].getBoundingClientRect().height;
    }
    const rect = dom.getBoundingClientRect();
    const paginationHeight = rest.pagination ? 78 : 28; // 分页
    const y = window.innerHeight - rect.top - paginationHeight - toolbarHeight;
    setSize({ x: rect.width + offsetX, y: y - offsetY }); // 在减去头部
  };

  useEffect(() => {
    if (autoHeight === false) return;
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
    let _width = 0;
    const _props = tableProps as ProTableProps<T, U, ValueType>;
    let newColumns = _props.columns?.filter((e, i) => {
      if (typeof e.width === "number") {
        _width += e.width;
      }
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
    const scroll = {
      x: _props.scroll?.x as number,
      y: (_props.scroll?.y as number) - sizeY,
    };
    if (typeof rowHeight === "number" && _props.dataSource?.length) {
      const len = _props.dataSource.length;
      const total = len * rowHeight + len;
      if (scroll.y > total) {
        scroll.y = total;
      }
    }
    if (_width <= scroll.x || !newColumns?.length) {
      return (
        <Table
          {...(rest as unknown as VirtualTableProps<T>)}
          {...(tableProps as unknown as VirtualTableProps<T>)}
          columns={newColumns as VirtualTableProps<T>["columns"]}
          scroll={scroll}
        />
      );
    }
    return (
      <VirtualTable
        {...(rest as unknown as VirtualTableProps<T>)} // 不给会丢失rowKey等
        {...(tableProps as unknown as VirtualTableProps<T>)}
        columns={newColumns as VirtualTableProps<T>["columns"]}
        scroll={scroll}
      />
    );
  };

  if (rest.editable) {
    return (
      <EditableProTable
        {...(rest as unknown as EditableProTableProps<T, {}>)}
        tableViewRender={tableViewRender}
        options={{ ...props.options, density: false }}
        columnsState={columnsState}
        scroll={size}
        id={id}
      />
    );
  }

  return (
    <ProTable
      {...rest}
      tableViewRender={rest.columns?.length ? tableViewRender : void 0}
      options={{ ...rest.options, density: false }}
      columnsState={columnsState}
      scroll={size}
      id={id}
    />
  );
};
