import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    profilePic:{
        type:String
    },
    designation:{
        type:String
    },
    dateOfBirthday:{
        type:String
    },
    profileCompletion:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

export const UserProfile = mongoose.model('UserProfile',userProfileSchema)
