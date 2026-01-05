import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import generateAccessToken from "../utils/acessToken.js";
import generateRefreshToken from "../utils/refersToken.js";
import generateOpt from "../helper/generateOtp.js";
import sendEmail from "../utils/nodemiller.js";


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

//for logut 
export const logoutController = async (req, res) => {
    try {
        const userId = req.user._id; // make sure authMiddleware runs before this
        console.log("Logging out user:", userId);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        };

        // Clear cookies
        res.clearCookie("access_token", cookieOptions);
        res.clearCookie("refresh_token", cookieOptions);

        // Remove refresh token from DB
        await User.findByIdAndUpdate(userId, { $unset: { refresh_token: null } });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to logout"
        });
    }
};

//forgot password
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, mobile } = req.body;

        // 1. Find user
        const user = await User.findOne({
            $or: [{ email }, { mobile }]
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email or mobile number not registered"
            });
        }

        // 2. Generate OTP
        const otp = generateOpt()

        // 3. Hash OTP
        const hashedOtp = crypto
            .createHash("sha256")
            .update(otp.toString())
            .digest("hex");

        // 4. OTP expiry (20 minutes)
        const otpExpiry = new Date(Date.now() + 20 * 60 * 1000);

        // 5. Save OTP in DB
        await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    forgot_otp: hashedOtp,
                    forgot_date: otpExpiry
                }
            }
        );

        // 6. Send OTP email
        await sendEmail({
            to: user.email,
            subject: "Password Reset OTP",
            otp: otp
        });

        // 7. Response
        return res.status(200).json({
            success: true,
            message: "OTP sent to registered email"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to process forgot password"
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {

    } catch (error) {

    }
}