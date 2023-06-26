import { Align, VariableSizeGridProps } from "react-window";
import { columnGetter, Grid, InstanceProps } from "../components/Grid";
import { ItemMetadata, ItemMetadataMap } from "../components/Grid";
import { itemSizeGetter, ItemType } from "../components/Grid";

export interface IGridProps<RecordType extends Record<any, any> = any>
  extends VariableSizeGridProps<readonly RecordType[]> {
  rerenderFixedColumnOnHorizontalScroll?: boolean;
  scrollbarSize?: number;
  itemData: readonly RecordType[];
  columnGetter: columnGetter<RecordType>;
}

export const getItemMetadata = <TRecord extends Record<any, any> = any>(
  itemType: ItemType,
  props: Grid<TRecord>["props"],
  index: number,
  instanceProps: InstanceProps
): ItemMetadata => {
  let itemMetadataMap: ItemMetadataMap,
    itemSize: itemSizeGetter,
    lastMeasuredIndex: number;

  if (itemType === "column") {
    itemMetadataMap = instanceProps.columnMetadataMap;
    itemSize = props.columnWidth;
    lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
  } else {
    itemMetadataMap = instanceProps.rowMetadataMap;
    itemSize = props.rowHeight;
    lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
  }

  if (index > lastMeasuredIndex) {
    let offset = 0;

    if (lastMeasuredIndex >= 0) {
      const itemMetadata = itemMetadataMap[lastMeasuredIndex];
      offset = itemMetadata.offset + itemMetadata.size;
    }

    for (let i = lastMeasuredIndex + 1; i <= index; i++) {
      let size = itemSize(i);

      itemMetadataMap[i] = {
        offset,
        size,
      };

      offset += size;
    }

    if (itemType === "column") {
      instanceProps.lastMeasuredColumnIndex = index;
    } else {
      instanceProps.lastMeasuredRowIndex = index;
    }
  }

  return itemMetadataMap[index];
};

export const getEstimatedTotalHeight = <TRecord extends Record<any, any> = any>(
  { rowCount }: Grid<TRecord>["props"],
  { rowMetadataMap, estimatedRowHeight, lastMeasuredRowIndex }: InstanceProps
) => {
  let totalSizeOfMeasuredRows = 0;

  // Edge case check for when the number of items decreases while a scroll is in progress.
  // https://github.com/bvaughn/react-window/pull/138
  if (lastMeasuredRowIndex >= rowCount) {
    lastMeasuredRowIndex = rowCount - 1;
  }

  if (lastMeasuredRowIndex >= 0) {
    const itemMetadata = rowMetadataMap[lastMeasuredRowIndex];
    totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
  }

  const numUnmeasuredItems = rowCount - lastMeasuredRowIndex - 1;
  const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedRowHeight;

  return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};

export const getEstimatedTotalWidth = <TRecord extends Record<any, any> = any>(
  { columnCount }: Grid<TRecord>["props"],
  {
    columnMetadataMap,
    estimatedColumnWidth,
    lastMeasuredColumnIndex,
  }: InstanceProps
) => {
  let totalSizeOfMeasuredRows = 0;

  // Edge case check for when the number of items decreases while a scroll is in progress.
  // https://github.com/bvaughn/react-window/pull/138
  if (lastMeasuredColumnIndex >= columnCount) {
    lastMeasuredColumnIndex = columnCount - 1;
  }

  if (lastMeasuredColumnIndex >= 0) {
    const itemMetadata = columnMetadataMap[lastMeasuredColumnIndex];
    totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
  }

  const numUnmeasuredItems = columnCount - lastMeasuredColumnIndex - 1;
  const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedColumnWidth;

  return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};

export const getOffsetForIndexAndAlignment = <
  TRecord extends Record<any, any> = any
