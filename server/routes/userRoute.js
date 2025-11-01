const express=require('express')
const {  PostAward, PostCertificate, PostEducation, PostExperience, PostLanguage, PostPublication, PostSkill, updateUser, updateAward, updateCertificate, updateEducation, updateExperience, updateLanguage, updatePublication, deleteUser, deleteAward, deleteCertificate, deleteEducation, deleteExperience, deleteLanguage, deletePublication, getUser, postUser, getAll, updateSkill, deleteSkill, updateProfilePicture } = require('../controllers/usersController')
const { login, signup, contactUs, protect, restrictTo } = require('../controllers/authController')
const router=express.Router()
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Validate Cloudinary environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('ERROR: Cloudinary environment variables are missing!');
  console.error('Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}

// Configure Cloudinary with validation
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify Cloudinary configuration
if (cloudinary.config().cloud_name && cloudinary.config().api_key && cloudinary.config().api_secret) {
  console.log('Cloudinary configured successfully');
} else {
  console.error('WARNING: Cloudinary configuration is incomplete');
}

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

// Multer storage configuration for profile picture (single image)
const profilePictureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile-pictures', // Folder to store profile pictures in Cloudinary
    allowedFormats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }],
  },
});

const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Log file information for debugging
    console.log('File filter - File info:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      encoding: file.encoding
    });
    
    // Check if file exists
    if (!file) {
      return cb(new Error('No file provided'), false);
    }
    
    // Accept only image files
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      console.log('File filter - File accepted:', file.mimetype);
      cb(null, true);
    } else {
      console.log('File filter - File rejected:', file.mimetype || 'No mimetype');
      cb(new Error('Only image files are allowed! File type: ' + (file.mimetype || 'unknown')), false);
    }
  }
}).single('profilePicture');

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
  console.log(req.file)
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
router.route("/update-profile-picture").put(protect, restrictTo("admin"), (req, res, next) => {
  console.log('=== Profile Picture Upload Middleware ===');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Cloudinary config check:', {
    cloud_name: cloudinary.config().cloud_name ? 'Set' : 'Missing',
    api_key: cloudinary.config().api_key ? 'Set' : 'Missing',
    api_secret: cloudinary.config().api_secret ? 'Set' : 'Missing'
  });
  
  // Check if Cloudinary is properly configured before processing
  if (!cloudinary.config().cloud_name || !cloudinary.config().api_key || !cloudinary.config().api_secret) {
    console.error('ERROR: Cloudinary is not properly configured');
    return res.status(500).json({ 
      message: 'Server configuration error. Please contact administrator.',
      details: 'Cloudinary API credentials are missing'
    });
  }
  
  uploadProfilePicture(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        console.error('MulterError code:', err.code);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 5MB' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ message: 'Unexpected file field. Please use "profilePicture" field name.' });
        }
        return res.status(400).json({ message: err.message || 'File upload error occurred' });
      }
      
      // Handle Cloudinary errors (these come as regular errors, not MulterError)
      if (err.message && err.message.includes('api_key')) {
        console.error('Cloudinary configuration error:', err.message);
        return res.status(500).json({ 
          message: 'Server configuration error. Cloudinary API credentials are missing.',
          details: 'Please contact the administrator'
        });
      }
      
      // Handle other errors (like fileFilter errors)
      console.error('File filter or other error:', err.message);
      return res.status(400).json({ 
        message: err.message || 'Invalid file type. Only image files are allowed.',
        details: err.message
      });
    }
    
    console.log('Multer processing complete, file:', req.file ? 'exists' : 'missing');
    if (req.file) {
      console.log('Uploaded file details:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      });
    }
    next();
  });
}, updateProfilePicture)
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
router.route("/delete-education/:educationID").delete(protect,restrictTo("admin"),deleteEducation)
router.route("/delete-experience/:experienceID").delete(protect,restrictTo("admin"),deleteExperience)
router.route("/delete-language/:languageID").delete(protect,restrictTo("admin"),deleteLanguage)
router.route("/delete-publication/:publicationID").delete(protect,restrictTo("admin"),deletePublication)
router.route("/delete-skill/:skillID").delete(protect,restrictTo("admin"),deleteSkill)
router.route('/login').post(login)
router.route('/signup').post(signup)
router.route('/contact-us').post(contactUs)
module.exports=router