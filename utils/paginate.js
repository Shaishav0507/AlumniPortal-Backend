const setPaginationFunction = (totalCount, itemsPerPage, currentCount = 0, currentPage) => {
    const hasMoreItems = (totalCount - (itemsPerPage * currentPage));
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const paginateObj = {};
    paginateObj.totalItems = totalCount;
    paginateObj.currentCount = currentCount > 0 ? currentCount : (itemsPerPage > totalCount ? totalCount : itemsPerPage);
    paginateObj.itemsPerPage = itemsPerPage;
    paginateObj.currentPage = currentPage;
    paginateObj.hasNextPage = hasMoreItems > 0 ? true : false;
    paginateObj.hasPreviousPage = (currentPage > 1) ? true : false;
    paginateObj.totalPages = totalPages;

    return paginateObj;
}

module.exports = {
    setPagination: setPaginationFunction
};