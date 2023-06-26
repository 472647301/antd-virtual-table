import _typeof from "@babel/runtime/helpers/esm/typeof";
export var getItemMetadata = function getItemMetadata(itemType, props, index, instanceProps) {
  var itemMetadataMap, itemSize, lastMeasuredIndex;
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
    var offset = 0;
    if (lastMeasuredIndex >= 0) {
      var itemMetadata = itemMetadataMap[lastMeasuredIndex];
      offset = itemMetadata.offset + itemMetadata.size;
    }
    for (var i = lastMeasuredIndex + 1; i <= index; i++) {
      var _size = itemSize(i);
      itemMetadataMap[i] = {
        offset: offset,
        size: _size
      };
      offset += _size;
    }
    if (itemType === "column") {
      instanceProps.lastMeasuredColumnIndex = index;
    } else {
      instanceProps.lastMeasuredRowIndex = index;
    }
  }
  return itemMetadataMap[index];
};
export var getEstimatedTotalHeight = function getEstimatedTotalHeight(_ref, _ref2) {
  var rowCount = _ref.rowCount;
  var rowMetadataMap = _ref2.rowMetadataMap,
    estimatedRowHeight = _ref2.estimatedRowHeight,
    lastMeasuredRowIndex = _ref2.lastMeasuredRowIndex;
  var totalSizeOfMeasuredRows = 0;

  // Edge case check for when the number of items decreases while a scroll is in progress.
  // https://github.com/bvaughn/react-window/pull/138
  if (lastMeasuredRowIndex >= rowCount) {
    lastMeasuredRowIndex = rowCount - 1;
  }
  if (lastMeasuredRowIndex >= 0) {
    var itemMetadata = rowMetadataMap[lastMeasuredRowIndex];
    totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
  }
  var numUnmeasuredItems = rowCount - lastMeasuredRowIndex - 1;
  var totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedRowHeight;
  return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};
export var getEstimatedTotalWidth = function getEstimatedTotalWidth(_ref3, _ref4) {
  var columnCount = _ref3.columnCount;
  var columnMetadataMap = _ref4.columnMetadataMap,
    estimatedColumnWidth = _ref4.estimatedColumnWidth,
    lastMeasuredColumnIndex = _ref4.lastMeasuredColumnIndex;
  var totalSizeOfMeasuredRows = 0;

  // Edge case check for when the number of items decreases while a scroll is in progress.
  // https://github.com/bvaughn/react-window/pull/138
  if (lastMeasuredColumnIndex >= columnCount) {
    lastMeasuredColumnIndex = columnCount - 1;
  }
  if (lastMeasuredColumnIndex >= 0) {
    var itemMetadata = columnMetadataMap[lastMeasuredColumnIndex];
    totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
  }
  var numUnmeasuredItems = columnCount - lastMeasuredColumnIndex - 1;
  var totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedColumnWidth;
  return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};
