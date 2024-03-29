const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

class MyHelper {
  static resHandler = (res, statusCode, apiStatus, data, message) => {
    res.status(statusCode).send({
      apiStatus,
      data,
      message,
    });
  };

  static emailHandler = (mail) => {
    return new Promise((resolve, reject) => {
        const otp = otpGenerator.generate(6, {
            digits: true,
            alphabets: false,
            upperCase: false,
            specialChars: false,
        });

        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            port: 587,
            secure: false,
            auth: {
                user: "youssefmohamed3011@outlook.com",
                pass: "Photoshop30112556",
            },
        });

        const mailOptions = {
            from: "youssefmohamed3011@outlook.com",
            to: mail,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                reject({
                    apiStatus: false,
                    data: null,
                    message: "Error sending email",
                });
            } else {
                resolve({
                    apiStatus: true,
                    data: info.response,
                    otp: otp,
                });
            }
        });
    });
};

}
module.exports = MyHelper;
