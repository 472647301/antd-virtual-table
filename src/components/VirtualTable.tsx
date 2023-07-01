import React, { useEffect } from "react";
import { ConfigProvider, Empty, Table, TableProps } from "antd";
import { TableColumnType as AntdTableColumnType, Checkbox } from "antd";
import { useCallback, useMemo, useRef, useState } from "react";
import { Grid, OnScrollCallback, OnScrollProps } from "./Grid";
import { assignRef, classNames } from "../utils";
import { isFunction, refSetter } from "../utils";
import { sumColumnWidths, sumRowsHeights } from "../utils";
import { GridChildComponentProps } from "./Cell";
import { MemonableVirtualTableCell } from "./Cell";
import { TableComponents } from "rc-table/lib/interface";
import { useSelections } from "ahooks";
import { ProTableProps } from "@ant-design/pro-table";

export interface InfoRef {
  scrollLeft: number;
}

export interface Info {
  scrollbarSize: number;
  ref: React.Ref<InfoRef>;
  onScroll: (info: {
    currentTarget?: HTMLElement;
    scrollLeft?: number;
  }) => void;
}

export interface ScrollViewSize {
  x: number;
  y: number;
}

export interface ScrollConfig extends ScrollViewSize {
  scrollToFirstRowOnChange?: boolean;
}

export interface ColumnType<RecordType extends Record<any, any> = any>
  extends Omit<
    AntdTableColumnType<RecordType>,
    "width" | "shouldCellUpdate" | "onCell" | "render"
  > {
  overlap?: number;
  width: number;
  onCell?: (
    data: RecordType | undefined,
    index?: number,
    isScrolling?: boolean
  ) => React.HTMLAttributes<any> | React.TdHTMLAttributes<any>;
  render?: (
    value: any,
    record: RecordType | undefined,
    index: number,
    isScrolling?: boolean
  ) => React.ReactNode;
  shouldCellUpdate?: (
    record: RecordType | undefined,
    prevRecord: RecordType | undefined,
    isScrolling?: boolean
  ) => boolean;
}

export type ColumnsType<RecordType extends Record<any, any> = any> =
  ColumnType<RecordType>[];

export type VirtualTableComponents<RecordType> = Omit<
  TableComponents<RecordType>,
  "body"
>;

export interface VirtualTableProps<RecordType extends Record<any, any>>
  extends Omit<TableProps<RecordType>, "columns" | "scroll" | "components"> {
  components?: VirtualTableComponents<RecordType>;
  gridRef?: React.Ref<Grid<RecordType>>;
  outerGridRef?: React.Ref<HTMLElement>;
  scroll: ScrollConfig;
  columns: ColumnsType<RecordType>;
  rowHeight?: number | ((record: Readonly<RecordType>) => number);
  rerenderFixedColumnOnHorizontalScroll?: boolean;
  onScroll?: OnScrollCallback;
  columnsState?: ProTableProps<RecordType, {}>;
  tableViewRender?: () => React.ReactNode;
}

