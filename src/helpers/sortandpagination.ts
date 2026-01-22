type IOptions = {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: string;
};



  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default sortAndPagination;
