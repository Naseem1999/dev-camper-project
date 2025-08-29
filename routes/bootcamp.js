const express=require('express')
//include other resource router
const courseRouter=require('./courses')
const {getBootCamp,getBootCamps,createBootCamp,updateBootCamp,deleteBootCamp,getBootCampInRadius,bootcampPhotoUpload} =require('../controllers/bootcamps')
const advancedResults=require('../middleware/advanceResult');
const BootCamp=require('../models/BootCamp')
const router=express.Router()
//re-route into other resource route
router.use('/:bootcampid/courses',courseRouter)


router.route('/radius/:zipcode/:distance').get(getBootCampInRadius)
router.route('/').get(advancedResults(BootCamp,'courses'),getBootCamps).post(createBootCamp);
router.route('/:id').get(getBootCamp).put(updateBootCamp).delete(deleteBootCamp)
router.route('/:id/photo').put(bootcampPhotoUpload)
module.exports=router