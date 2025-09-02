const Course = require("../models/Course");
const ErrorResponse = require("../utills/errorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const BootCamp = require("../models/BootCamp");

//@desc get Reviews
//@route GET /api/v1/reviews
//@route GET /api/v1/bootcamps/:bootcampid/reviews
//access public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampid) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampid });
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResult);
  }
});

//@desc get single reviews
//@route GET /api/v1/reviews/:id
//access public

exports.getSingleReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(
      new ErrorResponse(`No review  with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    succes: true,
    data: review,
  });
});
//@desc Add Review
//@route POST /api/v1/bootcamps/:bootcampid/reviews
//access private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.bootcamp = req.params.bootcampid;

  const bootcamp = await BootCamp.findById(req.params.bootcampid);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampid}`,
        404
      )
    );
  }
  const review = await Review.create(req.body);
  res.status(200).json({
    succes: true,
    data: review,
  });
});