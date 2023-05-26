const mongoose = require("mongoose")
const validator = require("validator")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = mongoose.Schema({
    fName: {
        type: String,
        trim: true,
        lowercase: true,
        minLength: 5,
        maxLength: 20,
        required: true
    },
    lName: {
        type: String,
        trim: true,
        lowercase: true,
        minLength: 5,
        maxLength: 20,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email format")
            }
        }
    },

    class: { type: String, enum: ["الاول الابتدائي", "الثاني الابتدائي", "الثالث الابتدائي","الرابع الابتدائي","الخامس الابتدائي","السادس الابتدائي","الاول الاعدادي","الثاني الاعدادي","الثالث الاعدادي","الاول الثانوي","الثاني الثانوي","الثالث الثانوي"], required: true },

    image: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        minLength: 5,
        required: true,
        // match: ''
    },
    phoneNum: {
        type: String,
        validate(value) {
            if (!validator.isMobilePhone(value, "ar-EG"))
                throw new Error("invalid number")
        }
    },



    roleName: { type: String, ref: "Role", enum: ["student", "admin", "teacher"], required: true },


    tokens: [{
        token: { type: String, required: true }
    }]
}, {
    timestamps: true
})
userSchema.virtual("mySchool", {
    ref: "School",
    localField: "_id",
    foreignField: "userId"
})


userSchema.pre("save", async function() {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 8)
    }
})
userSchema.statics.loginUser = async(email, password) => {
    const userData = await User.findOne({ email })
    if (!userData) throw new Error("invalid email")
    const validatePassword = await bcryptjs.compare(password, userData.password)
    if (!validatePassword) throw new Error("invalid password")
    return userData
}
userSchema.methods.toJSON = function() {
    const data = this.toObject()
    delete data.__v
    delete data.password
        // delete data.tokens
    return data
}
userSchema.methods.generateToken = async function() {
    const userData = this
    console.log("test ", process.env.tokenPass)
    const token = jwt.sign({ _id: userData._id }, process.env.tokenPass)
    userData.tokens = userData.tokens.concat({ token })
        // userData.tokens.push({token})
    await userData.save()
    return token
}
const User = mongoose.model("User", userSchema)
module.exports = User
    // module.exports = mongoose.model("User", userSchema)