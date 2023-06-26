/// <reference types="react" />
import { Align, VariableSizeGridProps } from "react-window";
import { columnGetter, Grid, InstanceProps } from "../components/Grid";
import { ItemMetadata } from "../components/Grid";
import { ItemType } from "../components/Grid";
export interface IGridProps<RecordType extends Record<any, any> = any> extends VariableSizeGridProps<readonly RecordType[]> {
    rerenderFixedColumnOnHorizontalScroll?: boolean;
    scrollbarSize?: number;
    itemData: readonly RecordType[];
    columnGetter: columnGetter<RecordType>;
}
export declare const getItemMetadata: <TRecord extends Record<any, any> = any>(itemType: ItemType, props: Readonly<VariableSizeGridProps<TRecord>>, index: number, instanceProps: InstanceProps) => ItemMetadata;
export declare const getEstimatedTotalHeight: <TRecord extends Record<any, any> = any>({ rowCount }: Readonly<VariableSizeGridProps<TRecord>>, { rowMetadataMap, estimatedRowHeight, lastMeasuredRowIndex }: InstanceProps) => number;
export declare const getEstimatedTotalWidth: <TRecord extends Record<any, any> = any>({ columnCount }: Readonly<VariableSizeGridProps<TRecord>>, { columnMetadataMap, estimatedColumnWidth, lastMeasuredColumnIndex, }: InstanceProps) => number;
export declare const getOffsetForIndexAndAlignment: <TRecord extends Record<any, any> = any>(itemType: ItemType, props: Readonly<VariableSizeGridProps<TRecord>>, index: number, align: Align | undefined, scrollOffset: number, instanceProps: InstanceProps, scrollbarSize: number, sumOfLeftFixedColumnsWidth: number, sumOfRightFixedColumnsWidth: number) => number;
export declare const getOffsetForColumnAndAlignment: <TRecord extends Record<any, any> = any>(props: Readonly<VariableSizeGridProps<TRecord>>, index: number, align: Align | undefined, scrollOffset: number, instanceProps: InstanceProps, scrollbarSize: number, sumOfLeftFixedColumnsWidth: number, sumOfRightFixedColumnsWidth: number) => number;
export declare const getOffsetForRowAndAlignment: <TRecord extends Record<any, any> = any>(props: Readonly<VariableSizeGridProps<TRecord>>, index: number, align: Align | undefined, scrollOffset: number, instanceProps: InstanceProps, scrollbarSize: number, sumOfLeftFixedColumnsWidth: number, sumOfRightFixedColumnsWidth: number) => number;
export declare const getRowOffset: <TRecord extends Record<any, any> = any>(props: Readonly<VariableSizeGridProps<TRecord>>, index: number, instanceProps: InstanceProps) => number;
export declare const getRowHeightOrCalculate: <TRecord extends Record<any, any> = any>(props: Readonly<VariableSizeGridProps<TRecord>>, index: number, instanceProps: InstanceProps) => number;
export declare const getRowHeight: <TRecord extends Record<any, any> = any>(props: Readonly<VariableSizeGridProps<TRecord>>, index: number, instanceProps: InstanceProps) => number;
export declare const getColumnWidth: <TRecord extends Record<any, any> = any>(props: Readonly<VariableSizeGridProps<TRecord>>, index: number, instanceProps: InstanceProps) => number;
export declare const getColumnWidthOrCalculate: <TRecord extends Record<any, any> = any>(props: Readonly<VariableSizeGridProps<TRecord>>, index: number, instanceProps: InstanceProps) => number;
export declare function getScrollbarSize(recalculate?: boolean): number;
export declare type RTLOffsetType = "negative" | "positive-descending" | "positive-ascending";
export declare function getRTLOffsetType(recalculate?: boolean): RTLOffsetType;
export declare type ValueGetter<T = number> = T | ((index: number) => T);
export declare function isFunction(value: any): value is Function;
export declare function isArray<T>(value: T[]): value is T[];
export declare function isArray<T>(value: Array<T>): value is Array<T>;
export declare function isArray<T>(value: T | T[]): value is Array<T>;
export declare function isArray<T>(value: Readonly<T[]>): value is Readonly<T[]>;
export declare function isArray<T>(value: Readonly<Array<T>>): value is Readonly<Array<T>>;
export declare function isArray<T>(value: T | Readonly<T[]>): value is Readonly<Array<T>>;
export declare function isArray(value: unknown): value is Array<unknown>;
export declare function sumColumnWidths(columnWidthGetter: ValueGetter<number>, index: number): number;
export declare function sumRowsHeights<T>(rowHeightGetter: ValueGetter<number>, rows: ReadonlyArray<T>, index: number): number;
export declare function assignRef<T>(refValue: T, ...refs: (React.Ref<T> | undefined)[]): void;
export declare function refSetter<T>(...refs: (React.Ref<T> | undefined)[]): (ref: T) => void;
export declare function mixClassNameSingle(classList1: string, classList2: string | undefined): string;
export declare const hasOwn: (v: PropertyKey) => boolean;
export declare type ClassNamesValue = string | number | boolean | undefined | null;
export declare type ClassNamesMapping = Record<string, unknown>;
export declare type ClassNamesArgument = ClassNamesValue | ClassNamesMapping | ClassNamesArgumentArray;
export interface ClassNamesArgumentArray extends Array<ClassNamesArgument> {
}
export declare function classNames(...args: ClassNamesArgumentArray): string;
