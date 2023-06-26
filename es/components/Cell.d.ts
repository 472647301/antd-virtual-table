import React from "react";
import { GridChildComponentProps as OriginalGridChildComponentProps } from "react-window";
import { ColumnType } from "../index";
export declare const columnRowClassName = "virtial-grid-item";
export declare const defaultItemKey: ({ columnIndex, rowIndex, }: {
    columnIndex: number;
    rowIndex: number;
}) => string;
export interface GridChildComponentProps<RecordType extends Record<any, any> = any> extends OriginalGridChildComponentProps<readonly RecordType[]> {
}
export interface VirtualTableCellProps<RecordType extends Record<any, any> = any> extends GridChildComponentProps<RecordType> {
    originalColumnIndex: number;
    column: ColumnType<RecordType>;
}
export declare function VirtualTableCell<RecordType extends Record<any, any> = any>(props: VirtualTableCellProps<RecordType>): import("react/jsx-runtime").JSX.Element;
export declare const MemonableVirtualTableCell: React.MemoExoticComponent<typeof VirtualTableCell>;
