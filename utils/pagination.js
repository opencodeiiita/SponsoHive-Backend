/**
 * Paginate an array of items.
 * @param {Array} items - The array to paginate.
 * @param {number} page - The current page number (1-indexed).
 * @param {number} pageSize - Number of items per page.
 * @returns {Object} Paginated results.
 */
function paginate(items, page, pageSize) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
  
    return {
      currentPage: page,
      pageSize,
      totalItems: items.length,
      totalPages: Math.ceil(items.length / pageSize),
      data: items.slice(startIndex, endIndex),
    };
  }
  
  module.exports = { paginate };
  