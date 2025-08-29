const User = require("../models/User");
const ErrorResponse = require("../utills/errorResponse");
const asyncHandler = require("../middleware/async");
//@desc Register user
//@route POST /api/v1/auth/register
//access public

exports.register=asyncHandler(async(req,res,next)=>{
    const {name,email,password,role}=req.body;
    const user=await User.create({
        name,
        email,
        password,
        role
    })
    const token=user.getSignedJwtToken()
    res.status(200).json({
        success:true,
        token
    })
})

//@desc Login user
//@route POST /api/v1/auth/login
//access public

exports.loginUser=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return next(
            new ErrorResponse('please Provide an email and password',400)
        )
    }
    //check for user
    const user=await User.findOne({email}).select('+password');

    if(!user){
         return next(
            new ErrorResponse('Invalid credentials',401)
        )
    }
    //check if password matches
    const ismatch=await user.matchPassword(password)

    if(!ismatch){
         return next(
            new ErrorResponse('Invalid credentials',401)
        )
    }
    const token=user.getSignedJwtToken()

    res.status(200).json({
        success:true,
        token,
        data:user
    })
})