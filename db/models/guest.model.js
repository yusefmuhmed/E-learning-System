const mongoose = require("mongoose");
const validator = require("validator");

const guestSchema = mongoose.Schema({
  phoneNumber: {
    type: String,
    validate(value) {
      if (!validator.isMobilePhone(value, "ar-EG"))
        throw new Error("invalid number");
    },
  },
  deviceID: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
  },
});

const Guest = mongoose.model("Guest", guestSchema);
module.exports = Guest;
