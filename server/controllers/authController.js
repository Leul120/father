const Users=require('../models/userModel')
const jwt=require('jsonwebtoken')
const catchAsync=require('../utils/catchAsync')
const bcrypt=require('bcrypt')


const signToken=(id)=>{
    return jwt.sign({id:id},process.env.JWT_SECRET)
}

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
