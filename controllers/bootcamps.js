const BootCamp=require('../models/BootCamp');
const ErrorResponse = require('../utills/errorResponse');
const asyncHandler=require("../middleware/async")
//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//access private

exports.getBootCamps=asyncHandler(async(req,res,next)=>{
    
        const bootcamps=await BootCamp.find();
        res.status(200).json({success:true,count:bootcamps.length,data:bootcamps})
    
})
//@desc get single bootcamp
//@route GET /api/v1/bootcamps/:id
//access private
exports.getBootCamp=asyncHandler(async(req,res,next)=>{
    
        const bootcamp=await BootCamp.findById(req.params.id);
        if(!bootcamp){
            return next(
            new ErrorResponse(`Bootcamp not Found with id of ${req.params.id}`,404)
            )  

        }
        res.status(200).json({success:true,data:bootcamp})
    
})
//@desc create new bootcamp
//@route POST /api/v1/bootcamps
//access private
exports.createBootCamp=asyncHandler(async(req,res,next)=>{
   
         const bootcamp=await BootCamp.create(req.body)
         res.status(201).json({success:true,data:bootcamp})
  
})
//@desc Update bootcamp
//@route PUT /api/v1/bootcamps/:id
//access private
exports.updateBootCamp=asyncHandler(async(req,res,next)=>{
     const bootcamp=await BootCamp.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    if(!bootcamp){
         return next(
            new ErrorResponse(`Bootcamp not Found with id of ${req.params.id}`,404)
            )  

    }
    res.status(200).json({success:true,data:bootcamp})
})
//@desc delete bootcamp
//@route DELETE /api/v1/bootcamps/:id
//access private
exports.deleteBootCamp=asyncHandler(async(req,res,next)=>{
     const bootcamp=await BootCamp.findByIdAndDelete(req.params.id)
    if(!bootcamp){
        return next(
            new ErrorResponse(`Bootcamp not Found with id of ${req.params.id}`,404)
            )  
    }
    res.status(200).json({success:true,data:bootcamp})
})