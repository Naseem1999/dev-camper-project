const express=require('express')
const router=express.Router()
const {register,loginUser,getMe}=require('../controllers/auth')
const {protect}=require('../middleware/auth')
router.route('/register').post(register)
router.post('/login',loginUser)
router.get('/me',protect,getMe)



module.exports=router