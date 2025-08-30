const mongoose=require('mongoose');

const CourseSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,"Please add a course title"]
    },
    description:{
        type:String,
        required:[true,"Please add a description"]
    },
    weeks:{
        type:String,
        required:[true,"Please add a number of weeks"]
    },
    tuition:{
        type:Number,
        required:[true,"Please add a tuition cost"]
    },
    minimumSkill:{
        type:String,
        required:[true,"Please add a minimum skill"],
        enum:['beginner','intermediate','advanced']
    },
    scholarhipsAvailable:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
})
//static method to get average of course tuition
CourseSchema.statics.getAverageCost=async function(bootcampid){
    console.log("Calculating avg cost...".blue);
    const obj=await this.aggregate([
        {
            $match:{bootcamp:bootcampid}
        },
        {
            $group:{
                _id:"$bootcamp",
                averageCost:{ $avg:'$tuition' }
            }
        }
    ])
    console.log(obj)
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampid,{
            averageCost:Math.ceil(obj[0].averageCost/10)*10
        })
    } catch (error) {
        console.error(error)
    }

}
//call getaverage cost after remove
CourseSchema.post('save',function(){
    this.constructor.getAverageCost(this.bootcamp)
})
//call getaverage cost before remove
CourseSchema.pre('remove',function(){
    this.constructor.getAverageCost(this.bootcamp)

})


module.exports=mongoose.model('Course',CourseSchema);