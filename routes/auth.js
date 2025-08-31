const express=require('express')
const router=express.Router()
const {register,loginUser,getMe,forgotPassword,resetPassword,updateDetails,updatePassword}=require('../controllers/auth')
const {protect}=require('../middleware/auth')
router.route('/register').post(register)
router.post('/login',loginUser)
router.get('/me',protect,getMe)
router.post('/forgotpassword',forgotPassword)
router.put('/resetpassword/:resettoken',resetPassword)
router.put('/updatedetails',protect,updateDetails)
router.put('/updatepassword',protect,updatePassword)



module.exports=router