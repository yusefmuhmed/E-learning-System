const mongoose = require("mongoose")

const schoolSchema = mongoose.Schema({


    governorate_name_ar:{
        type: String,
        unique: true,
        trim:true,
        required:true,
    },

    governorate_name_en:{
        type: String,
        unique: true,
        trim:true,
        required:true,
    },

    schools:[
        {
        schoolName:{
        type: String,
        trim:true,
}
}
]




}, { timestamps: true })


const School = mongoose.model("School", schoolSchema)
module.exports = School