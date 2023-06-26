import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import equal from "fast-deep-equal";
import React, { memo } from "react";
import { classNames } from "../utils";
import { jsx as _jsx } from "react/jsx-runtime";
export var columnRowClassName = "virtial-grid-item";
export var defaultItemKey = function defaultItemKey(_ref) {
  var columnIndex = _ref.columnIndex,
    rowIndex = _ref.rowIndex;
  return "".concat(rowIndex, ":").concat(columnIndex);
};
export function VirtualTableCell(props) {
  var style = props.style,
    column = props.column,
    data = props.data,
    originalColumnIndex = props.originalColumnIndex,
    columnIndex = props.columnIndex,
    rowIndex = props.rowIndex,
    isScrolling = props.isScrolling;
  var row = data && data[rowIndex];
  var value = column.dataIndex && row ? row[column.dataIndex] : undefined;
  var cellProps = column.onCell && column.onCell(row, columnIndex, isScrolling);
  var render = column.render;
  var content = render ? render(value, row, columnIndex, isScrolling) : value;
  return /*#__PURE__*/_jsx("div", _objectSpread(_objectSpread({}, cellProps), {}, {
    "data-row-index": rowIndex,
    "data-column-index": columnIndex,
    "data-original-column-index": originalColumnIndex,
    style: _objectSpread(_objectSpread({}, cellProps === null || cellProps === void 0 ? void 0 : cellProps.style), style),
    className: classNames(columnRowClassName, cellProps === null || cellProps === void 0 ? void 0 : cellProps.className),
    children: content
  }));
}
export var MemonableVirtualTableCell = /*#__PURE__*/memo(VirtualTableCell, function (prevProps, nextProps) {
  // system index
  if (prevProps.originalColumnIndex !== nextProps.originalColumnIndex || prevProps.columnIndex !== nextProps.columnIndex || prevProps.rowIndex !== nextProps.rowIndex) {
    return false;
  }
  if (prevProps.style !== nextProps.style && !equal(prevProps.style, nextProps.style)) {
    return false;
  }

  // check handler
  var shouldCellUpdate = nextProps.column.shouldCellUpdate;
  if (shouldCellUpdate) {
    var prevRecord = prevProps.data;
    var nextRecord = nextProps.data;
    var isScrolling = nextProps.isScrolling;
    if (!shouldCellUpdate(nextRecord, prevRecord, isScrolling)) {
      return true;
    }
  }
  if (prevProps.data === nextProps.data && prevProps.column.dataIndex === nextProps.column.dataIndex && prevProps.column.onCell === nextProps.column.onCell && prevProps.column.render === nextProps.column.render) {
    return true;
  }
  return false;
});