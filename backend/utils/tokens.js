import jwt from "jsonwebtoken"
import "dotenv/config"

export const genToken = async(payload)=>{
    const token = await jwt.sign(payload,process.env.JWT_SECRET ,{
        expiresIn:"7d"
    })
    return token
}

export const decodeToken = async(token)=>{
    const payload = await jwt.verify(token,process.env.JWT_SECRET)
    return payload 
}