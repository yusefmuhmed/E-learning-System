const mongoose = require("mongoose");

const globalConfigSchema = mongoose.Schema({
  id: {
    type: Number,
    trim: true,
    required: true,
    unique: true,
    default : 1
  },

  meetingDuration: {
    type: Number,
    trim: true,
    default: 30,
    min: 15,
    max: 120,
  },
});

const GlobalConfig = mongoose.model("GlobalConfig", globalConfigSchema);
module.exports = GlobalConfig;
