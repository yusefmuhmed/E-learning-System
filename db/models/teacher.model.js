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
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
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
    Bio: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
      enum: ["ذكر", "انثى", "male", "female"],
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    classes: [
      {
        class: {
          type: String,
          trim: true,
          required: true,
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
        expiresAt: { type: Date, required: true },
      },
    ],
    OTP: {
      type: String,
      trim: true,
    },
    subjects: [
      {
        subject: {
          type: String,
          trim: true,
          required: true,
        },
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
        durationInMinutes: { type: Number },
        sessionInfo: { type: String, trim: true },
        subject: { type: String, trim: true },
        studentName: { type: String, trim: true },
        studentClass: { type: String, trim: true },
      },
    ],
    pricePerHour: {
      type: Number,
      trim: true,
    },
    ratings: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        rate: {
          type: Number,
          trim: true,
          default: 0,
          min: 0,
          max: 5,
          required: true, // Assuming the rating value is required
        },
        feedbackMsg: {
          type: String,
          trim: true,
          default: "",
          maxLength: 500,
        },
      },
    ],
    ratingAverage: {
      type: Number,
      trim: true,
      default: 0,
      min: 0,
      max: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    totalNumberOfRatings: {
      type: Number,
      trim: true,
      default: 0,
      min: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
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
  const teacherData = await Teacher.findOne({ username });
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
  const expiresIn = 24 * 60 * 60;
  const token = jwt.sign({ _id: teacherData._id }, process.env.tokenPass, {
    expiresIn,
  });
  const expiresAt = new Date(Date.now() + expiresIn * 1000);
  teacherData.tokens = teacherData.tokens.concat({ token, expiresAt });
  await teacherData.save();

  return token;
};

teacherSchema.statics.removeExpiredTokens = async function () {
  const now = new Date();

  await this.updateMany(
    {},
    { $pull: { tokens: { expiresAt: { $lte: now } } } }
  );

  console.log("Expired tokens removed");
};

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
