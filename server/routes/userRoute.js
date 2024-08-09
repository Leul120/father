const express=require('express')
const {  PostAward, PostCertificate, PostEducation, PostExperience, PostLanguage, PostPublication, PostSkill, updateUser, updateAward, updateCertificate, updateEducation, updateExperience, updateLanguage, updatePublication, deleteUser, deleteAward, deleteCertificate, deleteEducation, deleteExperience, deleteLanguage, deletePublication, getUser, postUser } = require('../controllers/usersController')
const { login, signup, contactUs } = require('../controllers/authController')
const router=express.Router()

router.route("/get-user/:userID").get(getUser)
router.route("/post-user").post(postUser)
router.route("/post-award/:userID").post(PostAward)
router.route("/post-certificate/:userID").post(PostCertificate)
router.route("/post-education/:userID").post(PostEducation)
router.route("/post-experience/:userID").post(PostExperience)
router.route("/post-language/:userID").post(PostLanguage)
router.route("/post-publication/:userID").post(PostPublication)
router.route("/post-skill/:userID").post(PostSkill)

router.route("/update-user/:userID").put(updateUser)
router.route("/update-award/:userID/:awardID").put(updateAward)
router.route("/update-certificate/:userID/:certificateID").put(updateCertificate)
router.route("/update-education/:userID/:educationID").put(updateEducation)
router.route("/update-experience/:userID/:experienceID").put(updateExperience)
router.route("/update-language/:userID/:languageID").put(updateLanguage)
router.route("/update-publication/:userID/:publicationID").put(updatePublication)
router.route("/update-skill/:userID/:skillID").put(PostSkill)

router.route("/delete-user/:userID").delete(deleteUser)
router.route("/delete-award/:userID/:awardID").delete(deleteAward)
router.route("/delete-certificate/:userID/:certificateID").delete(deleteCertificate)
router.route("/delete-education/:userID/educationID").delete(deleteEducation)
router.route("/delete-experience/:userID/experienceID").delete(deleteExperience)
router.route("/delete-language/:userID/:languageID").delete(deleteLanguage)
router.route("/delete-publication/:userID/:publicationID").delete(deletePublication)
router.route("/delete-skill/:userID/:skillID").delete(PostSkill)
router.route('/login').post(login)
router.route('/signup').post(signup)
router.route('/contact-us').post(contactUs)
module.exports=router