import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generate OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Send OTP email
export async function sendOTPEmail(email: string, otp: string): Promise<SendResult> {
  try {
    const mailOptions = {
      from: `"TripNest" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify Your Email - TripNest',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏠 TripNest</h1>
            <p style="color: #e8e8e8; margin: 10px 0 0 0;">Email Verification</p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Welcome to TripNest! To complete your registration, please use the verification code below:
            </p>

            <div style="background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <h1 style="color: #667eea; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>

            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This code will expire in <strong>10 minutes</strong>. Please enter it on the verification page to activate your account.
            </p>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                If you didn't create an account with TripNest, please ignore this email.
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
            <p>© 2025 TripNest. All rights reserved.</p>
            <p>Questions? Contact us at support@tripnest.com</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    // eslint-disable-next-line no-console
    console.log('OTP email sent:', info.messageId);
    return { success: true, messageId: info.messageId as string };
  } catch (error) {
    const err = error as Error;
    // eslint-disable-next-line no-console
    console.error('Error sending OTP email:', err);
    return { success: false, error: err.message };
  }
}

// Send welcome email after verification
export async function sendWelcomeEmail(email: string, name: string): Promise<SendResult> {
  try {
    const mailOptions = {
      from: `"TripNest" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to TripNest! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏠 Welcome to TripNest!</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}! 👋</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your email has been successfully verified! Welcome to the TripNest community.
            </p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">What's next?</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>Complete your profile</li>
                <li>Explore amazing properties</li>
                <li>Book your next adventure</li>
                <li>List your property (if you're a host)</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}"
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Start Exploring
              </a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
            <p>© 2025 TripNest. All rights reserved.</p>
            <p>Happy travels! ✈️</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    // eslint-disable-next-line no-console
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId as string };
  } catch (error) {
    const err = error as Error;
    // eslint-disable-next-line no-console
    console.error('Error sending welcome email:', err);
    return { success: false, error: err.message };
  }
}


