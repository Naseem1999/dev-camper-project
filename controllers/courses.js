const Course = require("../models/Course");
const ErrorResponse = require("../utills/errorResponse");
const asyncHandler = require("../middleware/async");
const BootCamp = require("../models/BootCamp");

//@desc get courses
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcampid/courses
//access private

exports.getCourses=asyncHandler(async (req,res,next)=>{
    if(req.params.bootcampid){
        const courses=await Course.find({bootcamp:req.params.bootcampid})
        res.status(200).json({
            success:true,
            count:courses.length,
            data:courses
        })
    }else{
        res.status(200).json(res.advancedResult);
    }

    
})
//@desc get single course
//@route GET /api/v1/courses/:id
//access private

exports.getSingleCourse=asyncHandler(async (req,res,next)=>{
    const course=await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    })
    if(!course){
        return next(
            new ErrorResponse(`No course with the id of ${req.params.id}`,404)
        )
    }
    res.status(200).json({
        succes:true,
        data:course
    })
})
//@desc Add a Course
//@route POST /api/v1/bootcamps/:bootcampid/courses
//access private

exports.addCourse=asyncHandler(async (req,res,next)=>{

    req.body.bootcamp=req.params.bootcampid;

    const bootcamp=await BootCamp.findById(req.params.bootcampid)
    if(!bootcamp){
        return next(
            new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampid}`,404)
        )
    }
    const course=await Course.create(req.body)
    res.status(200).json({
        succes:true,
        data:course
    })
})
//@desc update Course
//@route PUT /api/v1/courses/:id
//access private

exports.updateCourse=asyncHandler(async (req,res,next)=>{
    let course=await Course.findById(req.params.id)
    if(!course){
        return next(
            new ErrorResponse(`No course with the id of ${req.params.id}`,404)
        )
    }
    course=await Course.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    res.status(200).json({
        succes:true,
        data:course
    })
})
//@desc delete Course
//@route DELETE /api/v1/courses/:id
//access private

exports.deleteCourse=asyncHandler(async (req,res,next)=>{
    let course=await Course.findById(req.params.id)
    if(!course){
        return next(
            new ErrorResponse(`No course with the id of ${req.params.id}`,404)
        )
    }
   await course.deleteOne()
    res.status(200).json({
        succes:true,
        data:{}
    })
})

