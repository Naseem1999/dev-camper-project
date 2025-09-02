const Course = require("../models/Course");
const ErrorResponse = require("../utills/errorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");

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