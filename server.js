const dotenv=require('dotenv')
const express=require('express')

dotenv.config({path:'./config/config.env'})
const app=express();

const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on Port ${PORT}`)
})