const Users=require('../models/userModel')
const jwt=require('jsonwebtoken')
const catchAsync=require('../utils/catchAsync')
const bcrypt=require('bcrypt')


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
        next(AppError("couldn't create a user",500))
    }
})
exports.login=async (req,res,next)=>{
    console.log(req.body)
    const email=req.body.email
    const password=req.body.password
    const user=await Users.findOne({email:email}).select('+password')

    if(!user || !await user.correctPassword(password,user.password)){
        
       next(AppError("incorrect email or password",401))
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
   