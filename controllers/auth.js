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
    sendTokenResponse(user, 200,res)
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
    sendTokenResponse(user, 200,res)
})

//Get token from model create cookie and send response

const sendTokenResponse=(user,statusCode,res)=>{
    const token=user.getSignedJwtToken();
    
    const options = {
  expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE, 10) * 24 * 60 * 60 * 1000),
  httpOnly: true
};

    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token
    })
}