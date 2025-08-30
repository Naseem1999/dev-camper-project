const express=require('express')
const {getCourses,getSingleCourse,addCourse,updateCourse,deleteCourse} =require('../controllers/courses')
const advancedResults=require('../middleware/advanceResult');
const Course=require('../models/Course')
const router=express.Router({mergeParams:true})
const {protect,autorize }=require('../middleware/auth')

router.route('/').get(advancedResults(Course,{
    path:'bootcamp',
    select:'name description'
}),getCourses).post(protect,autorize('publisher','admin'),addCourse)
router.route('/:id').get(getSingleCourse).put(protect,autorize('publisher','admin'),updateCourse).delete(protect,autorize('publisher','admin'),deleteCourse)

module.exports=router