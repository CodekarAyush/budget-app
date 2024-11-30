import { decodeToken } from "../utils/tokens.js";

export const handleToken = async (req,res,next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1]
const payload = await decodeToken(token)
req.user = payload

next()
    } catch (error) {
        console.log(error);``
        throw error.message
    }
}

export const userProtect = async (req,res,next )=>{
    try {
        if (req.user.role === "user") {
            next ()
        }
        res.status(403).json({message:"unauthorised access !"})
    } catch (error) {
        console.log();
        throw error.message
        
    }
}
export const adminProtect = async (req,res,next )=>{
    try {
        if (req.user.role === "admin") {
            next ()
        }
        res.status(403).json({message:"unauthorised access !"})
    } catch (error) {
        console.log();
        throw error.message
        
    }
}