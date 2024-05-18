const express = require('express')
const router = express()

router.use(express.json())

const { registerValidator, sendMailVerificationValidator, passwordResetValidator, loginValidator } = require('../helpers/validation')

const userController = require('../controllers/userController')
const passwordReset = require('../models/passwordReset')
const auth = require('../middleware/auth')

router.post('/register', registerValidator, userController.userRegister)
router.post('/send-mail-verification', sendMailVerificationValidator, userController.sendMailVerification)
router.post('/forgot-password', passwordResetValidator, userController.forgotPassword)
router.post('/login', loginValidator, userController.loginUser)
router.get('/profile', auth,  userController.userProfile)
router.post('/logout', auth, userController.logoutUser)


module.exports = router
