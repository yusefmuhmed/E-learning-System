const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = mongoose.Schema(
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
        password: {
            type: String,
            trim: true,
            required: true,
        },
        tokens: [
            {
                token: { type: String, required: true },
                expiresAt: { type: Date, required: true },
            },
        ],

    },
    {
        timestamps: true,
    }
);

adminSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 8);
    }
});
adminSchema.statics.loginAdmin = async (username, password) => {
    const adminData = await Admin.findOne({ username });
    if (!adminData) throw new Error("Invalid username or password");

    const validatePassword = await bcryptjs.compare(password, adminData.password);
    if (!validatePassword) throw new Error("Invalid username or password");

    return adminData;
};

adminSchema.methods.toJSON = function () {
    const data = this.toObject();
    delete data.__v;
    delete data.password;
    return data;
};
adminSchema.methods.generateToken = async function () {
    const AdminData = this;
    const expiresIn = 24 * 60 * 60;
    const token = jwt.sign({ _id: AdminData._id }, process.env.tokenPass, {
        expiresIn,
    });
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    AdminData.tokens = AdminData.tokens.concat({ token, expiresAt });
    await AdminData.save();

    return token;
};

adminSchema.statics.removeExpiredTokens = async function () {
    const now = new Date();

    await this.updateMany(
        {},
        { $pull: { tokens: { expiresAt: { $lte: now } } } }
    );

    console.log("Expired tokens removed");
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
