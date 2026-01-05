import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODE_EMAIL,
        pass: process.env.NODE_PASSWORD,
    },
});

const sendEmail = async ({ to, subject, otp }) => {
    try {
        await transporter.sendMail({
            from: `"Support Team" <${process.env.NODE_EMAIL}>`,
            to,
            subject,
            html: `
                <h2>Password Reset OTP</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP is valid for 20 minutes.</p>
            `,
        });
    } catch (error) {
        console.error("Email error:", error);
        throw new Error("Email sending failed");
    }
};

export default sendEmail;
