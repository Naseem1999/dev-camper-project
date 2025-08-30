const express=require('express')
//include other resource router
const courseRouter=require('./courses')
const {getBootCamp,getBootCamps,createBootCamp,updateBootCamp,deleteBootCamp,getBootCampInRadius,bootcampPhotoUpload} =require('../controllers/bootcamps')
const advancedResults=require('../middleware/advanceResult');
const BootCamp=require('../models/BootCamp')
const {protect,autorize}=require('../middleware/auth')
const router=express.Router()
//re-route into other resource route
router.use('/:bootcampid/courses',courseRouter)


router.route('/radius/:zipcode/:distance').get(getBootCampInRadius)
router.route('/').get(advancedResults(BootCamp,'courses'),getBootCamps).post(protect,autorize('publisher','admin'),createBootCamp);
router.route('/:id').get(getBootCamp).put(protect,autorize('publisher','admin'),updateBootCamp).delete(protect,autorize('publisher','admin'),deleteBootCamp)
router.route('/:id/photo').put(protect,autorize('publisher','admin'),bootcampPhotoUpload)
module.exports=router