export var getOffsetForIndexAndAlignment = function getOffsetForIndexAndAlignment(itemType, props, index, align, scrollOffset, instanceProps, scrollbarSize, sumOfLeftFixedColumnsWidth, sumOfRightFixedColumnsWidth) {
  var leftOffset = itemType === "column" ? sumOfLeftFixedColumnsWidth : 0;
  var rightOffset = itemType === "column" ? sumOfRightFixedColumnsWidth : 0;
  var size = itemType === "column" ? props.width : props.height;
  var itemMetadata = getItemMetadata(itemType, props, index, instanceProps);

  // Get estimated total size after ItemMetadata is computed,
  // To ensure it reflects actual measurements instead of just estimates.
  var estimatedTotalSize = itemType === "column" ? getEstimatedTotalWidth(props, instanceProps) : getEstimatedTotalHeight(props, instanceProps);
  var maxOffset = Math.max(0, Math.min(estimatedTotalSize - size + leftOffset, itemMetadata.offset - leftOffset));
  var minOffset = Math.max(0, itemMetadata.offset + itemMetadata.size - size + rightOffset + scrollbarSize);
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
export var getOffsetForColumnAndAlignment = function getOffsetForColumnAndAlignment(props, index, align, scrollOffset, instanceProps, scrollbarSize, sumOfLeftFixedColumnsWidth, sumOfRightFixedColumnsWidth) {
  return getOffsetForIndexAndAlignment("column", props, index, align, scrollOffset, instanceProps, scrollbarSize, sumOfLeftFixedColumnsWidth, sumOfRightFixedColumnsWidth);
};
export var getOffsetForRowAndAlignment = function getOffsetForRowAndAlignment(props, index, align, scrollOffset, instanceProps, scrollbarSize, sumOfLeftFixedColumnsWidth, sumOfRightFixedColumnsWidth) {
  return getOffsetForIndexAndAlignment("row", props, index, align, scrollOffset, instanceProps, scrollbarSize, sumOfLeftFixedColumnsWidth, sumOfRightFixedColumnsWidth);
};
export var getRowOffset = function getRowOffset(props, index, instanceProps) {
  return getItemMetadata("row", props, index, instanceProps).offset;
};
export var getRowHeightOrCalculate = function getRowHeightOrCalculate(props, index, instanceProps) {
  return getItemMetadata("row", props, index, instanceProps).size;
};
export var getRowHeight = function getRowHeight(props, index, instanceProps) {
  return instanceProps.rowMetadataMap[index].size;
};
export var getColumnWidth = function getColumnWidth(props, index, instanceProps) {
  return instanceProps.columnMetadataMap[index].size;
};
export var getColumnWidthOrCalculate = function getColumnWidthOrCalculate(props, index, instanceProps) {
  return getItemMetadata("column", props, index, instanceProps).size;
};
var size = -1;

// This utility copied from "dom-helpers" package.
export function getScrollbarSize() {
  var recalculate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (size === -1 || recalculate) {
    var div = document.createElement("div");
    var style = div.style;
    style.width = "50px";
    style.height = "50px";
    style.overflow = "scroll";
    document.body.appendChild(div);
    size = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
  }
  return size;
}
var cachedRTLResult = null;

// TRICKY According to the spec, scrollLeft should be negative for RTL aligned elements.
// Chrome does not seem to adhere; its scrollLeft values are positive (measured relative to the left).
// Safari's elastic bounce makes detecting this even more complicated wrt potential false positives.
// The safest way to check this is to intentionally set a negative offset,
// and then verify that the subsequent "scroll" event matches the negative offset.
// If it does not match, then we can assume a non-standard RTL scroll implementation.
export function getRTLOffsetType() {
  var recalculate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (cachedRTLResult === null || recalculate) {
    var outerDiv = document.createElement("div");
    var outerStyle = outerDiv.style;
    outerStyle.width = "50px";
    outerStyle.height = "50px";
    outerStyle.overflow = "scroll";
    outerStyle.direction = "rtl";
    var innerDiv = document.createElement("div");
    var innerStyle = innerDiv.style;
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
export function isFunction(value) {
  return typeof value === "function" || value && {}.toString.call(value) === "[object Function]";
}
export function isArray(value) {
  return Array.isArray(value);
}
export function sumColumnWidths(columnWidthGetter, index) {
  if (index < 0) {
    return 0;
  }
  if (isFunction(columnWidthGetter)) {
    var sum = 0;
    while (index-- > 0) {
      sum += columnWidthGetter(index);
    }
    return sum;
  }
  return columnWidthGetter + index * columnWidthGetter;
}
export function sumRowsHeights(rowHeightGetter, rows, index) {
  if (index < 0) {
    return 0;
  }
  if (isFunction(rowHeightGetter)) {
    var sum = 0;
    for (; index > -1; index--) {
      sum += rowHeightGetter(index);
    }
    return sum;
  }
  return index * rowHeightGetter;
}
export function assignRef(refValue) {
  for (var i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); i++) {
    var tmpRef = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];
    if (typeof tmpRef === "function") {
      tmpRef(refValue);
    }
    if (_typeof(tmpRef) === "object") {
      tmpRef.current = refValue;
    }
  }
}
export function refSetter() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }
  return function (ref) {
    return assignRef.apply(void 0, [ref].concat(refs));
  };
}
export function mixClassNameSingle(classList1, classList2) {
  return classList1 + (classList2 ? " " + classList2 : "");
}
export var hasOwn = {}.hasOwnProperty;
export function classNames() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  var classes = [];
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (!arg) continue;
    var argType = _typeof(arg);
    if (argType === "string" || argType === "number") {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        var inner = classNames.apply(null, arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === "object") {
      if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
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