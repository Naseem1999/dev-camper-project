const express=require('express')
//include other resource router
const courseRouter=require('./courses')
const {getBootCamp,getBootCamps,createBootCamp,updateBootCamp,deleteBootCamp,getBootCampInRadius,bootcampPhotoUpload} =require('../controllers/bootcamps')
const router=express.Router()
//re-route into other resource route
router.use('/:bootcampid/courses',courseRouter)


router.route('/radius/:zipcode/:distance').get(getBootCampInRadius)
router.route('/').get(getBootCamps).post(createBootCamp);
router.route('/:id').get(getBootCamp).put(updateBootCamp).delete(deleteBootCamp)
router.route('/:id/photo').put(bootcampPhotoUpload)
module.exports=router