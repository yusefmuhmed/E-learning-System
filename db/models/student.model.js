const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      lowercase: true,
      minLength: 5,
      maxLength: 20,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
      minLength: 5,
      maxLength: 20,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email format");
        }
      },
    },
    class: {
      type: String,
      enum: [
        "الاول الابتدائي",
        "الثاني الابتدائي",
        "الثالث الابتدائي",
        "الرابع الابتدائي",
        "الخامس الابتدائي",
        "السادس الابتدائي",
        "الاول الاعدادي",
        "الثاني الاعدادي",
        "الثالث الاعدادي",
        "الاول الثانوي",
        "الثاني الثانوي",
        "الثالث الثانوي",
      ],
    },
    profileImage: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      // match: ''
    },
    phoneNum: {
      type: String,
      validate(value) {
        if (!validator.isMobilePhone(value, "ar-EG"))
          throw new Error("invalid number");
      },
    },
    tokens: [
      {
        token: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);


studentSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 8);
  }
});
studentSchema.statics.loginUser = async (email, password) => {
  const studentData = await User.findOne({ email });
  if (!studentData) throw new Error("invalid email");
  const validatePassword = await bcryptjs.compare(password, studentData.password);
  if (!validatePassword) throw new Error("invalid password");
  return studentData;
};
studentSchema.methods.toJSON = function () {
  const data = this.toObject();
  delete data.__v;
  delete data.password;
  return data;
};
studentSchema.methods.generateToken = async function () {
  const studentData = this;
  console.log("test ", process.env.tokenPass);
  const token = jwt.sign({ _id: studentData._id }, process.env.tokenPass);
  studentData.tokens = studentData.tokens.concat({ token });
  await studentData.save();
  return token;
};
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
