const express=require('express')
const {  PostAward, PostCertificate, PostEducation, PostExperience, PostLanguage, PostPublication, PostSkill, updateUser, updateAward, updateCertificate, updateEducation, updateExperience, updateLanguage, updatePublication, deleteUser, deleteAward, deleteCertificate, deleteEducation, deleteExperience, deleteLanguage, deletePublication, getUser, postUser, getAll, updateSkill, deleteSkill } = require('../controllers/usersController')
const { login, signup, contactUs, protect, restrictTo } = require('../controllers/authController')
const router=express.Router()
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder to store images in Cloudinary
    allowedFormats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
}).fields([
  { name: 'image', maxCount: 10 },
  
]);

router.post('/upload',protect,restrictTo("admin"), upload, (req, res) => {
  try {
    const files = req.files;

    
    console.log(files)
    // Process property images
    
     const response = files.image.map((file) => ({
        imageUrl: file.path,
        publicId: file.filename,
      }));
    

    // Process deed image
    

    // Process ID image
    

    res.json({
      message: 'Images uploaded successfully',
      images: response,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading images', error });
  }
});

// Delete route
router.get('/delete/uploads/:publicId',protect,restrictTo("admin"), async (req, res) => {
  try {
    const { publicId } = req.params; // Expect an array of publicIds
    await cloudinary.uploader.destroy(publicId);
    console.log("image deleted")
    res.json({ message: 'Images deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting images', error });
  }
});

// Update route
router.put('/update',protect,restrictTo("admin"), upload, async (req, res) => {
  try {
    const { publicIds } = req.body; // Expect an array of publicIds
    const files = req.files;

    const response = {};

    // Delete the old images and upload the new ones
    if (publicIds.property && files.property) {
      const deletePromises = publicIds.property.map(publicId => cloudinary.uploader.destroy(publicId));
      await Promise.all(deletePromises);

      response.propertyImages = files.property.map((file) => ({
        imageUrl: file.path,
        publicId: file.filename,
      }));
    }

    if (publicIds.deed && files.deed) {
      await cloudinary.uploader.destroy(publicIds.deed[0]);

      response.deedImage = {
        imageUrl: files.deed[0].path,
        publicId: files.deed[0].filename,
      };
    }

    if (publicIds.id && files.id) {
      await cloudinary.uploader.destroy(publicIds.id[0]);

      response.idImage = {
        imageUrl: files.id[0].path,
        publicId: files.id[0].filename,
      };
    }

    res.json({
      message: 'Images updated successfully',
      images: response,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating images', error });
  }
});
router.route("/get-all").get(getAll)
router.route("/get-user").get(protect,restrictTo("admin"),getUser)
router.route("/post-user").post(protect,restrictTo("admin"),postUser)
router.route("/post-award").post(protect,restrictTo("admin"),PostAward)
router.route("/post-certificate").post(protect,restrictTo("admin"),PostCertificate)
router.route("/post-education").post(protect,restrictTo("admin"),PostEducation)
router.route("/post-experience").post(protect,restrictTo("admin"),PostExperience)
router.route("/post-language").post(protect,restrictTo("admin"),PostLanguage)
router.route("/post-publication").post(protect,restrictTo("admin"),PostPublication)
router.route("/post-skill").post(protect,restrictTo("admin"),PostSkill)

router.route("/update-user").put(protect,restrictTo("admin"),updateUser)
router.route("/update-award/:awardID").put(protect,restrictTo("admin"),updateAward)
router.route("/update-certificate/:certificateID").put(protect,restrictTo("admin"),updateCertificate)
router.route("/update-education/:educationID").put(protect,restrictTo("admin"),updateEducation)
router.route("/update-experience/:experienceID").put(protect,restrictTo("admin"),updateExperience)
router.route("/update-language/:languageID").put(protect,restrictTo("admin"),updateLanguage)
router.route("/update-publication/:publicationID").put(protect,restrictTo("admin"),updatePublication)
router.route("/update-skill/:skillID").put(protect,restrictTo("admin"),updateSkill)

router.route("/delete-user").delete(protect,restrictTo("admin"),deleteUser)
router.route("/delete-award/:awardID").delete(protect,restrictTo("admin"),deleteAward)
router.route("/delete-certificate/:certificateID").delete(protect,restrictTo("admin"),deleteCertificate)
router.route("/delete-education/educationID").delete(protect,restrictTo("admin"),deleteEducation)
router.route("/delete-experience/experienceID").delete(protect,restrictTo("admin"),deleteExperience)
router.route("/delete-language/:languageID").delete(protect,restrictTo("admin"),deleteLanguage)
router.route("/delete-publication/:publicationID").delete(protect,restrictTo("admin"),deletePublication)
router.route("/delete-skill/:skillID").delete(protect,restrictTo("admin"),deleteSkill)
router.route('/login').post(login)
router.route('/signup').post(signup)
router.route('/contact-us').post(contactUs)
module.exports=router