>(
  itemType: ItemType,
  props: Grid<TRecord>["props"],
  index: number,
  align: Align | undefined,
  scrollOffset: number,
  instanceProps: InstanceProps,
  scrollbarSize: number,
  sumOfLeftFixedColumnsWidth: number,
  sumOfRightFixedColumnsWidth: number
): number => {
  const leftOffset = itemType === "column" ? sumOfLeftFixedColumnsWidth : 0;
  const rightOffset = itemType === "column" ? sumOfRightFixedColumnsWidth : 0;
  const size = itemType === "column" ? props.width : props.height;
  const itemMetadata = getItemMetadata(itemType, props, index, instanceProps);

  // Get estimated total size after ItemMetadata is computed,
  // To ensure it reflects actual measurements instead of just estimates.
  const estimatedTotalSize =
    itemType === "column"
      ? getEstimatedTotalWidth(props, instanceProps)
      : getEstimatedTotalHeight(props, instanceProps);

  const maxOffset = Math.max(
    0,
    Math.min(
      estimatedTotalSize - size + leftOffset,
      itemMetadata.offset - leftOffset
    )
  );

  const minOffset = Math.max(
    0,
    itemMetadata.offset + itemMetadata.size - size + rightOffset + scrollbarSize
  );

  if (align === "smart") {
    if (scrollOffset >= minOffset - size && scrollOffset <= maxOffset + size) {
      align = "auto";
    } else {
      align = "center";
    }
  }

  switch (align) {
    case "start":
      return maxOffset;
    case "end":
      return minOffset;
    case "center":
      return Math.round(minOffset + (maxOffset - minOffset) / 2);
    case "auto":
    default:
      if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
        return scrollOffset;
      } else if (minOffset > maxOffset) {
        // Because we only take into account the scrollbar size when calculating minOffset
        // this value can be larger than maxOffset when at the end of the list
        return minOffset;
      } else if (scrollOffset < minOffset) {
        return minOffset;
      } else {
        return maxOffset;
      }
  }
};

export const getOffsetForColumnAndAlignment = <
  TRecord extends Record<any, any> = any
>(
  props: Grid<TRecord>["props"],
  index: number,
  align: Align | undefined,
  scrollOffset: number,
  instanceProps: InstanceProps,
  scrollbarSize: number,
  sumOfLeftFixedColumnsWidth: number,
  sumOfRightFixedColumnsWidth: number
): number =>
  getOffsetForIndexAndAlignment(
    "column",
    props,
    index,
    align,
    scrollOffset,
    instanceProps,
    scrollbarSize,
    sumOfLeftFixedColumnsWidth,
    sumOfRightFixedColumnsWidth
  );

export const getOffsetForRowAndAlignment = <
  TRecord extends Record<any, any> = any
>(
  props: Grid<TRecord>["props"],
  index: number,
  align: Align | undefined,
  scrollOffset: number,
  instanceProps: InstanceProps,
  scrollbarSize: number,
  sumOfLeftFixedColumnsWidth: number,
  sumOfRightFixedColumnsWidth: number
): number =>
  getOffsetForIndexAndAlignment(
    "row",
    props,
    index,
    align,
    scrollOffset,
    instanceProps,
    scrollbarSize,
    sumOfLeftFixedColumnsWidth,
    sumOfRightFixedColumnsWidth
  );

export const getRowOffset = <TRecord extends Record<any, any> = any>(
  props: Grid<TRecord>["props"],
  index: number,
  instanceProps: InstanceProps
): number => getItemMetadata("row", props, index, instanceProps).offset;

export const getRowHeightOrCalculate = <TRecord extends Record<any, any> = any>(
  props: Grid<TRecord>["props"],
  index: number,
  instanceProps: InstanceProps
): number => getItemMetadata("row", props, index, instanceProps).size;

export const getRowHeight = <TRecord extends Record<any, any> = any>(
  props: Grid<TRecord>["props"],
  index: number,
  instanceProps: InstanceProps
): number => instanceProps.rowMetadataMap[index].size;

export const getColumnWidth = <TRecord extends Record<any, any> = any>(
  props: Grid<TRecord>["props"],
  index: number,
  instanceProps: InstanceProps
): number => instanceProps.columnMetadataMap[index].size;

export const getColumnWidthOrCalculate = <
  TRecord extends Record<any, any> = any
>(
  props: Grid<TRecord>["props"],
  index: number,
  instanceProps: InstanceProps
): number => getItemMetadata("column", props, index, instanceProps).size;

let size: number = -1;

// This utility copied from "dom-helpers" package.
export function getScrollbarSize(recalculate: boolean = false): number {
  if (size === -1 || recalculate) {
    const div = document.createElement("div");
    const style = div.style;

    style.width = "50px";
    style.height = "50px";
    style.overflow = "scroll";

    document.body.appendChild(div);

    size = div.offsetWidth - div.clientWidth;

    document.body.removeChild(div);
  }

  return size;
}

export type RTLOffsetType =
  | "negative"
  | "positive-descending"
  | "positive-ascending";

let cachedRTLResult: RTLOffsetType | null = null;

