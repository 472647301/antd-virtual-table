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

export function tableSize(h = 0) {
  return [window.innerWidth - 30, window.innerHeight - (150 + h)];
}
