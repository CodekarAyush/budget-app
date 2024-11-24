import mongoose  from 'mongoose';


const otpSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
      },
      otp: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Date,
        required: true,
      },
    },
    { timestamps: true }
  );

  otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  
  export const userOtp = mongoose.model('OTP', otpSchema);

  