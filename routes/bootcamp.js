const express=require('express')
//include other resource router
const courseRouter=require('./courses')
const {getBootCamp,getBootCamps,createBootCamp,updateBootCamp,deleteBootCamp,getBootCampInRadius,bootcampPhotoUpload} =require('../controllers/bootcamps')
const advancedResults=require('../middleware/advanceResult');
const BootCamp=require('../models/BootCamp')
const {protect}=require('../middleware/auth')
const router=express.Router()
//re-route into other resource route
router.use('/:bootcampid/courses',courseRouter)


router.route('/radius/:zipcode/:distance').get(getBootCampInRadius)
router.route('/').get(advancedResults(BootCamp,'courses'),getBootCamps).post(protect,createBootCamp);
router.route('/:id').get(getBootCamp).put(protect,updateBootCamp).delete(protect,deleteBootCamp)
router.route('/:id/photo').put(protect,bootcampPhotoUpload)
module.exports=router