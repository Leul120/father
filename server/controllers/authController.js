const Users=require('../models/userModel')
const jwt=require('jsonwebtoken')
const catchAsync=require('../utils/catchAsync')
const bcrypt=require('bcrypt')
// const AppError=require('../utils/appError')
const {promisify}=require("util")

const nodemailer = require('nodemailer');
const AppError = require('../utils/appError');

const signToken=(id)=>{
    return jwt.sign({id:id},process.env.JWT_SECRET)
}
let transporter = nodemailer.createTransport({
    service: 'gmail', // Example using Gmail
    auth: {
        user: "tirumelk@gmail.com",
        pass: "bczx ctwp mygj coxd"
    }
});
exports.signup=catchAsync(async (req,res,next)=>{
    const {email,password}=req.body
    const newUser=await Users.create({
        email:email,
        password:password, 
    })
    if(newUser){
        const token=signToken(newUser._id)
        console.log(token)
        res.status(200).json({
            status:"success",
            token,
            data:{user:newUser}
        })
    }else{
        next(new AppError("couldn't create a user",500))
    }
})
exports.login=async (req,res,next)=>{
    console.log(req.body)
    const email=req.body.email
    const password=req.body.password
    const user=await Users.findOne({email:email}).select('+password')

    if(!user || !await user.correctPassword(password,user.password)){
        
       res.status(400).json("incorrect email or password")
    }else{
        const token=signToken(user._id)

        if(req.body.remember){
       await res.cookie('token',token,{
            httpOnly:true,
        })}
        console.log(req.cookies)
        res.status(200).json({
            status:"success",
            token,
            user,
        })
    }
    
}
exports.contactUs=catchAsync(async (req,res)=>{
  let mailOptions = {
    from: req.body.email,
    to: "tirumelk@gmail.com", // List of recipients
    subject: 'Message from contact us page of the website', // Subject line
    text: 'Greetings.', // Plain text body
    html: `
        <p>Email from ${req.body.firstName} ${req.body.lastName} with email:${req.body.email}</p>
        you can contact the user with ${req.body.phoneNumber}
        <p>Description:
          ${req.body.description}
        </p>
        
        <p>Thanks</p>
    `
};
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        res.status(400).json({
            error,
            status:400,
            message:"An Error Occurred"})
        console.log(error)
    }
    console.log('Email sent successfully:', info.response);
    res.status(200).json({status:200,
        message:"Email sent successfully, Please check your email to verify and please check the spams folder in your email if you don't find it in your inbox"})
    });
})   

exports.protect=async(req,res,next)=>{
    try{
        
      
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1]
        // console.log(token)
    }

    if(!token){
       
        return res.status(401).json({ message: 'You are not logged in! Please log in to get access' });
    }
    const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    const currentUser=await Users.findById(decoded.id)
    if(!currentUser){
        // return next(new AppError('The user belonging to this token does no longer exist.',401))
        return res.status(401).json({ message: 'User does not exist!' });

    }
    req.user=currentUser
    next()
}catch(error){
    res.status(400).json(error.message)
}
}
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next(); // Proceed if role is allowed
  };
};
// const forgetPassword=async ()=>{
//     const email="tirumelk@gmail.com"
//     try{
//     const user=await Users.findOne({email:email})

//     user.password="melkamu@123"
//     await user.save()
//     console.log("changed")
//     }catch(error){
//         console.log(error)
//     }
// }
// forgetPassword();
   