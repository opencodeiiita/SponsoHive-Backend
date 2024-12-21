const { paginate } = require('../../utils/pagination');

describe('Pagination Logic', () => {
  test('Paginate items correctly', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = paginate(items, 2, 4);
    expect(result).toEqual({
      currentPage: 2,
      pageSize: 4,
      totalItems: 10,
      totalPages: 3,
      data: [5, 6, 7, 8],
    });
  });

  test('Handle empty items array', () => {
    const result = paginate([], 1, 4);
    expect(result).toEqual({
      currentPage: 1,
      pageSize: 4,
      totalItems: 0,
      totalPages: 0,
      data: [],
    });
  });

  test('Handle out-of-bound page numbers', () => {
    const items = [1, 2, 3];
    const result = paginate(items, 5, 2);
    expect(result).toEqual({
      currentPage: 5,
      pageSize: 2,
      totalItems: 3,
      totalPages: 2,
      data: [],
    });
  });
});
