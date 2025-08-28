const BootCamp = require("../models/BootCamp");
const ErrorResponse = require("../utills/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utills/geocoder");
const qs = require("qs");
//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//access private

exports.getBootCamps = asyncHandler(async (req, res, next) => {
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

  query = BootCamp.find(JSON.parse(queryStr)).populate('courses');

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
  const total=await BootCamp.countDocuments();


  query = query.skip(startIndex).limit(limit);

  // Execute query AFTER all modifications
  const bootcamps = await query;

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


  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

//@desc get single bootcamp
//@route GET /api/v1/bootcamps/:id
//access private
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not Found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
//@desc create new bootcamp
//@route POST /api/v1/bootcamps
//access private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});
//@desc Update bootcamp
//@route PUT /api/v1/bootcamps/:id
//access private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not Found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
//@desc delete bootcamp
//@route DELETE /api/v1/bootcamps/:id
//access private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not Found with id of ${req.params.id}`, 404)
    );
  }
  await bootcamp.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

//@desc GET bootcamp within radius
//@route GET /api/v1/bootcamps/radius/:zipcode/:distance
//access private
exports.getBootCampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //calc radius using radians
  //divide distance by radius of earth
  //earth radius =3963 mi/6378km
  const radius = distance / 3963;

  const bootcamps = await BootCamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
