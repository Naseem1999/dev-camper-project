const express=require('express')
const {getCourses,getSingleCourse,addCourse,updateCourse,deleteCourse} =require('../controllers/courses')
const advancedResults=require('../middleware/advanceResult');
const Course=require('../models/Course')
const router=express.Router({mergeParams:true})


router.route('/').get(advancedResults(Course,{
    path:'bootcamp',
    select:'name description'
}),getCourses).post(addCourse)
router.route('/:id').get(getSingleCourse).put(updateCourse).delete(deleteCourse)

module.exports=router