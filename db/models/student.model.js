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
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
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
    bufferProfileImage: Buffer,
    password: {
      type: String,
      trim: true,
      required: true,
    },
    phoneNum: {
      type: String,
      validate(value) {
        if (!validator.isMobilePhone(value, "ar-EG"))
          throw new Error("invalid number");
      },
    },
    OTP: {
      type: String,
      trim: true,
    },
    teachersIDs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    pendingTeachersIDs: [
      {
        teachersID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher",
          trim: true,
          required: false,
        },
        durationInMinutes: { type: Number, required: false },
        class:{ type:String,trim:true },
        sessionInfo: {
          type: String,
          trim: true,
        },
        subject: { type: String, trim: true },
      },
    ],
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
studentSchema.statics.loginStudent = async (username, password) => {
  const studentData = await Student.findOne({ username });
  if (!studentData) throw new Error("invalid username");
  const validatePassword = await bcryptjs.compare(
    password,
    studentData.password
  );
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
  const token = jwt.sign({ _id: studentData._id }, process.env.tokenPass);
  studentData.tokens = studentData.tokens.concat({ token });
  await studentData.save();
  return token;
};
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
