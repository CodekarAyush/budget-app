import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { generateOtp } from "../utils/auth.utils.js"
import { userOtp } from "../models/userOtp.model.js"
import { sendEmail } from "../utils/email.js"
export const register = async (req,res)=>{
    try {
        const {name ,email , phoneNumber , password} = req.body 
        const userExists = await User.findOne({email})
        console.log(userExists);
        
        if (userExists) {
            return res.status (400).json({message:"user with the same email is already exists !"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , salt)
        const user = await User.create({
            name , 
            email , 
            phoneNumber,
            password:hashedPassword
        })
        const otp = generateOtp()
        const verificationUrl = `${process.env.BASE_URL}/api/user/verify-email?otp=${otp}&email=${email}`
        await userOtp.create({
            userId:user._id,
            otp,
            expiresAt :new Date(Date.now()+ 5*60*1000)

        })
        await sendEmail(email , "email verification ","otp-verification",{
            name , otp , verificationUrl
        })
        res.status(200).json({
            message:"Registered successfully ! Please go and check your email "
        })
     } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"internal server error ",
            error:error.message
        })
    }
}