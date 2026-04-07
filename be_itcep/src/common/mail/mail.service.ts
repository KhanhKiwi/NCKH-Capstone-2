import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST') || 'smtp.gmail.com',
      port: this.configService.get<number>('MAIL_PORT') || 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: '"Khám phá làng nghề" <' + this.configService.get<string>('MAIL_USER') + '>',
      to: email,
      subject: 'Yêu cầu đặt lại mật khẩu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded-lg: 10px;">
          <h2 style="color: #92400e; text-align: center;">Đặt lại mật khẩu của bạn</h2>
          <p>Chào bạn,</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với địa chỉ email này. Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
          <p>Để đặt lại mật khẩu, vui lòng nhấn vào nút dưới đây:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Đặt lại mật khẩu</a>
          </div>
          <p>Hoặc sao chép và dán liên kết này vào trình duyệt của bạn:</p>
          <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetLink}</p>
          <p>Liên kết này sẽ có hiệu lực trong 1 giờ.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="text-align: center; color: #9ca3af; font-size: 12px;">© 2026 Hành trình khám phá làng nghề. All rights reserved.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
