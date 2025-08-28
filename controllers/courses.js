const Course = require("../models/Course");
const ErrorResponse = require("../utills/errorResponse");
const asyncHandler = require("../middleware/async");

//@desc get courses
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcampid/courses
//access private

exports.getCourses=asyncHandler(async (req,res,next)=>{
    let query;
    if(req.params.bootcamp){
        query=Course.find({bootcamp:req.params.bootcamp}).populate({
            path:'bootcamp',
            select:'name description'
        })
    }else{
        query=Course.find()
    }

    const courses=await query;

    res.status(200).json({
        succes:true,
        count:courses.length,
        data:courses
    })
})

