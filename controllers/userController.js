const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator')
const mailer = require('../helpers/mailer')
const randomstring = require('randomstring')
const PasswordReset = require('../models/passwordReset')
const jwt = require('jsonwebtoken')

const userRegister = async(req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                mgs: 'Errors',
                errors: errors.array()
            })
        }

        const {email, password} = req.body

        const isExists = await User.findOne({email})
        if(isExists){
            return res.status(400).json({
                success: false,
                msg: 'Email đã được đăng ký! Vui lòng đăng nhập.'
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email, 
            password: hashPassword
        })
        const userData = await user.save()

        const msg = '<p>Xin chào, cảm ơn bạn đã đăng ký tài khoản với chúng tôi, vui lòng click vào link bên dưới để kích hoạt tài khoản của bạn</p> <hr> <p><a href="http://localhost:8000/mail-verification?id='+userData._id+'">Xác thực email</a></p>'
        mailer.sendMail(email, 'Mail Verification', msg)
        
        return res.status(200).json({
            success: true,
            msg: 'Đăng ký tài khoản thành công! Vui lòng kiểm tra email để xác thực tài khoản trước khi đăng nhập.',
            user: userData
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const mailVerification = async (req, res) => {
    try {
        if (req.query.id === undefined) {
            return res.render('404');
        }

        const userData = await User.findOne({ _id: req.query.id });

        if (userData) {
            if (userData.is_verified === 1) {
                return res.render('mail-verification', { message: 'Email của bạn đã được xác thực. Vui lòng trở lại đăng nhập!' });
            }

            // Correct the update statement to use req.query.id
            await User.findByIdAndUpdate(req.query.id, { $set: { is_verified: 1 } });

            return res.render('mail-verification', { message: 'Bạn đã xác thực email thành công. Vui lòng trở lại đăng nhập!' });
        } else {
            return res.render('mail-verification', { message: 'User not found!' });
        }
        
    } catch (error) {
        console.log(error.message);
        return res.render('404');
    }
};

const sendMailVerification = async(req, res) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: error.array()
            })
        }

        const {email} = req.body
        const userData = await User.findOne({email})
        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: 'Email does not exist',
            })
        }

        if (userData.is_verified == 1) {
            return res.status(400).json({
                success: false,
                msg: userData.email + 'is already verified!'
            })
        }

        const msg = '<p>Xin chào, cảm ơn bạn đã đăng ký tài khoản với chúng tôi, vui lòng click vào link bên dưới để kích hoạt tài khoản của bạn</p> <hr> <p><a href="http://localhost:8000/mail-verification?id='+userData._id+'">Xác thực email</a></p>'
        mailer.sendMail(userData.email, 'Mail Verification', msg)
        
        return res.status(200).json({
            success: true,
            msg: 'Link xác thực email đã được gửi vào hòm thư của bạn. Vui lòng xác thực trước khi đăng nhập!',
            user: userData
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: error.array()
            })
        }

        const {email} = req.body
        const userData = await User.findOne({email})
        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: 'Email does not exist',
            })
        }

        const randomString = randomstring.generate()
        const msg = '<p>Xin chào '+userData.email+', vui lòng lấy lại mật khẩu của bạn <a href = "http://localhost:8000/reset-password?token='+randomString+'">Ở đây</a></p>' 
        await PasswordReset.deleteMany({ user_id: userData._id})
        const passwordReset = new PasswordReset({
            user_id: userData._id,
            token: randomString
        })
        await passwordReset.save()

        mailer.sendMail(userData.email, 'Reset Password', msg)

        return res.status(201).json({
            success: true,
            msg: 'Reset Password link was sent ro your email, please check'
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        if(req.query.token == undefined) {
            return res.render('404')
        }

        const resetData = await PasswordReset.findOne({ token: req.query.token })
        if (!resetData) {
            return res.render('404')
        }

        return res.render('reset-password', {resetData})
    } catch (error) {
        return res.render('404')
    }
}

const updatePassword = async(req, res) => {
    try {

        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                mgs: 'Errors',
                errors: errors.array()
            })
        }
        
        const { user_id, password, c_password } = req.body
        const resetData = await PasswordReset.findOne({ user_id })

        if(password != c_password) {
            return res.render('reset-password', { resetData, error: 'Confirm password is not matched!'})

        }

        const hashedPassword = await bcrypt.hash(c_password, 10)
        await User.findByIdAndUpdate({_id: user_id}, {
            $set: {
                password: hashedPassword
            }
        })

        await PasswordReset.deleteMany({ user_id })
        return res.redirect('/reset-success')

    } catch (error) {
        return res.render('404')
    }
}

const resetSuccess = async (req, res) => {
    try {
        return res.render('reset-success')
    } catch (error) {
        return res.render('404')
    }
}

// const generateAccessToken = async(user) => {
//     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5m" })
//     return token
// }

const loginUser = async(req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(404).json({
                success: false,
                mgs: 'Errors',
                errors: errors.array()
            })
        }

        const {email, password} = req.body

        const userData = await User.findOne({email})
        if(!userData) {
            return res.status(401).json({
                success: false,
                mgs: 'Email hoặc mật khẩu không đúng!',
            })
        }

        const passwordMatch = await bcrypt.compare(password, userData.password)
        if (!passwordMatch) {
            return res.status(402).json({
                success: false,
                mgs: 'Email hoặc mật khẩu không đúng!',
            })
        }

        if (userData.is_verified == 0) {
            return res.status(403).json({
                success: false,
                mgs: 'Vui lòng xác thực tài khoản trong email!',
            })
        }

        const accessToken = jwt.sign({user: userData}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "12h" })

        // const accessToken = await generateAccessToken({ user: userData })

        return res.status(200).json({
            success: true,
            msg: 'Đăng nhập thành công!',
            user: userData,
            accessToken: accessToken,
            tokenType: 'Bearer'
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const userProfile = async(req, res) => {
    try {
        const userData = req.user.user
        return res.status(200).json({
            success: true,
            msg: 'User profile data',
            data: userData
        })
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const logoutUser = async(req, res) => {
    // const { refreshToken } = req.body
    // tokenService.removeRefreshToken(refreshToken)
    // res.sendStatus(204)
}

module.exports = {
    userRegister,
    mailVerification,
    sendMailVerification,
    forgotPassword,
    resetPassword,
    updatePassword,
    resetSuccess,
    loginUser,
    userProfile,
    logoutUser
}