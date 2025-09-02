const express=require('express')
const {getReviews} =require('../controllers/reviews')
const advancedResults=require('../middleware/advanceResult');
const Review=require('../models/Review')
const router=express.Router({mergeParams:true})
const {protect,autorize }=require('../middleware/auth')

router.route('/').get(advancedResults(Review,{
    path:'bootcamp',
    select:'name description'
}),getReviews)


module.exports=router