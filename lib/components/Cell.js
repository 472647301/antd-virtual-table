"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MemonableVirtualTableCell = void 0;
exports.VirtualTableCell = VirtualTableCell;
exports.defaultItemKey = exports.columnRowClassName = void 0;
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));
var _react = _interopRequireWildcard(require("react"));
var _utils = require("../utils");
var _jsxRuntime = require("react/jsx-runtime");
var columnRowClassName = "virtial-grid-item";
exports.columnRowClassName = columnRowClassName;
var defaultItemKey = function defaultItemKey(_ref) {
  var columnIndex = _ref.columnIndex,
    rowIndex = _ref.rowIndex;
  return "".concat(rowIndex, ":").concat(columnIndex);
};
exports.defaultItemKey = defaultItemKey;
function VirtualTableCell(props) {
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, cellProps), {}, {
    "data-row-index": rowIndex,
    "data-column-index": columnIndex,
    "data-original-column-index": originalColumnIndex,
    style: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, cellProps === null || cellProps === void 0 ? void 0 : cellProps.style), style),
    className: (0, _utils.classNames)(columnRowClassName, cellProps === null || cellProps === void 0 ? void 0 : cellProps.className),
    children: content
  }));
}
var MemonableVirtualTableCell = /*#__PURE__*/(0, _react.memo)(VirtualTableCell, function (prevProps, nextProps) {
  // system index
  if (prevProps.originalColumnIndex !== nextProps.originalColumnIndex || prevProps.columnIndex !== nextProps.columnIndex || prevProps.rowIndex !== nextProps.rowIndex) {
    return false;
  }
  if (prevProps.style !== nextProps.style && !(0, _fastDeepEqual.default)(prevProps.style, nextProps.style)) {
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
exports.MemonableVirtualTableCell = MemonableVirtualTableCell;