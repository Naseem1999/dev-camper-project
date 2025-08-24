//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//access private

exports.getBootCamps=(req,res,next)=>{
    res.status(200).json({success:true,msg:"Show all bootcamps",hello:req.hello})
}
//@desc get single bootcamp
//@route GET /api/v1/bootcamps/:id
//access private
exports.getBootCamp=(req,res,next)=>{
        res.status(200).json({success:true,msg:`get bootcamps ${req.params.id}`})
}
//@desc create new bootcamp
//@route POST /api/v1/bootcamps
//access private
exports.createBootCamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:"create new bootcamps"})
}
//@desc Update bootcamp
//@route PUT /api/v1/bootcamps/:id
//access private
exports.updateBootCamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:`Update bootcamps ${req.params.id}`})
}
//@desc delete bootcamp
//@route DELETE /api/v1/bootcamps/:id
//access private
exports.deleteBootCamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:`delete bootcamps ${req.params.id} `})
}