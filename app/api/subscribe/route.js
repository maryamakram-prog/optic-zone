import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder-key');

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if Supabase URL/Key are placeholder or missing
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder');

    if (!isSupabaseConfigured) {
      console.warn('WARNING: Supabase URL or Anon Key is missing or placeholder. Skipping database insertion.');
    } else {
      // 1. Insert into Supabase
      const { error: dbError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (dbError) {
        if (dbError.code === '23505') {
          return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 });
        }
        console.error('Database Error:', dbError);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
    }

    // 2. Send Welcome Email via SMTP (Nodemailer) or Resend
    let emailSent = false;

    // Check SMTP configuration
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || '"Optic Zone" <hello@opticzone.com>',
          to: email,
          subject: 'Welcome to Optic Zone!',
          html: '<p>Thank you for subscribing to our newsletter! Get ready for exclusive deals and premium eyewear updates.</p>',
        });
        emailSent = true;
        console.log(`Successfully sent subscription welcome email to ${email} via SMTP.`);
      } catch (smtpError) {
        console.error('SMTP Email Error:', smtpError);
      }
    }

    // Fallback to Resend if SMTP is not configured or failed
    if (!emailSent && process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('placeholder')) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM || 'Optic Zone <hello@opticzone.com>',
          to: email,
          subject: 'Welcome to Optic Zone!',
          html: '<p>Thank you for subscribing to our newsletter! Get ready for exclusive deals and premium eyewear updates.</p>'
        });
        emailSent = true;
        console.log(`Successfully sent subscription welcome email to ${email} via Resend.`);
      } catch (resendError) {
        console.error('Resend Email Error:', resendError);
      }
    }

    if (!emailSent) {
      console.warn('WARNING: Neither SMTP nor Resend API Key is configured. Welcome email not sent.');
    }

    return NextResponse.json({ 
      message: 'Successfully subscribed!',
      db_registered: isSupabaseConfigured,
      email_sent: emailSent
    }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
