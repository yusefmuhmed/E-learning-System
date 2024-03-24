const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const teacherSchema = mongoose.Schema(
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
    username: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },
    classes: [
      {
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
      },
    ],
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
    introVideoLink: {
      type: String,
      trim: true,
    },
    tokens: [
      {
        token: { type: String, required: true },
      },
    ],
    studentsIDs: [
      {
        studentID: { type: String, trim: true },
      },
    ],
    requestsFromStudents: [
      {
        studentID: { type: String, trim: true },
        class: { type: String, trim: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

teacherSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 8);
  }
});
teacherSchema.statics.loginTeacher = async (username, password) => {
  const teacherData = await User.findOne({ username });
  if (!teacherData) throw new Error("invalid username");
  const validatePassword = await bcryptjs.compare(
    password,
    teacherData.password
  );
  if (!validatePassword) throw new Error("invalid password");
  return teacherData;
};
teacherSchema.methods.toJSON = function () {
  const data = this.toObject();
  delete data.__v;
  delete data.password;
  return data;
};
teacherSchema.methods.generateToken = async function () {
  const teacherData = this;
  console.log("test ", process.env.tokenPass);
  const token = jwt.sign({ _id: teacherData._id }, process.env.tokenPass);
  teacherData.tokens = teacherData.tokens.concat({ token });
  await teacherData.save();
  return token;
};
const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;