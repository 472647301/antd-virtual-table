import React from "react";
import { TableProps } from "antd";
import { TableColumnType as AntdTableColumnType } from "antd";
import { Grid, OnScrollCallback } from "./components/Grid";
import { TableComponents } from "rc-table/lib/interface";
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
export interface ColumnType<RecordType extends Record<any, any> = any> extends Omit<AntdTableColumnType<RecordType>, "width" | "shouldCellUpdate" | "onCell" | "render"> {
    overlap?: number;
    width: number;
    onCell?: (data: RecordType | undefined, index?: number, isScrolling?: boolean) => React.HTMLAttributes<any> | React.TdHTMLAttributes<any>;
    render?: (value: any, record: RecordType | undefined, index: number, isScrolling?: boolean) => React.ReactNode;
    shouldCellUpdate?: (record: RecordType | undefined, prevRecord: RecordType | undefined, isScrolling?: boolean) => boolean;
}
export declare type ColumnsType<RecordType extends Record<any, any> = any> = ColumnType<RecordType>[];
export declare type VirtualTableComponents<RecordType> = Omit<TableComponents<RecordType>, "body">;
export interface VirtualTableProps<RecordType extends Record<any, any>> extends Omit<TableProps<RecordType>, "columns" | "scroll" | "components"> {
    components?: VirtualTableComponents<RecordType>;
    gridRef?: React.Ref<Grid<RecordType>>;
    outerGridRef?: React.Ref<HTMLElement>;
    scroll: ScrollConfig;
    columns: ColumnsType<RecordType>;
    rowHeight?: number | ((record: Readonly<RecordType>) => number);
    rerenderFixedColumnOnHorizontalScroll?: boolean;
    onScroll?: OnScrollCallback;
}
export declare const VirtualTable: <RecordType extends Record<any, any>>(props: VirtualTableProps<RecordType> & {
    ref?: React.Ref<HTMLDivElement> | undefined;
}) => import("react/jsx-runtime").JSX.Element;
