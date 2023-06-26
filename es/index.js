import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["ref", "dataSource", "className", "columns", "rowHeight", "scroll", "gridRef", "outerGridRef", "onScroll", "onChange", "components", "locale", "showHeader", "rerenderFixedColumnOnHorizontalScroll", "rowSelection"];
import React from "react";
import { ConfigProvider, Empty, Table } from "antd";
import { Checkbox } from "antd";
import { useCallback, useMemo, useRef, useState } from "react";
import { Grid } from "./components/Grid";
import { assignRef, classNames } from "./utils";
import { isFunction, refSetter } from "./utils";
import { sumColumnWidths, sumRowsHeights } from "./utils";
import { MemonableVirtualTableCell } from "./components/Cell";
import { useSelections, useDebounceEffect } from "ahooks";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export var VirtualTable = function VirtualTable(props) {
  var _ref = props.ref,
    dataSource = props.dataSource,
    className = props.className,
    originColumns = props.columns,
    _props$rowHeight = props.rowHeight,
    rowHeight = _props$rowHeight === void 0 ? 54 : _props$rowHeight,
    scroll = props.scroll,
    gridRef = props.gridRef,
    outerGridRef = props.outerGridRef,
    onScroll = props.onScroll,
    onChange = props.onChange,
    components = props.components,
    locale = props.locale,
    showHeader = props.showHeader,
    rerenderFixedColumnOnHorizontalScroll = props.rerenderFixedColumnOnHorizontalScroll,
    rowSelection = props.rowSelection,
    tableProps = _objectWithoutProperties(props, _excluded);
  var columns = _toConsumableArray(originColumns);
  var tableRef = useRef(null);
  var internalGridRef = useRef(null);
  var _useState = useState(function () {
      return {
        get scrollLeft() {
          if (internalGridRef.current) {
            var _internalGridRef$curr;
            // @ts-ignore
            return (_internalGridRef$curr = internalGridRef.current) === null || _internalGridRef$curr === void 0 ? void 0 : _internalGridRef$curr.state.scrollLeft;
          }
          return 0;
        },
        set scrollLeft(value) {
          if (internalGridRef.current) {
            // @ts-ignore
            var currentScrollLeft = internalGridRef.current.state.scrollLeft;
            if (currentScrollLeft == value) {
              return;
            }
            internalGridRef.current.scrollTo({
              scrollLeft: value
            });
          }
        }
      };
    }),
    _useState2 = _slicedToArray(_useState, 1),
    connectObject = _useState2[0];
  var rowKey = "key";
  if (typeof props.rowKey === "string") {
    rowKey = props.rowKey;
  }
  var _useSelections = useSelections((dataSource === null || dataSource === void 0 ? void 0 : dataSource.map(function (e) {
      return e[rowKey];
    })) || [], (rowSelection === null || rowSelection === void 0 ? void 0 : rowSelection.selectedRowKeys) || []),
    selected = _useSelections.selected,
    allSelected = _useSelections.allSelected,
    isSelected = _useSelections.isSelected,
    toggle = _useSelections.toggle,
    toggleAll = _useSelections.toggleAll,
    partiallySelected = _useSelections.partiallySelected;
  var selectionTitle = useMemo(function () {
    return /*#__PURE__*/_jsx(Checkbox, {
      onClick: toggleAll,
      checked: allSelected,
      indeterminate: partiallySelected
    });
  }, [toggleAll, allSelected, partiallySelected]);
  if (rowSelection && rowKey) {
    columns.unshift({
      title: selectionTitle,
      width: rowSelection.columnWidth ? +rowSelection.columnWidth : 60,
      fixed: rowSelection.fixed,
      dataIndex: rowKey,
      render: function render(val) {
        return /*#__PURE__*/_jsx(Checkbox, {
          checked: isSelected(val),
          onClick: function onClick() {
            return toggle(val);
          }
        });
      }
    });
  }
  useDebounceEffect(function () {
    if (!(rowSelection !== null && rowSelection !== void 0 && rowSelection.onChange) || !(dataSource !== null && dataSource !== void 0 && dataSource.length)) {
      return;
    }
    rowSelection.onChange(selected, dataSource.filter(function (e) {
      return selected.includes(e[rowKey]);
    }), {
      type: "none"
    });
  }, [selected, dataSource], {
    wait: 100
  });
  var fixStickyHeaderOffset = useCallback(function (tableWrap) {
    // Данная функция нужна для поддержки overlap свойства колонки
    // Исправляем смещение для sticky колонок
    // Так же исправим баг связанный с таблицей

    if (showHeader === false || components !== null && components !== void 0 && components.header) {
      return;
    }
    if (tableWrap) {
      var header = tableWrap.querySelector(".ant-table .ant-table-header");
      if (header) {
        var headerCells = header.querySelectorAll(".ant-table-thead .ant-table-cell");
        var totalWidth = 0;
        for (var headerIndex = 0; headerIndex < headerCells.length; headerIndex++) {
          var cell = headerCells[headerIndex];
          var width = cell.getBoundingClientRect().width;
          totalWidth += width;
        }

        // TODO: Возможно пользователь задал свое значение, тут надо подумать...
        header.style.maxWidth = "".concat(totalWidth, "px");
        var leftOffset = 0;
        var rightOffset = 0;
        for (var _headerIndex = 0; _headerIndex < headerCells.length; _headerIndex++) {
          var _cell = headerCells[_headerIndex];
          if (_cell.classList.contains("ant-table-cell-fix-left")) {
            var _width = _cell.getBoundingClientRect().width;
            _cell.style.left = "".concat(leftOffset, "px");
            leftOffset += _width;
            continue;
          }
          break;
        }
        for (var _headerIndex2 = headerCells.length - 1; _headerIndex2 > -1; _headerIndex2--) {
          var _cell2 = headerCells[_headerIndex2];
          if (_cell2.classList.contains("ant-table-cell-fix-right")) {
            var _width2 = _cell2.getBoundingClientRect().width;
            _cell2.style.right = "".concat(rightOffset, "px");
            rightOffset += _width2;
            continue;
          }
          break;
        }
      }
    }
  }, [components === null || components === void 0 ? void 0 : components.header, showHeader]);
  var reset = useCallback(function () {
    var _internalGridRef$curr2;
    var columnIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var rowIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    fixStickyHeaderOffset(tableRef.current);
    if (scroll.scrollToFirstRowOnChange) {
      connectObject.scrollLeft = 0;
    }
    (_internalGridRef$curr2 = internalGridRef.current) === null || _internalGridRef$curr2 === void 0 ? void 0 : _internalGridRef$curr2.resetAfterIndices({
      columnIndex: columnIndex,
      rowIndex: rowIndex,
      shouldForceUpdate: true
    });
  }, [scroll.scrollToFirstRowOnChange, connectObject, fixStickyHeaderOffset]);
  useDebounceEffect(reset, [originColumns], {
    wait: 500
  });
  var handleChange = useCallback(function (pagination, filters, sorter, extra) {
    fixStickyHeaderOffset(tableRef.current);
    if (onChange) {
      onChange(pagination, filters, sorter, extra);
    }
    if (scroll.scrollToFirstRowOnChange) {
      reset();
    }
  }, [scroll.scrollToFirstRowOnChange, onChange, reset, fixStickyHeaderOffset]);
  var _useMemo = useMemo(function () {
      var blockBuffer = 0;
      var normalizeColumns = [];
      var normalizeIndexes = [];
      columns.forEach(function (column, index) {
        var _column$overlap;
        if (blockBuffer > 1) {
          blockBuffer--;
          return;
        }
        blockBuffer = (_column$overlap = column.overlap) !== null && _column$overlap !== void 0 ? _column$overlap : 0;
        normalizeColumns.push(column);
        normalizeIndexes.push(index);
      });
      var getColumn = function getColumn(index) {
        return normalizeColumns[index];
      };
      var cellRender = function cellRender(props) {
        var columnIndex = props.columnIndex;
        var originalColumnIndex = normalizeIndexes[columnIndex];
        var column = normalizeColumns[columnIndex];
        return /*#__PURE__*/_jsx(MemonableVirtualTableCell, _objectSpread(_objectSpread({}, props), {}, {
          originalColumnIndex: originalColumnIndex,
          column: column
        }));
      };
      return [normalizeColumns, normalizeIndexes, getColumn, cellRender];
    }, [columns]),
    _useMemo2 = _slicedToArray(_useMemo, 4),
    normalizeColumns = _useMemo2[0],
    normalizeIndexes = _useMemo2[1],
    getColumn = _useMemo2[2],
    cellRender = _useMemo2[3];
  var rowHeightGetterByRecord = useMemo(function () {
    return isFunction(rowHeight) ? rowHeight : function () {
      return rowHeight;
    };
  }, [rowHeight]);
  var _React$useContext = React.useContext(ConfigProvider.ConfigContext),
    renderEmpty = _React$useContext.renderEmpty;
  var emptyNode = useMemo(function () {
    var emptyText = locale && locale.emptyText || (renderEmpty === null || renderEmpty === void 0 ? void 0 : renderEmpty("Table")) || /*#__PURE__*/_jsx(Empty, {
      image: Empty.PRESENTED_IMAGE_SIMPLE
    });
    var emptyNode = typeof emptyText === "function" ? emptyText() : emptyText;
    return /*#__PURE__*/_jsx("div", {
      className: "virtual-grid-empty",
      children: emptyNode
    });
  }, [locale === null || locale === void 0 ? void 0 : locale.emptyText, renderEmpty]);
  var bodyRender = useCallback(function (rawData, info) {
    var ref = info.ref,
      scrollbarSize = info.scrollbarSize,
      tableOnScroll = info.onScroll;
    assignRef(connectObject, ref);
    fixStickyHeaderOffset(tableRef.current);
    var rowHeightGetter = function rowHeightGetter(index) {
      return rowHeightGetterByRecord(rawData[index]);
    };
    var totalHeight = sumRowsHeights(rowHeightGetter, rawData, rawData.length - 1);
    var columnWidthGetter = function columnWidthGetter(index) {
      var column = normalizeColumns[index];
      var width = column.width,
        overlap = column.overlap;
      if (overlap && overlap > 0) {
        var blockedWidth = width;
        var lastBlockedIndex = normalizeIndexes[index];
        for (var overlapIndex = 1; overlapIndex < overlap; overlapIndex++) {
          lastBlockedIndex++;
          blockedWidth += columns[lastBlockedIndex].width;
        }
        return lastBlockedIndex === columns.length - 1 ? blockedWidth - scrollbarSize : blockedWidth;
      }
      return totalHeight >= scroll.y && index === normalizeColumns.length - 1 ? width - scrollbarSize : width;
    };
    var totalWidth = sumColumnWidths(columnWidthGetter, normalizeColumns.length - 1);
    var handleScroll = function handleScroll(props) {
      if (tableOnScroll) {
        tableOnScroll({
          scrollLeft: props.scrollLeft
        });
      }
      if (onScroll) {
        onScroll(props);
      }
    };
    var hasData = rawData.length > 0;
    return /*#__PURE__*/_jsxs("div", {
      className: "virtual-grid-wrap",
      children: [!hasData && emptyNode, /*#__PURE__*/_jsx(Grid, {
        useIsScrolling: true,
        ref: refSetter(gridRef, internalGridRef),
        outerRef: refSetter(outerGridRef),
        className: "virtual-grid",
        rerenderFixedColumnOnHorizontalScroll: rerenderFixedColumnOnHorizontalScroll,
        estimatedColumnWidth: totalWidth / normalizeColumns.length,
        estimatedRowHeight: totalHeight / rawData.length,
        width: scroll.x,
        height: scroll.y,
        columnCount: normalizeColumns.length,
        rowCount: rawData.length,
        rowHeight: rowHeightGetter,
        columnWidth: columnWidthGetter
        // @ts-ignore
        ,
        itemData: rawData,
        columnGetter: getColumn,
        onScroll: handleScroll,
        children: cellRender
      })]
    });
  }, [fixStickyHeaderOffset, rowHeightGetterByRecord, rerenderFixedColumnOnHorizontalScroll, normalizeIndexes, normalizeColumns, columns, scroll.x, scroll.y, getColumn, onScroll, cellRender, emptyNode]);
  React.useEffect(function () {
    fixStickyHeaderOffset(tableRef.current);
  }, [fixStickyHeaderOffset, scroll.x, scroll.y, scroll.scrollToFirstRowOnChange, columns, showHeader, components === null || components === void 0 ? void 0 : components.header]);
  return /*#__PURE__*/_jsx(Table, _objectSpread(_objectSpread({}, tableProps), {}, {
    ref: function ref(el) {
      assignRef(el, _ref, tableRef);
      fixStickyHeaderOffset(el);
    },
    locale: locale,
    showHeader: showHeader,
    className: classNames("virtual-table", className),
    columns: columns,
    dataSource: dataSource,
    scroll: scroll,
    components: _objectSpread(_objectSpread({}, components), {}, {
      body: bodyRender
    }),
    onChange: handleChange
  }));
};