import mongoose  from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role:{
        type: String , 
        enum:['user', 'admin'],
        default :'user'
    }
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

const User = mongoose.model('User', userSchema);
export  default User;
