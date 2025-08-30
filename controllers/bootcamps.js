const BootCamp = require("../models/BootCamp");
const ErrorResponse = require("../utills/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utills/geocoder");
const path=require('path')
const qs = require("qs");
//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//access private

exports.getBootCamps = asyncHandler(async (req, res, next) => {
  

  res.status(200).json(res.advancedResult)
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
  //add user to req.body
  req.body.user=req.user.id;
  //check for publish bootcamp
  const publishBootCamp=await BootCamp.findOne({user:req.user.id})
  if(publishBootCamp && req.user.role !== 'admin'){
    return next(
      new ErrorResponse(`The user with ID ${req.user.id} has already publish a bootcamp`, 400)
    );
  }
  const bootcamp = await BootCamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});
//@desc Update bootcamp
//@route PUT /api/v1/bootcamps/:id
//access private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await BootCamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not Found with id of ${req.params.id}`, 404)
    );
  }
  //make sure user is bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !=='admin'){
    return next(
      new ErrorResponse(`User ${req.params.id} is not authorize to update this bootcamp`, 401)
    );
  }
  bootcamp=await BootCamp.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
  })
  res.status(200).json({ success: true, data: bootcamp });
});
//@desc delete bootcamp
//@route DELETE /api/v1/bootcamps/:id
//access private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await BootCamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not Found with id of ${req.params.id}`, 404)
    );
  }
   //make sure user is bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !=='admin'){
    return next(
      new ErrorResponse(`User ${req.params.id} is not authorize to Delete this bootcamp`, 401)
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


//@desc upload photo for bootcamp
//@route PUT /api/v1/bootcamps/:id/photo
//access private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not Found with id of ${req.params.id}`, 404)
    );
  }
  //make sure user is bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !=='admin'){
    return next(
      new ErrorResponse(`User ${req.params.id} is not authorize to update this bootcamp`, 401)
    );
  }
  if(!req.files){
     return next(
      new ErrorResponse(`Please upload a file`, 400)
    );
  }
  const file=req.files.file;
  //Make sure the image is photo
  if(!file.mimetype.startsWith('image')){
    return next(
      new ErrorResponse(`Please upload an image file`, 400)
    );
  }

  if(file.size>process.env.MAX_FILE_UPLOAD){
    return next(
      new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400)
    );
  }

  //create custom filename
  file.name=`bootcamp_${bootcamp._id}${path.parse(file.name).ext}`
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async (err)=>{
    if(err){
        console.error(err);
        return next(
         new ErrorResponse(`Probelem with file upload`, 500)
    );
    }
    await BootCamp.findByIdAndUpdate(req.params.id,{photo:file.name})
    res.status(200).json({
        success:true,
        data:file.name
    })
  })
  
});
