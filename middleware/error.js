const ErrorResponse=require('../utills/errorResponse')
const errorHandler=(err,req,res,next)=>{
    let error={...err};
    error.message=err.message;
    //log to console for dev
    console.log(err.stack.red);
   
    //mongoose bad object id
    if(err.name === "CastError"){
        const message=`Bootcamp not found with id of ${err.value}`;
        error=new ErrorResponse(message,404)
    }
    //Mongoose validation ValidationError
    if(err.name === "ValidationError"){
        const message=Object.values(err.errors).map(val=>val.message);
        error=new ErrorResponse(message,400)
    }
    if(err.code === 11000){
        const message=`Duplicate feild value entered`;
        error=new ErrorResponse(message,400)
    }

    res.status(error.statusCode || 500).json({
        success:false,
        error:error.message || "server Error"
    })
}
module.exports=errorHandler