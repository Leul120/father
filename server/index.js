// IMPORTANT: Load environment variables FIRST before requiring any other modules
require('dotenv').config()

// Verify environment variables are loaded (for debugging)
console.log('Environment check:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '✓ Loaded' : '✗ Missing',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '✓ Loaded' : '✗ Missing',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '✓ Loaded' : '✗ Missing',
  MONGO_URI: process.env.MONGO_URI ? '✓ Loaded' : '✗ Missing',
});

const express=require('express')
const app=express()
const userRoute=require('./routes/userRoute')
const cors=require('cors')
const path=require('path')
const connectDB=require('./db/connectDB')

// Configure express.json() middleware
// Note: express.json() will automatically skip multipart/form-data requests
// because they have a different content-type, so multer can handle them
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
// if (process.env.NODE_ENV === 'production') {
//   // Serve static files from the React build directory
//   app.use(express.static(path.join(__dirname, '../client/public')));

//   // Handle React routing, return all requests to React app
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
//   });
// }
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