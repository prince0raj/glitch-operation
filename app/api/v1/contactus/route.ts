// /app/api/contact/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { sender_name, sender_email, sender_subject, sender_message } =
      await request.json();

    // Validation
    if (
      !sender_name?.trim() ||
      !sender_email?.trim() ||
      !sender_subject?.trim() ||
      !sender_message?.trim()
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Save to Supabase
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("contactus").insert({
      sender_name,
      sender_email,
      sender_subject,
      sender_message,
    });

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }
    // console.log(process.env.EMAIL_USER)
    // console.log(process.env.EMAIL_PASSWORD)

    // Send acknowledgment email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Orbit Linker" <${process.env.EMAIL_USER}>`,
      to: sender_email,
      subject: "Thank you for contacting Orbit Linker",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #00d492; margin-top: 0;">Thank You for Reaching Out</h2>
            
            <p style="color: #333; line-height: 1.6;">Dear <strong>${sender_name}</strong>,</p>
            
            <p style="color: #333; line-height: 1.6;">
              Thank you for contacting us. We have successfully received your message and want to assure you that it has been forwarded to our team for review.
            </p>
            
            <div style="background-color: #f5f5f5; border-left: 4px solid #00d492; padding: 15px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold;">Your Message:</p>
              <p style="margin: 0; color: #333; line-height: 1.6;">"${sender_message}"</p>
            </div>
            
            <p style="color: #333; line-height: 1.6;">
              Our team will carefully review your inquiry and get back to you as soon as possible. We typically respond within 24-48 hours during business days.
            </p>
            
            <p style="color: #333; line-height: 1.6;">
              If your matter is urgent, please feel free to reach out to us directly at <a href="mailto:${process.env.EMAIL_USER}" style="color: #00d492; text-decoration: none;">${process.env.EMAIL_USER}</a>.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #333; line-height: 1.6; margin-bottom: 5px;">Best regards,</p>
              <p style="color: #00d492; font-weight: bold; margin: 0;">The Orbit Linker Team</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
              <p style="color: #999; font-size: 12px; line-height: 1.4; margin: 0;">
                This is an automated confirmation email. Please do not reply directly to this message.<br>
                © ${new Date().getFullYear()} Orbit Linker. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `Dear ${sender_name},

Thank you for contacting us. We have successfully received your message and want to assure you that it has been forwarded to our team for review.

Your Message:
"${sender_message}"

Our team will carefully review your inquiry and get back to you as soon as possible. We typically respond within 24-48 hours during business days.

If your matter is urgent, please feel free to reach out to us directly at ${process.env.EMAIL_USER}.

Best regards,
The Orbit Linker Team

---
This is an automated confirmation email. Please do not reply directly to this message.
${new Date().getFullYear()} Orbit Linker. All rights reserved.`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Message received and acknowledgment email sent!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
