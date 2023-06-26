import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _get from "@babel/runtime/helpers/esm/get";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import React, { createElement } from "react";
import { VariableSizeGrid } from "react-window";
import { defaultItemKey } from "./Cell";
import { getScrollbarSize } from "../utils";
import { getEstimatedTotalHeight } from "../utils";
import { getEstimatedTotalWidth } from "../utils";
import { getOffsetForColumnAndAlignment } from "../utils";
import { getOffsetForRowAndAlignment } from "../utils";
import { classNames, isFunction } from "../utils";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var defaultRowClassName = "virtial-grid-row";
var defaultFixedRowClassName = "fixed-virtial-grid-row-columns";
var defaultFixedRowLeftColumnsClassName = "fixed-virtial-grid-row-left-columns";
var defaultFixedRowRightColumnsClassName = "fixed-virtial-grid-row-right-columns";
var defaultHasFixedLeftColumnClassName = "has-fixed-left-column";
var defaultHasFixedRightColumnClassName = "has-fixed-right-column";
export var Grid = /*#__PURE__*/function (_VariableSizeGrid) {
  _inherits(Grid, _VariableSizeGrid);
  var _super = _createSuper(Grid);
  /** может быть равен <b>props.columnCount</b>, когда нет фиксированных колонок справо */

  function Grid(props) {
    var _this;
    _classCallCheck(this, Grid);
    // @ts-ignore
    _this = _super.call(this, props);
    _defineProperty(_assertThisInitialized(_this), "_leftFixedColumnsWidth", 0);
    _defineProperty(_assertThisInitialized(_this), "_rightFixedColumnsWidth", 0);
    _defineProperty(_assertThisInitialized(_this), "_firstUnFixedColumn", 0);
    _defineProperty(_assertThisInitialized(_this), "_firstRightFixedColumn", 0);
    _defineProperty(_assertThisInitialized(_this), "_lastFixedRenderedContent", void 0);
    _defineProperty(_assertThisInitialized(_this), "_lastFixedRenderedRowStartIndex", void 0);
    _defineProperty(_assertThisInitialized(_this), "_lastFixedRenderedRowStopIndex", void 0);
    _this._updateFixedColumnsVars();
    return _this;
  }
  _createClass(Grid, [{
    key: "_updateFixedColumnsVars",
    value: function _updateFixedColumnsVars() {
      // @ts-ignore
      var _this$props = this.props,
        columnCount = _this$props.columnCount,
        columnGetter = _this$props.columnGetter,
        columnWidth = _this$props.columnWidth;
      this._firstUnFixedColumn = 0;
      this._firstRightFixedColumn = columnCount;
      this._leftFixedColumnsWidth = 0;
      this._rightFixedColumnsWidth = 0;
      this._lastFixedRenderedContent = undefined;
      this._lastFixedRenderedRowStartIndex = undefined;
      this._lastFixedRenderedRowStopIndex = undefined;
      for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        var column = columnGetter(columnIndex);
        if (column.fixed === "left" || column.fixed === true) {
          this._firstUnFixedColumn++;
          this._leftFixedColumnsWidth += columnWidth(columnIndex);
          continue;
        }
        break;
      }
      for (var _columnIndex = columnCount - 1; _columnIndex > -1; _columnIndex--) {
        var _column = columnGetter(_columnIndex);
        if (_column.fixed === "right") {
          this._firstRightFixedColumn--;
          this._rightFixedColumnsWidth += columnWidth(_columnIndex);
          continue;
        }
        break;
      }
    }
  }, {
    key: "_renderFixedColumns",
    value: function _renderFixedColumns(rowStartIndex, rowStopIndex) {
      var _this2 = this;
      var update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      // @ts-ignore
      var _this$props2 = this.props,
        rerenderFixedColumnOnHorizontalScroll = _this$props2.rerenderFixedColumnOnHorizontalScroll,
        columnWidth = _this$props2.columnWidth,
        rowHeight = _this$props2.rowHeight;
      if (rerenderFixedColumnOnHorizontalScroll === false && update === false && this._lastFixedRenderedRowStartIndex === rowStartIndex && this._lastFixedRenderedRowStopIndex === rowStopIndex && this._lastFixedRenderedContent) {
        return this._lastFixedRenderedContent;
      }
      var _this$props3 = this.props,
        children = _this$props3.children,
        itemData = _this$props3.itemData,
        columnCount = _this$props3.columnCount,
        useIsScrolling = _this$props3.useIsScrolling,
        _this$props3$itemKey = _this$props3.itemKey,
        itemKey = _this$props3$itemKey === void 0 ? defaultItemKey : _this$props3$itemKey;
      // @ts-ignore
      var isScrolling = this.state.isScrolling;
      var rows = {};
      var shownRowsCount = rowStopIndex - rowStartIndex + 1;

      // нет смысла рендерить скрытые колонки
      if (this._leftFixedColumnsWidth > 0 || this._rightFixedColumnsWidth > 0) {
        var _loop = function _loop() {
          var rowLeftColumns = [];
          var rowRightColumns = [];
          var rowIndex = rowStartIndex + visibleRowIndex;
          var height = rowHeight(rowIndex);
          var renderFixedColumn = function renderFixedColumn(columnIndex) {
            var width = columnWidth(columnIndex);
            return /*#__PURE__*/createElement(children, {
              // @ts-ignore
              key: itemKey({
                columnIndex: columnIndex,
                data: itemData,
                rowIndex: rowIndex
              }),
              rowIndex: rowIndex,
              columnIndex: columnIndex,
              // @ts-ignore
              data: itemData,
              isScrolling: useIsScrolling ? isScrolling : undefined,
              style: {
                width: width,
                height: height
              }
            });
          };
          for (var columnIndex = 0; columnIndex < _this2._firstUnFixedColumn; columnIndex++) {
            var item = renderFixedColumn(columnIndex);
            rowLeftColumns.push(item);
          }
          for (var _columnIndex2 = _this2._firstRightFixedColumn; _columnIndex2 < columnCount; _columnIndex2++) {
            var _item = renderFixedColumn(_columnIndex2);
            rowRightColumns.push(_item);
          }
          if (rowLeftColumns.length > 0 || rowRightColumns.length > 0) {
            rows[rowIndex] = [rowLeftColumns, rowRightColumns];
          }
        };
        for (var visibleRowIndex = 0; visibleRowIndex < shownRowsCount; visibleRowIndex++) {
          _loop();
        }
      }
      this._lastFixedRenderedRowStartIndex = rowStartIndex;
      this._lastFixedRenderedRowStopIndex = rowStopIndex;
      this._lastFixedRenderedContent = rows;
      return rows;
    }
  }, {
    key: "scrollToItem",
    value: function scrollToItem(_ref) {
      var align = _ref.align,
        rowIndex = _ref.rowIndex,
        columnIndex = _ref.columnIndex;
      var _this$props4 = this.props,
        columnCount = _this$props4.columnCount,
        height = _this$props4.height,
        rowCount = _this$props4.rowCount,
        width = _this$props4.width;
      // @ts-ignore
      var _this$state = this.state,
        scrollLeft = _this$state.scrollLeft,
        scrollTop = _this$state.scrollTop;
      // @ts-ignore
      var _this$props$scrollbar = this.props.scrollbarSize,
        scrollbarSize = _this$props$scrollbar === void 0 ? getScrollbarSize() : _this$props$scrollbar;
      if (columnIndex !== undefined) {
        columnIndex = Math.max(0, Math.min(columnIndex, columnCount - 1));
      }
      if (rowIndex !== undefined) {
        rowIndex = Math.max(0, Math.min(rowIndex, rowCount - 1));
      }
      var estimatedTotalHeight = getEstimatedTotalHeight(this.props,
      // @ts-ignore
      this._instanceProps);
      var estimatedTotalWidth = getEstimatedTotalWidth(this.props,
      // @ts-ignore
      this._instanceProps);

      // The scrollbar size should be considered when scrolling an item into view,
      // to ensure it's fully visible.
      // But we only need to account for its size when it's actually visible.
      var horizontalScrollbarSize = estimatedTotalWidth > width ? scrollbarSize : 0;
      var verticalScrollbarSize = estimatedTotalHeight > height ? scrollbarSize : 0;
      this.scrollTo({
        scrollLeft: columnIndex !== undefined ? getOffsetForColumnAndAlignment(this.props, columnIndex, align, scrollLeft,
        // @ts-ignore
        this._instanceProps, verticalScrollbarSize, this._leftFixedColumnsWidth, this._rightFixedColumnsWidth) : scrollLeft,
        scrollTop: rowIndex !== undefined ? getOffsetForRowAndAlignment(this.props, rowIndex, align, scrollTop,
        // @ts-ignore
        this._instanceProps, horizontalScrollbarSize, this._leftFixedColumnsWidth, this._rightFixedColumnsWidth) : scrollTop
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames;
      var _this$props5 = this.props,
        className = _this$props5.className,
        columnCount = _this$props5.columnCount,
        height = _this$props5.height,
        innerRef = _this$props5.innerRef,
        innerElementType = _this$props5.innerElementType,
        innerTagName = _this$props5.innerTagName,
        outerElementType = _this$props5.outerElementType,
        outerTagName = _this$props5.outerTagName,
        rowCount = _this$props5.rowCount,
        direction = _this$props5.direction,
        style = _this$props5.style,
        width = _this$props5.width,
        useIsScrolling = _this$props5.useIsScrolling,
        itemData = _this$props5.itemData,
        rowClassName = _this$props5.rowClassName,
        onRow = _this$props5.onRow,
        children = _this$props5.children,
        rowKey = _this$props5.rowKey,
        _this$props5$itemKey = _this$props5.itemKey,
        itemKey = _this$props5$itemKey === void 0 ? defaultItemKey : _this$props5$itemKey;

      // @ts-ignore
      var isScrolling = this.state.isScrolling;
      var rowsColumns = {};
      var rowsElementProps = {};
      var rowsFixedColumns;
      if (columnCount > 0 && rowCount > 0) {
        var _this$_getHorizontalR =
          // @ts-ignore
          this._getHorizontalRangeToRender(),
          _this$_getHorizontalR2 = _slicedToArray(_this$_getHorizontalR, 2),
          columnStartIndex = _this$_getHorizontalR2[0],
          columnStopIndex = _this$_getHorizontalR2[1];
        // @ts-ignore
        var _this$_getVerticalRan = this._getVerticalRangeToRender(),
          _this$_getVerticalRan2 = _slicedToArray(_this$_getVerticalRan, 2),
          rowStartIndex = _this$_getVerticalRan2[0],
          rowStopIndex = _this$_getVerticalRan2[1];
        rowsFixedColumns = this._renderFixedColumns(rowStartIndex, rowStopIndex);
        for (var rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
          // @ts-ignore
          var _record = itemData[rowIndex];
          var _className = rowClassName ? rowClassName(_record, rowIndex) : undefined;
          var divProps = onRow ? onRow(_record, rowIndex) : undefined;
          var key = isFunction(rowKey) ? rowKey(_record) : rowKey !== null && rowKey !== void 0 ? rowKey : "".concat(rowIndex);

          // @ts-ignore
          var firstItemStyle = this._getItemStyle(rowIndex, this._firstUnFixedColumn);
          var firstUnFixedColumn = this._firstUnFixedColumn;
          var firstRightFixedColumn = this._firstRightFixedColumn;
          var rowColumns = [];
          for (var columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex < firstUnFixedColumn || columnIndex > firstRightFixedColumn - 1) {
              continue;
            }

            // @ts-ignore
            var _key = itemKey({
              columnIndex: columnIndex,
              data: itemData,
              rowIndex: rowIndex
            });
            // @ts-ignore
            var _style = this._getItemStyle(rowIndex, columnIndex);
            rowColumns[columnIndex] = /*#__PURE__*/createElement(children, {
              columnIndex: columnIndex,
              // @ts-ignore
              data: itemData,
              isScrolling: useIsScrolling ? isScrolling : undefined,
              key: _key,
              rowIndex: rowIndex,
              style: _style
            });
          }
          rowsColumns[rowIndex] = rowColumns;
          rowsElementProps[rowIndex] = _objectSpread(_objectSpread({}, divProps), {}, {
            key: key,
            style: _objectSpread(_objectSpread({}, divProps === null || divProps === void 0 ? void 0 : divProps.style), {}, {
              top: firstItemStyle.top
            }),
            className: classNames(defaultRowClassName, _className, divProps === null || divProps === void 0 ? void 0 : divProps.className)
          });
        }
      }

      // Read this value AFTER items have been created,
      // So their actual sizes (if variable) are taken into consideration.
      var estimatedTotalHeight = getEstimatedTotalHeight(this.props,
      // @ts-ignore
      this._instanceProps);
      var estimatedTotalWidth = getEstimatedTotalWidth(this.props,
      // @ts-ignore
      this._instanceProps);
      var rows = Object.entries(rowsElementProps).map(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
          rowIndex = _ref3[0],
          props = _ref3[1];
        var _ref4 = props.style || {},
          top = _ref4.top,
          left = _ref4.left;
        var rowFixedColumns = rowsFixedColumns ? rowsFixedColumns[rowIndex] : [];
        var fixedLeftColumns = rowFixedColumns && rowFixedColumns.length ? rowFixedColumns[0] : [];
        var fixedRightColumns = rowFixedColumns && rowFixedColumns.length ? rowFixedColumns[1] : [];
        var columns = Object.values(rowsColumns[rowIndex]);
        return /*#__PURE__*/_jsxs("div", _objectSpread(_objectSpread({}, props), {}, {
          children: [columns, /*#__PURE__*/_jsxs("div", {
            className: defaultFixedRowClassName,
            style: {
              top: top,
              left: left,
              width: estimatedTotalWidth
            },
            children: [fixedLeftColumns && fixedLeftColumns.length > 0 && /*#__PURE__*/_jsx("div", {
              className: defaultFixedRowLeftColumnsClassName,
              children: fixedLeftColumns
            }), fixedRightColumns && fixedRightColumns.length > 0 && /*#__PURE__*/_jsx("div", {
              className: defaultFixedRowRightColumnsClassName,
              children: fixedRightColumns
            })]
          })]
        }));
      });
      var hasFixedLeftColumn = this._leftFixedColumnsWidth > 0;
      var hasFixedRightColumn = this._rightFixedColumnsWidth > 0;
      return /*#__PURE__*/createElement(outerElementType || outerTagName || "div", {
        className: classNames(className, (_classNames = {}, _defineProperty(_classNames, defaultHasFixedLeftColumnClassName, hasFixedLeftColumn), _defineProperty(_classNames, defaultHasFixedRightColumnClassName, hasFixedRightColumn), _classNames)),
        // @ts-ignore
        onScroll: this._onScroll,
        // @ts-ignore
        ref: this._outerRefSetter,
        style: _objectSpread({
          position: "relative",
          height: height,
          width: width,
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          willChange: "transform",
          direction: direction
        }, style)
      }, /*#__PURE__*/createElement(innerElementType || innerTagName || "div", {
        children: rows,
        ref: innerRef,
        style: {
          height: estimatedTotalHeight,
          pointerEvents: isScrolling ? "none" : undefined,
          width: estimatedTotalWidth
        }
      }));
    }

    // @ts-ignore
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      if (
      // @ts-ignore
      prevProps.columnGetter !== this.props.columnGetter || prevProps.columnCount !== this.props.columnCount || prevProps.columnWidth !== this.props.columnWidth) {
        this._updateFixedColumnsVars();
      }

      // @ts-ignore
      _get(_getPrototypeOf(Grid.prototype), "componentDidUpdate", this).call(this, prevProps, prevState, snapshot);
    }
  }]);
  return Grid;
}(VariableSizeGrid);