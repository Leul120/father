
const catchAsync = require('../utils/catchAsync')
const Users=require('../models/userModel')


const postUser=catchAsync(async(req,res)=>{
    const user=await Users.create(req.body)
    res.status(200).json({user})
})
const getUser = catchAsync(async (req, res) => {
    const userID = req.params.userID;
    const user = await Users.findOne({ _id: userID });
    
    res.status(200).json({ user });
})
const updateUser=catchAsync(async (req,res)=>{
    
        const userID=req.params.userID
        const user=await Users.findOneAndUpdate({_id:userID},req.body,{
            new:true,
            // runValidators:true,
        })
        
        res.status(200).json({user})
})
const deleteUser=catchAsync(async (req,res)=>{
        const userID=req.params.userID;
        await Users.findOneAndDelete({_id:userID})
        res.status(200).json(`deleted successfully`)
})
const PostAward= catchAsync(async (req,res)=>{
    const userID=req.params.userID
    const award=await Users.findOneAndUpdate({_id:userID},{
        $push:req.body
    })
   
     res.status(200).json({ok:true})
})
const updateAward=catchAsync(async (req,res)=>{
        const userID=req.params.userID
        const awardID=req.params.awardID
        const award=await Users.findOneAndUpdate({_id:userID,'awards._id':awardID},{
            $set:{
                    'awards.$.title':req.body.title, 
                    'awards.$.institution':req.body.institution,
                    'awards.$.year': req.body.year,
                    'awards.$.description': req.body.description
            }
        })
        
        res.status(200).json({award})
})
const deleteAward=catchAsync(async (req,res)=>{
    const userID=req.params.userID
        const awardID=req.params.awardID;
        await Users.findOneAndDelete({_id:userID},{$pull:{awards:{_id:awardID}}})
        res.status(200).json(`deleted successfully`)
})
const PostCertificate= catchAsync(async (req,res)=>{
    const userID=req.params.userID
    const certificate=await Users.findOneAndUpdate({_id:userID},{
        $push:req.body
    })
   
    res.status(200).json({ok:true})
})
const updateCertificate=catchAsync(async (req,res)=>{
    
        const userID=req.params.userID
        const certificateID=req.params.certificateID
        const certificate=await Users.findOneAndUpdate({_id:userID,'certificates._id':certificateID},{
            $set:{
                'certificates.$.title':req.body.title, 
                    'certificates.$.institution':req.body.institution,
                    'certificates.$.date': req.body.date,
                    'certificates.$.description': req.body.description
            }
        })
        
        res.status(200).json({certificate})
})
const deleteCertificate=catchAsync(async (req,res)=>{
        const userID=req.params.userID
        const certificateID=req.params.certificateID;
        await Users.findOneAndDelete({_id:userID},{$pull:{certificates:{_id:certificateID}}})
        res.status(200).json(`deleted successfully`)
})
const PostEducation= catchAsync(async (req,res)=>{
    const userID=req.params.userID
    const education=await Users.findOneAndUpdate({_id:userID},{
        $push:req.body
    })
   
    res.status(200).json({ok:true})
})
const updateEducation=catchAsync(async (req,res)=>{
    
       const userID=req.params.userID
        const educationID=req.params.educationID
        const education=await Users.findOneAndUpdate({_id:userID,'educations._id':educationID},{
            $set:{
                'educations.$.degree':req.body.degree, 
                'educations.$.field':req.body.field,
                    'educations.$.institution':req.body.institution,
                    'educations.$.location': req.body.location,
                    'educations.$.graduationDate':req.body.graduationDate,
                    'educations.$.gpa':req.body.gpa,
                    'educations.$.thesis': req.body.thesis
            } 
        })
        
        res.status(200).json({education})
})
const deleteEducation=catchAsync(async (req,res)=>{
        const userID=req.params.userID
        const educationID=req.params.educationID;
        await Users.findOneAndDelete({_id:userID},{$pull:{educations:{_id:educationID}}})
        res.status(200).json(`deleted successfully`)
})
const PostExperience= catchAsync(async (req,res)=>{
    const userID=req.params.userID
    const experience=await Users.findOneAndUpdate({_id:userID},{
        $push:req.body
    })
   
    res.status(200).json({ok:true})
})
const updateExperience=catchAsync(async (req,res)=>{
    
       const userID=req.params.userID
        const experienceID=req.params.experienceID
        const experience=await Users.findOneAndUpdate({_id:userID,'experiences._id':experienceID},{
            $set:{
                'experiences.$.position':req.body.position, 
                'experiences.$.institution':req.body.institution,
                    'experiences.$.location':req.body.location,
                    'experiences.$.startDate': req.body.startDate,
                    'experiences.$.endDate':req.body.endDate,
                    'experiences.$.description':req.body.description,
                    
            }
        })
        
        res.status(200).json({experience})
})
const deleteExperience=catchAsync(async (req,res)=>{
        const userID=req.params.userID
        const experienceID=req.params.experienceID;
        await Users.findOneAndDelete({_id:userID},{$pull:{experiences:{_id:experienceID}}})
        res.status(200).json(`deleted successfully`)
})
const PostLanguage= catchAsync(async (req,res)=>{
    const userID=req.params.userID
    const language=await Users.findOneAndUpdate({_id:userID},{
        $push:req.body
    })
   
    res.status(200).json({ok:true})
})
const updateLanguage=catchAsync(async (req,res)=>{
    
        const userID=req.params.userID
        const languageID=req.params.languageID
        const language=await Users.findOneAndUpdate({_id:userID,'languages._id':languageID},{
            $set:{
               'languages.$.language':req.body.language, 
                    'languages.$.proficiency':req.body.proficiency,
                    
            } 
        })
        
        res.status(200).json({language})
})
const deleteLanguage=catchAsync(async (req,res)=>{
        const userID=req.params.userID
        const languageID=req.params.languageID;
        await Users.findOneAndDelete({_id:userID},{$pull:{languages:{_id:languageID}}})
        res.status(200).json(`deleted successfully`)
})
const PostPublication= catchAsync(async (req,res)=>{
    const userID=req.params.userID
    const publication=await Users.findOneAndUpdate({_id:userID},{
        $push:req.body
    })
   
    res.status(200).json({ok:true})
})
const updatePublication=catchAsync(async (req,res)=>{
    
        const userID=req.params.userID
        const publicationID=req.params.publicationID
        const publication=await Users.findOneAndUpdate({_id:userID,'publications._id':publicationID},{
            $set:{
                'publications.$.title':req.body.title, 
                    'publications.$.journal':req.body.journal,
                    'publications.$.volume': req.body.volume,
                    'publications.$.pages': req.body.pages,
                    'publications.$.year': req.body.year,
                    'publications.$.url': req.body.url,
                    'publications.$.doi': req.body.doi
            } 
        })
        
        res.status(200).json({publication})
})
const deletePublication=catchAsync(async (req,res)=>{
       const userID=req.params.userID
        const publicationID=req.params.publicationID;
        await Users.findOneAndDelete({_id:userID},{$pull:{publications:{_id:publicationID}}})
        res.status(200).json(`deleted successfully`)
})
const PostSkill= catchAsync(async (req,res)=>{
    const userID=req.params.userID
    const skill=await Users.findOneAndUpdate({_id:userID},{
        $push:req.body
    })
   
    res.status(200).json({ok:true})
})
const updateSkill=catchAsync(async (req,res)=>{
    
        const userID=req.params.userID
        const skillID=req.params.skillID
        const skill=await Users.findOneAndUpdate({_id:userID,'skills._id':skillID},{
            $set:{
                'skills.$.skill': req.body.skill,
                'skills.$.level': req.body.level
            }
        })
        
        res.status(200).json({skill})
})
const deleteSkill=catchAsync(async (req,res)=>{
        const userID=req.params.userID
        const skillID=req.params.skillID;
        await Users.findOneAndDelete({_id:userID},{$pull:{skills:{_id:skillID}}})
        res.status(200).json(`deleted successfully`)
})
module.exports={PostAward,PostCertificate,PostEducation,PostExperience,PostLanguage,PostPublication,PostSkill,updateAward,updateCertificate,updateEducation,updateExperience,updateLanguage,updatePublication,updateSkill,updateUser,deleteAward,deleteCertificate,deleteEducation,deleteExperience,deleteLanguage,deletePublication,deleteSkill,deleteUser,getUser,postUser}