
const catchAsync = require('../utils/catchAsync')
const Users=require('../models/userModel')


const postUser=catchAsync(async(req,res)=>{
    const user=await Users.create(req.body)
    console.log("hello")
    res.status(200).json({user})
})
const getUser = catchAsync(async (req, res) => {
    const userID = req.user._id
    const user = await Users.findOne({ _id: userID });
    
    res.status(200).json({ user });
})
const getAll = catchAsync(async (req, res) => {
    const userID = "673cda6e39521f39cfa04e24"
    const user = await Users.findOne({ _id: userID });
    
    res.status(200).json({ user });
})
const updateUser=catchAsync(async (req,res)=>{
    
        const userID=req.user._id
        const user=await Users.findOneAndUpdate({_id:userID},req.body,{
            new:true,
            // runValidators:true,
        })
        
        res.status(200).json({user})
})
const deleteUser = catchAsync(async (req, res) => {
  const userID = req.user._id;
  await Users.findByIdAndDelete(userID); // Use findByIdAndDelete to remove the user
  res.status(200).json({ message: 'User deleted successfully' });
});

const PostAward = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const awardData = req.body; // Ensure the body is properly structured
  const award = await Users.findOneAndUpdate(
    { _id: userID },
    { $push: { awards: awardData } }, // Add the award data to the 'awards' array
    { new: true } // Return the updated document
  );
  res.status(200).json({ award });
});

const updateAward = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const awardID = req.params.awardID;
  const award = await Users.findOneAndUpdate(
    { _id: userID, 'awards._id': awardID },
    {
      $set: {
        'awards.$.title': req.body.title,
        'awards.$.institution': req.body.institution,
        'awards.$.year': req.body.year,
        'awards.$.description': req.body.description
      }
    },
    { new: true }
  );
  res.status(200).json({ award });
});

const deleteAward = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const awardID = req.params.awardID;
  await Users.findOneAndUpdate(
    { _id: userID },
    { $pull: { awards: { _id: awardID } } }
  );
  res.status(200).json({ message: 'Award deleted successfully' });
});

const PostCertificate = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const certificateData = req.body; // Ensure the body is properly structured
  const certificate = await Users.findOneAndUpdate(
    { _id: userID },
    { $push: { certificates: certificateData } },
    { new: true }
  );
  res.status(200).json({ certificate });
});

const updateCertificate = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const certificateID = req.params.certificateID;
  const certificate = await Users.findOneAndUpdate(
    { _id: userID, 'certificates._id': certificateID },
    {
      $set: {
        'certificates.$.title': req.body.title,
        'certificates.$.institution': req.body.institution,
        'certificates.$.date': req.body.date,
        'certificates.$.description': req.body.description
      }
    },
    { new: true }
  );
  res.status(200).json({ certificate });
});

const deleteCertificate = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const certificateID = req.params.certificateID;
  await Users.findOneAndUpdate(
    { _id: userID },
    { $pull: { certificates: { _id: certificateID } } }
  );
  res.status(200).json({ message: 'Certificate deleted successfully' });
});

const PostEducation = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const educationData = req.body; // Ensure the body is properly structured
  const education = await Users.findOneAndUpdate(
    { _id: userID },
    { $push: { educations: educationData } },
    { new: true }
  );
  res.status(200).json({ education });
});

const updateEducation = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const educationID = req.params.educationID;
  const education = await Users.findOneAndUpdate(
    { _id: userID, 'educations._id': educationID },
    {
      $set: {
        'educations.$.degree': req.body.degree,
        'educations.$.field': req.body.field,
        'educations.$.institution': req.body.institution,
        'educations.$.location': req.body.location,
        'educations.$.graduationDate': req.body.graduationDate,
        'educations.$.gpa': req.body.gpa,
        'educations.$.thesis': req.body.thesis
      }
    },
    { new: true }
  );
  res.status(200).json({ education });
});

const deleteEducation = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const educationID = req.params.educationID;
  await Users.findOneAndUpdate(
    { _id: userID },
    { $pull: { educations: { _id: educationID } } }
  );
  res.status(200).json({ message: 'Education deleted successfully' });
});

