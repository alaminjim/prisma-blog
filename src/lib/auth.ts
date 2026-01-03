import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER_EMAIL,
    pass: process.env.APP_USER_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationEmail = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"prisma blog" <prisma53@gmail.email>',
          to: user.email,
          subject: "Please verify your mail ✔",
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 10px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <tr>
            <td style="background:#0f172a; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">
                Prisma Blog
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:30px; color:#334155;">
              <h2 style="margin-top:0;">Verify your email address</h2>

              <p style="font-size:15px; line-height:1.6;">
                Hi ${user.name},<br /><br />
                Thanks for signing up for <strong>Prisma Blog</strong>.
                Please confirm your email address by clicking the button below.
              </p>

              <p style="text-align:center; margin:30px 0;">
                <a
                  href="${verificationEmail}"
                  style="
                    background:#2563eb;
                    color:#ffffff;
                    text-decoration:none;
                    padding:12px 24px;
                    border-radius:6px;
                    display:inline-block;
                    font-size:16px;
                  "
                >
                  Verify Email
                </a>
              </p>

              <p style="font-size:14px; color:#64748b;">
                If you did not create an account, you can safely ignore this email.
              </p>

              <p style="font-size:14px; color:#64748b;">
                This verification link will expire soon.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f1f5f9; padding:20px; text-align:center; font-size:13px; color:#64748b;">
              © 2026 Prisma Blog. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
        });

        console.log("Message sent:", info.messageId);
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
