import type { ColumnsState } from "@ant-design/pro-table";

export const columnSort =
  (columnsMap: Record<string, ColumnsState>) => (a: any, b: any) => {
    const { fixed: aFixed, index: aIndex } = a;
    const { fixed: bFixed, index: bIndex } = b;
    if (
      (aFixed === "left" && bFixed !== "left") ||
      (bFixed === "right" && aFixed !== "right")
    ) {
      return -2;
    }
    if (
      (bFixed === "left" && aFixed !== "left") ||
      (aFixed === "right" && bFixed !== "right")
    ) {
      return 2;
    }
    // 如果没有index，在 dataIndex 或者 key 不存在的时候他会报错
    const aKey = a.key || `${aIndex}`;
    const bKey = b.key || `${bIndex}`;
    if (columnsMap[aKey]?.order || columnsMap[bKey]?.order) {
      return (columnsMap[aKey]?.order || 0) - (columnsMap[bKey]?.order || 0);
    }
    return (a.index || 0) - (b.index || 0);
  };

/**
 * 根据 key 和 dataIndex 生成唯一 id
 *
 * @param key 用户设置的 key
 * @param dataIndex 在对象中的数据
 * @param index 序列号，理论上唯一
 */
export const genColumnKey = (key?: any, index?: number | string): string => {
  if (key) {
    return Array.isArray(key) ? key.join("-") : key.toString();
  }
  return `${index}`;
};

const blockLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const blockLetterList = blockLetter.split("");

export function createColumns() {
  return blockLetterList.map((key, i) => {
    return {
      title: key,
      dataIndex: `id_${i}`,
      width: 150,
    };
  });
}

export function tableSize(w = 0, h = 0) {
  return [window.innerWidth - (30 + w), window.innerHeight - (150 + h)];
}
