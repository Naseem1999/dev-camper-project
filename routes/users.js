const express=require('express')
const router=express.Router()
const {getUser,getUsers,createUser,updateUser,deleteUser}=require('../controllers/users')
const {protect,autorize}=require('../middleware/auth')
const User=require('../models/User')
const advancedResults=require('../middleware/advanceResult')

router.use(protect);
router.use(autorize('admin'));

router.route('/').get(advancedResults(User),getUsers).post(createUser)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)
module.exports=router