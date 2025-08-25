import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@fitmeals.com',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

export const sendWelcomeEmail = async (
  email: string,
  firstName: string
): Promise<void> => {
  const subject = 'Welcome to Fit Meals!';
  const html = `
    <h1>Welcome to Fit Meals, ${firstName}!</h1>
    <p>Thank you for joining our fitness-focused meal delivery service.</p>
    <p>We're excited to help you achieve your fitness goals with our AI-powered nutrition plans.</p>
    <p>Get started by browsing our meal selection and placing your first order!</p>
    <br>
    <p>Best regards,<br>The Fit Meals Team</p>
  `;
  
  await sendEmail(email, subject, html);
};

export const sendOrderConfirmationEmail = async (
  email: string,
  firstName: string,
  orderId: string,
  totalAmount: number
): Promise<void> => {
  const subject = 'Order Confirmation - Fit Meals';
  const html = `
    <h1>Order Confirmed!</h1>
    <p>Hi ${firstName},</p>
    <p>Your order has been confirmed and is being prepared.</p>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
    <p>You'll receive another email when your order is ready for delivery.</p>
    <br>
    <p>Thank you for choosing Fit Meals!</p>
  `;
  
  await sendEmail(email, subject, html);
};