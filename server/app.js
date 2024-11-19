const express=require('express')
const app=express()
const userRoute=require('./routes/userRoute')
const cors=require('cors')
const connectDB=require('./db/connectDB')
require('dotenv').config()
app.use(express.json())

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Authorization','Accept'],
  credentials: true,
}));

app.use('/api',userRoute)





const hostname='0.0.0.0'
const port = process.env.PORT || 8000;
const start=async ()=>{
    try{ 
        await connectDB(process.env.MONGO_URI)
        app.listen(port ,hostname,
            console.log("running on port: "+port )
        )

    }catch (error){
        console.log(error)
    }
}

start()