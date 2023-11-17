const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const UserModel = require("../model/userSchema");
const OTPModel = require("../model/OTPSchema");
const EmailVerfication = require("../templates/emailverification");

const SignUpController = async (req, res) => {
  try {
    const body = req.body;
    const { fullName, email, password } = body;

    if (!fullName || !email || !password) {
      res.json({
        status: false,
        message: "Required Fields Are Missing!",
        data: null,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const objToSend = {
      full_name: fullName,
      email,
      password: hashPassword,
    };

    const emailExist = await UserModel.findOne({ email });

    if (emailExist) {
      res.json({
        status: false,
        message: "This Email Address Has Been Already Exists Please Try Again",
        data: null,
      });
      return;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000);

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   port: 587,
    //   secure: true,
    //   auth: {
    //     user: "daniyalali12568@gmail.com",
    //     pass: "Irjgcocnetrwfnlp",
    //   },
    // });

    // const emailData = await transporter.sendMail({
    //   from: "daniyalali12568@gmail.com",
    //   to: email,
    //   subject: "Email Verfication",
    //   html: EmailVerfication(fullName, otpCode),
    // });

    await OTPModel.create({
      otp_code: otpCode,
      email,
    });

    const userSave = await UserModel.create(objToSend);

    res.json({
      status: true,
      message: "Please Check Your EmailAddress For OTP",
      data: userSave,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

const LoginController = async (req, res) => {
  try {
    const body = req.body;
    const { email, password } = body;

    if (!email || !password) {
      res.json({
        status: false,
        message: "Required Fields Are Missing!",
        data: null,
        isVerify: false,
      });
      return;
    }

    const emailExist = await UserModel.findOne({ email });

    if (!email) {
      res.json({
        message: "Invalid Credential!",
        status: false,
        data: null,
        isVerify: false,
      });
      return;
    }

    const comparePassword = await bcrypt.compare(password, emailExist.password);

    if (comparePassword) {
      // Agar Banda Baghair Email Verify Karwaye Bina Ajaye To Use Bolo kay ap Email Verify Karwao

      if (!emailExist.isVerify) {
        res.json({
          message: "Please Verify your Account!",
          status: true,
          isVerify: false,
          data: null,
        });
        return;
      }

      var token = jwt.sign({ email: emailExist.email }, "PRIVATE KEY");

      res.json({
        message: "Congratulations You Logged In",
        status: true,
        data: emailExist,
        isVerify: true,
        token,
      });
      return;
    }
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

const OTPVerification = async (req, res) => {
  try {
    const body = req.body;
    const { otpCode, email } = body;

    if (!otpCode || !email) {
      res.json({
        status: false,
        message: "Required Fields Are Missing!",
        data: null,
        isVerify: false,
      });
      return;
    }

    const isValid = await OTPModel.findOne({
      otp_code: otpCode,
      isUsed: false,
      email,
    });

    if (!isValid) {
      res.json({
        message: "Invalid OTP",
        status: false,
        data: null,
      });
      return;
    }

    await OTPModel.updateOne(
      //iffi
      {
        otp_code: otpCode,
        isUsed: false,
        email,
      },
      { isUsed: true }
    );

    await UserModel.updateOne(
      {
        email,
      },
      { isVerify: true }
    );

    res.json({
      message: "User Successfully SignUp",
      status: true,
      data: null,
    });

    console.log(isValid, "isValid");
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

module.exports = {
  SignUpController,
  LoginController,
  OTPVerification,
};
