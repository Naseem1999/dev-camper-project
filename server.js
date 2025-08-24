const dotenv=require('dotenv')
const express=require('express')
// const logger=require('./middleware/logger')
const morgan=require('morgan')
dotenv.config({path:'./config/config.env'})

const app=express();

// app.use(logger)
//Dev logging middleware
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps',require('./routes/bootcamp'))
const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on Port ${PORT}`)
})