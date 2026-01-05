import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
//for user register
export const registerController = async (req, res) => {
    try {
        const { name, email, mobile, password, role } = req.body
        // check the user  is already register
        const user = await User.findOne({ $or: [{ email: email }, { mobile: mobile }] })
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'Email or Mobile Number already exit'
            })
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