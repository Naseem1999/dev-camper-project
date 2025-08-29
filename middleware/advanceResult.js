const advancedResult=(model,populate)=>async(req,res,next)=>{
  let query;
  //copy req.query
  let reqQuery = { ...req.query };
  //    let queryObj = qs.parse(reqQuery);

  //    console.log(queryObj)

  const removeFeilds = ["select", "sort",'page','limit'];
  // Parse query string properly
  //   let queryObj = qs.parse(req.query);
  //loop over remove feilds and delete them from redQuery
  removeFeilds.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  // Add $ before MongoDB operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = model.find(JSON.parse(queryStr))

  //select all feilds
  console.log(req.query.select);
  if (req.query.select) {
    const feilds = req.query.select.split(",").join(" ");
    query = query.select(feilds);
  }
  //sort

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex=page*limit;
  const total=await model.countDocuments();


  query = query.skip(startIndex).limit(limit);
  if(populate){
    query=query.populate(populate)
  }

  // Execute query AFTER all modifications 
  const results = await query;

  //pagination result
  const pagination={};
  if(endIndex<total){
    pagination.next={
        page:page+1,
        limit
    }
  }
  if(startIndex>0){
    pagination.prev={
        page:page-1,
        limit
    }
  }
 res.advancedResult={
    success:true,
    count:results.length,
    pagination,
    data:results
 }
 next();

}


module.exports=advancedResult;