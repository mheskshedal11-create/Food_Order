import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import generateAccessToken from "../utils/acessToken.js";
import generateRefreshToken from "../utils/refersToken.js";


//for user register
export const registerController = async (req, res) => {
    try {
        const { name, email, mobile, password, role } = req.body
        // check the user  is already register
        if (email) {
            const existingEmail = await User.findOne({ email })
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exist"
                })
            }
        } if (mobile) {
            const existingMobile = await User.findOne({ mobile })
            if (existingMobile) {
                return res.status(400).json({
                    success: false,
                    message: "Mobile Number  already exist"
                })
            }
        }

        //for hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashPassword,
            mobile,
            role: role || 'user'
        })
        await newUser.save()
        const userDetail = newUser.toObject()
        delete userDetail.password
        return res.status(200).json({
            success: true,
            message: "User Register Successfully",
            userDetail
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Faield to user Register"
        })
    }
}

//forlogin
export const loginController = async (req, res) => {
    try {
        const { email, password, mobile } = req.body

        // Find user
        const user = await User.findOne({
            $or: [{ email }, { mobile }]
        })

        if (!user)
            return res.status(400).json({ success: false, message: "Invalid email/mobile or password" })

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({ success: false, message: "Invalid email/mobile or password" })

        // Generate tokens
        const AccessToken = generateAccessToken(user._id) // sync
        const RefreshToken = await generateRefreshToken(user._id) // async

        // Remove sensitive data
        const userLogin = user.toObject()
        delete userLogin.password

        // Cookies
        const cookieDetail = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        }
        res.cookie("access_token", AccessToken, cookieDetail)
        res.cookie("refresh_token", RefreshToken, cookieDetail)

        // Return only user info (tokens in cookies)
        return res.status(200).json({
            success: true,
            message: "Login successfully",
            user: {
                userLogin,
                AccessToken,
                RefreshToken
            }
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        })
    }
}

