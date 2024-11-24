import cron from "node-cron";
import { userOtp } from "../models/userOtp.model.js";

export const cleanupExiredOtp = ()=>{
    cron.schedule("*/5 * * * *", async ()=>{
        try {
            const result = await userOtp.deleteMany({
                expiresAt:{$lt:new Date()}
            })
            console.log(`deleted ${result.deletedCount} expired otps `);
            
        } catch (error) {
            console.log(error);
            
        }
    })
}