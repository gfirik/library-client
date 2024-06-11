export const getRandomElements = <T extends { status: string }>(
  arr: T[],
  num: number
): T[] => {
  const availableBooks = arr.filter((book) => book.status === "Available");
  const shuffled = availableBooks.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};