// TRICKY According to the spec, scrollLeft should be negative for RTL aligned elements.
// Chrome does not seem to adhere; its scrollLeft values are positive (measured relative to the left).
// Safari's elastic bounce makes detecting this even more complicated wrt potential false positives.
// The safest way to check this is to intentionally set a negative offset,
// and then verify that the subsequent "scroll" event matches the negative offset.
// If it does not match, then we can assume a non-standard RTL scroll implementation.
export function getRTLOffsetType(recalculate: boolean = false): RTLOffsetType {
  if (cachedRTLResult === null || recalculate) {
    const outerDiv = document.createElement("div");
    const outerStyle = outerDiv.style;
    outerStyle.width = "50px";
    outerStyle.height = "50px";
    outerStyle.overflow = "scroll";
    outerStyle.direction = "rtl";

    const innerDiv = document.createElement("div");
    const innerStyle = innerDiv.style;
    innerStyle.width = "100px";
    innerStyle.height = "100px";

    outerDiv.appendChild(innerDiv);

    document.body.appendChild(outerDiv);

    if (outerDiv.scrollLeft > 0) {
      cachedRTLResult = "positive-descending";
    } else {
      outerDiv.scrollLeft = 1;
      if (outerDiv.scrollLeft === 0) {
        cachedRTLResult = "negative";
      } else {
        cachedRTLResult = "positive-ascending";
      }
    }

    document.body.removeChild(outerDiv);

    return cachedRTLResult;
  }

  return cachedRTLResult;
}

export type ValueGetter<T = number> = T | ((index: number) => T);

export function isFunction(value: any): value is Function {
  return (
    typeof value === "function" ||
    (value && {}.toString.call(value) === "[object Function]")
  );
}

export function isArray<T>(value: T[]): value is T[];
export function isArray<T>(value: Array<T>): value is Array<T>;
export function isArray<T>(value: T | T[]): value is Array<T>;
export function isArray<T>(value: Readonly<T[]>): value is Readonly<T[]>;
export function isArray<T>(
  value: Readonly<Array<T>>
): value is Readonly<Array<T>>;
export function isArray<T>(
  value: T | Readonly<T[]>
): value is Readonly<Array<T>>;
export function isArray(value: unknown): value is Array<unknown>;
export function isArray(value: unknown): value is Array<unknown> {
  return Array.isArray(value);
}

export function sumColumnWidths(
  columnWidthGetter: ValueGetter<number>,
  index: number
) {
  if (index < 0) {
    return 0;
  }

  if (isFunction(columnWidthGetter)) {
    let sum = 0;
    while (index-- > 0) {
      sum += columnWidthGetter(index);
    }
    return sum;
  }

  return columnWidthGetter + index * columnWidthGetter;
}

export function sumRowsHeights<T>(
  rowHeightGetter: ValueGetter<number>,
  rows: ReadonlyArray<T>,
  index: number
) {
  if (index < 0) {
    return 0;
  }

  if (isFunction(rowHeightGetter)) {
    let sum = 0;

    for (; index > -1; index--) {
      sum += rowHeightGetter(index);
    }

    return sum;
  }

  return index * rowHeightGetter;
}

export function assignRef<T>(
  refValue: T,
  ...refs: (React.Ref<T> | undefined)[]
) {
  for (let i = 0; i < refs.length; i++) {
    const tmpRef = refs[i];

    if (typeof tmpRef === "function") {
      tmpRef(refValue);
    }
    if (typeof tmpRef === "object") {
      (tmpRef as unknown as React.MutableRefObject<T>).current = refValue;
    }
  }
}

export function refSetter<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (ref: T) => assignRef(ref, ...refs);
}

export function mixClassNameSingle(
  classList1: string,
  classList2: string | undefined
) {
  return classList1 + (classList2 ? " " + classList2 : "");
}

export const hasOwn = {}.hasOwnProperty;

export type ClassNamesValue = string | number | boolean | undefined | null;
export type ClassNamesMapping = Record<string, unknown>;
export type ClassNamesArgument =
  | ClassNamesValue
  | ClassNamesMapping
  | ClassNamesArgumentArray;
export interface ClassNamesArgumentArray extends Array<ClassNamesArgument> {}

export function classNames(...args: ClassNamesArgumentArray) {
  const classes: string[] = [];

  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i];

    if (!arg) continue;

    const argType = typeof arg;

    if (argType === "string" || argType === "number") {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = classNames.apply(null, arg);

        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === "object") {
      if (
        arg.toString !== Object.prototype.toString &&
        !arg.toString.toString().includes("[native code]")
      ) {
        classes.push(arg.toString());
        continue;
      }

      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}
