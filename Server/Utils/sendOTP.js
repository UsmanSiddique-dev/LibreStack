import { createTransport } from "nodemailer";

const sendOtp = async (email, otp) => {
  const transpoter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transpoter.sendMail({
    from : process.env.EMAIL_USER,
    to: email,
    subject:"Your OTP code for verification",
    html: `<p>Your OTP code is <b>${otp}</b></p>`,
  })
};

export default sendOtp;