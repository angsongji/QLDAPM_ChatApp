const normalizeString = (str) => {
  return str
    .normalize("NFD") // Tách dấu khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
    .toLowerCase() // Không phân biệt hoa thường
    .trim(); // Xóa khoảng trắng đầu/cuối
};

export const containsNormalized = (source, keyword) => {
  return normalizeString(source).includes(normalizeString(keyword));
};
