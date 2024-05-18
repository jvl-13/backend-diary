const {check} = require('express-validator')

exports.registerValidator = [ 
    check('email', 'Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password', 'Password must be greater than 6 characters, and contains at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special symbol')
    .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1
    })
]

exports.sendMailVerificationValidator = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
]

exports.passwordResetValidator = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
]

exports.passwordValidator = [
    check('password', 'Password must be greater than 6 characters, and contains at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special symbol')
    .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1
    })
]

exports.loginValidator = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password', 'Password is required').not().isEmpty()
]