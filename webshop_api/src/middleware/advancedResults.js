const advancedResults =
  (model, populate, hideDeleted) => async (req, res, next) => {
    //?categoryId=123&price[gt]=50&select=name,averageRating&sort=-name,averageRating&page=1&limit=1
    let query;

    const reqQuery = { ...req.query };
    const fieldsToRemove = ['select', 'sort', 'page', 'limit'];
    fieldsToRemove.forEach((param) => delete reqQuery[param]);

    //reqQuery now only has ?categoryId=123&price[gt]=50 -> fields to filter
    //req.query still has original full query string

    //hideDeleted -> used to hide "isDeleted:true" results in schemas with that field
    if (hideDeleted) {
      reqQuery.isDeleted = false;
    }

    let queryStr = JSON.stringify(reqQuery);

    // Replace gt, gte, lt, lte, in with $gt, $gte, $lt, $lte, $in
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    //FILTER
    query = model.find(JSON.parse(queryStr));

    //SELECT
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    //SORT
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //PAGINATION
    const page = parseInt(req.query.page, 10) || 1; //page number
    const limit = parseInt(req.query.limit, 10) || 50; //results per page
    const startIndex = (page - 1) * limit; //page=3, limit=2 -> skips first 4
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //POPULATE
    if (populate) {
      query = query.populate(populate);
    }

    //Executing query in db
    const results = await query;

    //Pagination result object
    const pagination = {};

    //Pagination object for next page
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit: limit,
      };
    }

    //Pagination object for previous page
    if (startIndex > 0 && startIndex < total) {
      pagination.prev = {
        page: page - 1,
        limit: limit,
      };
    }

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };

    next();
  };

module.exports = advancedResults;
