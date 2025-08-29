const express=require('express')
const router=express.Router()
const {register,loginUser}=require('../controllers/auth')
router.route('/register').post(register)
router.post('/login',loginUser)


module.exports=router