const PostExperience = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const experienceData = req.body; // Ensure the body is properly structured
  const experience = await Users.findOneAndUpdate(
    { _id: userID },
    { $push: { experiences: experienceData } },
    { new: true }
  );
  res.status(200).json({ experience });
});

const updateExperience = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const experienceID = req.params.experienceID;
  const experience = await Users.findOneAndUpdate(
    { _id: userID, 'experiences._id': experienceID },
    {
      $set: {
        'experiences.$.position': req.body.position,
        'experiences.$.institution': req.body.institution,
        'experiences.$.location': req.body.location,
        'experiences.$.startDate': req.body.startDate,
        'experiences.$.endDate': req.body.endDate,
        'experiences.$.description': req.body.description
      }
    },
    { new: true }
  );
  res.status(200).json({ experience });
});

const deleteExperience = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const experienceID = req.params.experienceID;
  await Users.findOneAndUpdate(
    { _id: userID },
    { $pull: { experiences: { _id: experienceID } } }
  );
  res.status(200).json({ message: 'Experience deleted successfully' });
});

const PostLanguage = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const languageData = req.body; // Ensure the body is properly structured
  const language = await Users.findOneAndUpdate(
    { _id: userID },
    { $push: { languages: languageData } },
    { new: true }
  );
  res.status(200).json({ language });
});

const updateLanguage = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const languageID = req.params.languageID;
  const language = await Users.findOneAndUpdate(
    { _id: userID, 'languages._id': languageID },
    {
      $set: {
        'languages.$.language': req.body.language,
        'languages.$.proficiency': req.body.proficiency
      }
    },
    { new: true }
  );
  res.status(200).json({ language });
});

const deleteLanguage = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const languageID = req.params.languageID;
  await Users.findOneAndUpdate(
    { _id: userID },
    { $pull: { languages: { _id: languageID } } }
  );
  res.status(200).json({ message: 'Language deleted successfully' });
});

const PostPublication = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const publicationData = req.body; // Ensure the body is properly structured
  const publication = await Users.findOneAndUpdate(
    { _id: userID },
    { $push: { publications: publicationData } },
    { new: true }
  );
  res.status(200).json({ publication });
});

const updatePublication = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const publicationID = req.params.publicationID;
  const publication = await Users.findOneAndUpdate(
    { _id: userID, 'publications._id': publicationID },
    {
      $set: {
        'publications.$.title': req.body.title,
        'publications.$.publisher': req.body.publisher,
        'publications.$.date': req.body.date,
        'publications.$.url': req.body.url
      }
    },
    { new: true }
  );
  res.status(200).json({ publication });
});

const deletePublication = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const publicationID = req.params.publicationID;
  await Users.findOneAndUpdate(
    { _id: userID },
    { $pull: { publications: { _id: publicationID } } }
  );
  res.status(200).json({ message: 'Publication deleted successfully' });
});
const PostSkill= catchAsync(async (req,res)=>{
    const userID=req.user._id
    const skill=await Users.findOneAndUpdate({_id:userID},{
        $push:req.body
    })
   
    res.status(200).json({ok:true})
})
const updateSkill = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const skillID = req.params.skillID;
  const skill = await Users.findOneAndUpdate(
    { _id: userID, 'skills._id': skillID },
    {
      $set: {
        'skills.$.skill': req.body.skill,
        'skills.$.level': req.body.level
      }
    },
    { new: true } // returns the updated document
  );

  res.status(200).json({ skill });
});

const deleteSkill = catchAsync(async (req, res) => {
  const userID = req.user._id;
  const skillID = req.params.skillID;

  // Use findOneAndUpdate with $pull to remove the skill from the array
  const user=await Users.findOneAndUpdate(
    { _id: userID },
    { $pull: { skills: { _id: skillID } } }
  );
  console.log(user.skills)
  res.status(200).json({ message: 'Skill deleted successfully' });
});

module.exports={PostAward,PostCertificate,PostEducation,PostExperience,PostLanguage,PostPublication,PostSkill,updateAward,updateCertificate,updateEducation,updateExperience,updateLanguage,updatePublication,updateSkill,updateUser,deleteAward,deleteCertificate,deleteEducation,deleteExperience,deleteLanguage,deletePublication,deleteSkill,deleteUser,getUser,postUser,getAll}