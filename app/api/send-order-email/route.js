import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { orderDetails, customerEmail, customerName } = await request.json();

    // In a real application, you'd use your SMTP details here (e.g., from SendGrid, AWS SES)
    // For now, we mock the transport to log the email content to the console.
    const transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'windows'
    });

    // 1. Send Order Confirmation to Customer
    const customerHtml = `
      <div style="font-family: sans-serif; max-w-2xl mx-auto; p-6; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Hi ${customerName},</p>
        <p>Thank you for your order! We are preparing it for shipment.</p>
        <h3>Order Summary</h3>
        <p><strong>Total:</strong> $${orderDetails.total.toFixed(2)}</p>
        <p><strong>Shipping Address:</strong> ${orderDetails.customer.address}</p>
        <br />
        <p>You can track your order status in your account dashboard.</p>
        <p>Best regards,<br/>Optic Zone Team</p>
      </div>
    `;

    await transporter.sendMail({
      from: '"Optic Zone" <no-reply@opticzone.com>',
      to: customerEmail,
      subject: `Order Confirmation - Optic Zone`,
      html: customerHtml,
    });

    // 2. Send Notification to Admin
    const adminHtml = `
      <div style="font-family: sans-serif; max-w-2xl mx-auto; p-6; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #333;">New Order Received</h2>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Total:</strong> $${orderDetails.total.toFixed(2)}</p>
        <p>Log in to the admin dashboard to review and process this order.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Optic Zone System" <system@opticzone.com>',
      to: 'admin@opticzone.com',
      subject: `New Order Alert: ${customerName}`,
      html: adminHtml,
    });

    // We can access the raw mock email message here and log it
    console.log("================ MOCK EMAIL SENT ================");
    console.log("Customer Email:");
    console.log(info.message.toString());
    console.log("=================================================");

    return NextResponse.json({ success: true, message: 'Emails sent successfully (Mocked)' });
  } catch (error) {
    console.error('Error sending order email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
