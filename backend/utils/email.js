import nodemailer from "nodemailer"
import ejs from "ejs" 
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const transporter = nodemailer.createTransport({
    host:"smtp-relay.brevo.com",
    port:587,
    secure:false,
    auth:{
        user :process.env.SMTP_USER ,
        pass :process.env.BREVO_PASS 
    }
})

export const sendEmail=  async (to, subject,templateName , context )=>{
    try {
        
        const templatePath = path.join(__dirname,"../views/emails",`${templateName}.ejs`)
        const html = await ejs.renderFile(templatePath,context)
        const mailOptions={
    from : process.env.EMAIL_FROM,
    to , 
    subject,
    html 
        } 
        await transporter.sendMail(mailOptions)
        console.log('email sent successfully ');
        
    } catch (error) {
    console.log(error);
        throw new Error("failed to send the email")
    }
}