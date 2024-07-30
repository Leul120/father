const mongoose=require('mongoose')


const connectDB=(url)=>{
    return mongoose.connect(url,{
        connectTimeoutMS: 60000
    })
}
module.exports=connectDB