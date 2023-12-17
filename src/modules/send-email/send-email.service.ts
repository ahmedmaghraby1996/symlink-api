import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer'
@Injectable()
export class SendEmailService {
    private transporter: nodemailer.Transporter;
    private email: string;
    private password: string;

    constructor() {
        this.email = "symlink6@gmail.com";
        this.password = "pbwp zwyp cout kdoa";

        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.email,
                pass: this.password,
            }
        })
    }

    async sendResetPasswordEmail(email: string, resetPasswordUrl: string) {
        const message = {
            from: this.email,
            to: email,
            subject: 'Symlink - Password Reset URL',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://github.com/ahmedeid6842/music-store/assets/57197702/a9400fa0-b4f5-49bf-a9e7-0c69db2da95c" alt="Company Logo" style="max-width: 150px;">
                    </div>
                    <div style="background-color: #fff; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #333; margin-bottom: 20px;">Password Reset</h2>
                        <p style="color: #555;">Dear User,</p>
                        <p style="color: #555;">You have requested to reset your password. Click the link below to proceed:</p>
                        <a href="${resetPasswordUrl}" style="display: inline-block; text-decoration: none; padding: 10px 20px; background-color: #007bff; color: #fff; border-radius: 5px; margin-bottom: 20px;">Reset Password</a>
                        <p style="color: #555;">Please note that this password reset link is confidential. Do not share this link with anyone.</p>
                        <p style="color: #555;">If you did not request this change, please ignore this email.</p>
                        <p style="color: #555; margin-top: 20px;">This password reset link will expire after 1 hour.</p>
                        <p style="color: #555; margin-top: 20px;">Best Regards,<br>Symlink.</p>
                    </div>
                </div>
            `
        };

        return await this.transporter.sendMail(message);
    }


}