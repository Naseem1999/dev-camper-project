const dotenv=require('dotenv')
const path=require('path')
const express=require('express')
// const logger=require('./middleware/logger')
const morgan=require('morgan')
const colors=require('colors')
const fileUpload=require('express-fileupload')
const errorHandler=require('./middleware/error')
const connectDb=require('./config/db')
dotenv.config({path:'./config/config.env'})
//consect database
connectDb();
const app=express();
//express body parser
app.use(express.json())

// app.use(logger)
//Dev logging middleware
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}
//file uploading
app.use(fileUpload())
//set static folder
app.use(express.static(path.join(__dirname,'public')))

//Mount Routers
app.use('/api/v1/bootcamps',require('./routes/bootcamp'))
app.use('/api/v1/courses',require('./routes/courses'))
app.use('/api/v1/auth',require('./routes/auth'))

app.use(errorHandler)
const PORT=process.env.PORT;

const server=app.listen(PORT,()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on Port ${PORT}`.yellow.bold)
})

//handle unhandled promise regections
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error:${err.message}`.red.underline.bold)
    server.close(()=>process.exit(1))
})