export const VirtualTable = <RecordType extends Record<any, any>>(
  props: VirtualTableProps<RecordType> & { ref?: React.Ref<HTMLDivElement> }
) => {
  const {
    ref,
    dataSource = [],
    className,
    columns: originalColumns,
    rowHeight = 54,
    scroll,
    gridRef,
    outerGridRef,
    onScroll,
    onChange,
    components,
    locale,
    showHeader,
    rerenderFixedColumnOnHorizontalScroll,
    rowSelection,
    columnsState,
    tableViewRender,
    ...tableProps
  } = props;

  const isProTabel = !!tableViewRender;
  const tableRef = useRef<HTMLElement | null>(null);
  const internalGridRef = useRef<Grid<RecordType> | null>(null);
  const [connectObject] = useState<InfoRef>(() => {
    return {
      get scrollLeft() {
        if (internalGridRef.current) {
          // @ts-ignore
          return internalGridRef.current?.state.scrollLeft;
        }
        return 0;
      },
      set scrollLeft(value: number) {
        if (internalGridRef.current) {
          // @ts-ignore
          const currentScrollLeft = internalGridRef.current.state.scrollLeft;
          if (currentScrollLeft === value) {
            return;
          }
          internalGridRef.current.scrollTo({ scrollLeft: value });
        }
      },
    };
  });

  const [rowKey] = useMemo(() => {
    let rowKey = "key";
    if (typeof props.rowKey === "string") {
      rowKey = props.rowKey;
    }
    return [rowKey];
  }, [props.rowKey]);

  const [items] = useMemo(() => {
    let items = dataSource.map((e) => e[rowKey]);
    items = items.filter((e) => e !== undefined && e !== null);
    return [items];
  }, [dataSource, rowKey]);

  const { selected, isSelected, toggle, allSelected, toggleAll, unSelectAll } =
    useSelections(items, rowSelection?.defaultSelectedRowKeys || []);

  const selectionColumn: () => ColumnType<RecordType> = useCallback(() => {
    const onCheckedAll = () => {
      toggleAll();
      const newArr = allSelected ? [] : items;
      rowSelection?.onChange?.(
        newArr,
        dataSource.filter((e) => newArr.includes(e[rowKey])),
        { type: "all" }
      );
    };

    const onChecked = (val: React.Key) => {
      toggle(val);
      let newArr = [...selected];
      if (isSelected(val)) {
        newArr.push(val);
      } else {
        newArr = newArr.filter((id) => id !== val);
      }
      rowSelection?.onChange?.(
        newArr,
        dataSource.filter((e) => newArr.includes(e[rowKey])),
        { type: "none" }
      );
    };
    return {
      dataIndex: rowKey,
      fixed: rowSelection?.fixed,
      title: <Checkbox onClick={onCheckedAll} checked={allSelected} />,
      width: rowSelection?.columnWidth ? +rowSelection.columnWidth : 60,
      render: (val: React.Key, record?: RecordType) => (
        <Checkbox
          {...rowSelection?.getCheckboxProps?.(record!)}
          onClick={() => onChecked(val)}
          checked={isSelected(val)}
        />
      ),
    };
  }, [
    rowSelection,
    selected,
    toggle,
    allSelected,
    toggleAll,
    isSelected,
    dataSource,
    items,
    rowKey,
  ]);

  const [newColumns] = useMemo(() => {
    const newColumns = [...originalColumns];
    if (
      (rowSelection && rowKey && isProTabel) ||
      (!isProTabel &&
        rowKey &&
        rowSelection?.selectedRowKeys &&
        rowSelection.onChange)
    ) {
      newColumns.unshift(selectionColumn());
    }
    return [newColumns];
  }, [originalColumns, rowSelection, selectionColumn, isProTabel, rowKey]);

  const fixStickyHeaderOffset = useCallback(
    (tableWrap?: HTMLElement | null) => {
      if (showHeader === false || components?.header) {
        return;
      }

      if (tableWrap) {
        const header = tableWrap.querySelector<HTMLElement>(
          ".ant-table .ant-table-header"
        );

        if (header) {
          const headerCells = header.querySelectorAll<HTMLTableCellElement>(
            ".ant-table-thead .ant-table-cell"
          );

          let totalWidth = 0;

          for (
            let headerIndex = 0;
            headerIndex < headerCells.length;
            headerIndex++
          ) {
            const cell = headerCells[headerIndex];
            const width = cell.getBoundingClientRect().width;
            totalWidth += width;
          }

          // TODO: Возможно пользователь задал свое значение, тут надо подумать...
          header.style.maxWidth = `${totalWidth}px`;

          let leftOffset = 0;
          let rightOffset = 0;

          for (
            let headerIndex = 0;
            headerIndex < headerCells.length;
            headerIndex++
          ) {
            const cell = headerCells[headerIndex];

            if (cell.classList.contains("ant-table-cell-fix-left")) {
              const width = cell.getBoundingClientRect().width;
              cell.style.left = `${leftOffset}px`;
              leftOffset += width;
              continue;
            }

            break;
          }

          for (
            let headerIndex = headerCells.length - 1;
            headerIndex > -1;
            headerIndex--
          ) {
            const cell = headerCells[headerIndex];

            if (cell.classList.contains("ant-table-cell-fix-right")) {
              const width = cell.getBoundingClientRect().width;
              cell.style.right = `${rightOffset}px`;
              rightOffset += width;
              continue;
            }

            break;
          }
        }
      }
    },
    [components?.header, showHeader]
  );

  const reset = useCallback(
    (columnIndex: number = 0, rowIndex: number = 0) => {
      fixStickyHeaderOffset(tableRef.current);

      if (scroll.scrollToFirstRowOnChange) {
        connectObject.scrollLeft = 0;
      }

      internalGridRef.current?.resetAfterIndices({
        columnIndex: columnIndex,
        rowIndex: rowIndex,
        shouldForceUpdate: true,
      });
    },
    [scroll.scrollToFirstRowOnChange, connectObject, fixStickyHeaderOffset]
  );

  useEffect(reset, [columnsState]);

  useEffect(() => {
    if (
      isProTabel &&
      selected.length &&
      !rowSelection?.selectedRowKeys?.length
    ) {
      unSelectAll();
      rowSelection?.onChange?.([], [], { type: "all" });
    }
  }, [rowSelection, selected, isProTabel, unSelectAll]);

  const handleChange = useCallback<NonNullable<typeof onChange>>(
    (pagination, filters, sorter, extra) => {
      fixStickyHeaderOffset(tableRef.current);

      if (onChange) {
        onChange(pagination, filters, sorter, extra);
      }

      if (scroll.scrollToFirstRowOnChange) {
        reset();
      }
    },
    [scroll.scrollToFirstRowOnChange, onChange, reset, fixStickyHeaderOffset]
  );

  const [normalizeColumns, normalizeIndexes, getColumn, cellRender] =
    useMemo(() => {
      let blockBuffer = 0;

      const normalizeColumns: typeof newColumns = [];
      const normalizeIndexes: number[] = [];

      newColumns.forEach((column, index) => {
        if (blockBuffer > 1) {
          blockBuffer--;
          return;
        }

        blockBuffer = column.overlap ?? 0;

        normalizeColumns.push(column);
        normalizeIndexes.push(index);
      });

      const getColumn = (index: number) => normalizeColumns[index];
      const cellRender = (props: GridChildComponentProps<RecordType>) => {
        const { columnIndex } = props;
        const originalColumnIndex = normalizeIndexes[columnIndex];
        const column = normalizeColumns[columnIndex];

        return (
          <MemonableVirtualTableCell
            {...props}
            originalColumnIndex={originalColumnIndex}
            column={column}
          />
        );
      };

      return [normalizeColumns, normalizeIndexes, getColumn, cellRender];
    }, [newColumns]);

  const rowHeightGetterByRecord = useMemo(
    () => (isFunction(rowHeight) ? rowHeight : () => rowHeight),
    [rowHeight]
  );

  const { renderEmpty } = React.useContext(ConfigProvider.ConfigContext);

  const emptyNode = useMemo(() => {
    const emptyText = (locale && locale.emptyText) ||
      renderEmpty?.("Table") || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

    const emptyNode = typeof emptyText === "function" ? emptyText() : emptyText;

    return <div className="virtual-grid-empty">{emptyNode}</div>;
  }, [locale, renderEmpty]);

  const bodyRender = useCallback(
    (rawData: readonly RecordType[], info: Info) => {
      const { ref, scrollbarSize, onScroll: tableOnScroll } = info;

      assignRef(connectObject, ref);

      fixStickyHeaderOffset(tableRef.current);

      const rowHeightGetter = (index: number) =>
        rowHeightGetterByRecord(rawData[index]);

      const totalHeight = sumRowsHeights(
        rowHeightGetter,
        rawData,
        rawData.length - 1
      );

      const scrollY = Math.min(
        scroll.y,
        rawData.length ? rawData.length * 54 : 80
      );

      const columnWidthGetter = (index: number): number => {
        const column = normalizeColumns[index];
        const { width, overlap } = column;

        if (overlap && overlap > 0) {
          let blockedWidth = width;
          let lastBlockedIndex = normalizeIndexes[index];

          for (let overlapIndex = 1; overlapIndex < overlap; overlapIndex++) {
            lastBlockedIndex++;
            blockedWidth += newColumns[lastBlockedIndex].width;
          }

          return lastBlockedIndex === newColumns.length - 1
            ? blockedWidth - scrollbarSize
            : blockedWidth;
        }

        return totalHeight >= scrollY && index === normalizeColumns.length - 1
          ? width - scrollbarSize
          : width;
      };

      const totalWidth = sumColumnWidths(
        columnWidthGetter,
        normalizeColumns.length - 1
      );

      const handleScroll = (props: OnScrollProps) => {
        if (tableOnScroll) {
          tableOnScroll({
            scrollLeft: props.scrollLeft,
          });
        }

        if (onScroll) {
          onScroll(props);
        }
      };

      const hasData = rawData.length > 0;

      return (
        <div className="virtual-grid-wrap">
          {!hasData && emptyNode}
          <Grid<RecordType>
            useIsScrolling
            ref={refSetter(gridRef, internalGridRef)}
            outerRef={refSetter(outerGridRef)}
            className="virtual-grid"
            rerenderFixedColumnOnHorizontalScroll={
              rerenderFixedColumnOnHorizontalScroll
            }
            estimatedColumnWidth={totalWidth / normalizeColumns.length}
            estimatedRowHeight={totalHeight / rawData.length}
            width={scroll.x}
            height={scrollY}
            columnCount={normalizeColumns.length}
            rowCount={rawData.length}
            rowHeight={rowHeightGetter}
            columnWidth={columnWidthGetter}
            // @ts-ignore
            itemData={rawData}
            columnGetter={getColumn}
            onScroll={handleScroll}
          >
            {cellRender as any}
          </Grid>
        </div>
      );
    },
    [
      fixStickyHeaderOffset,
      rowHeightGetterByRecord,
      rerenderFixedColumnOnHorizontalScroll,
      normalizeIndexes,
      normalizeColumns,
      newColumns,
      scroll.x,
      scroll.y,
      getColumn,
      onScroll,
      cellRender,
      emptyNode,
    ]
  );

  React.useEffect(() => {
    fixStickyHeaderOffset(tableRef.current);
  }, [
    fixStickyHeaderOffset,
    scroll.x,
    scroll.y,
    scroll.scrollToFirstRowOnChange,
    newColumns,
    showHeader,
    components?.header,
  ]);

  return (
    <Table<RecordType>
      {...tableProps}
      ref={(el) => {
        assignRef(el, ref, tableRef);
        fixStickyHeaderOffset(el);
      }}
      locale={locale}
      showHeader={showHeader}
      className={classNames("virtual-table", className)}
      columns={newColumns}
      dataSource={dataSource}
      scroll={scroll}
      components={{
        ...components,
        body: bodyRender,
      }}
      onChange={handleChange}
    />
  );
};
