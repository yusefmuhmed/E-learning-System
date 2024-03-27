const studentModel = require("../../db/models/student.model")
const myHelper = require("../helper")
const jwt = require("jsonwebtoken")
const auth = async(req, res, next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ", "")
        const decodedToken = jwt.verify(token, process.env.tokenPass)
        const studentData = await studentModel.findOne({
            _id: decodedToken._id,
            "tokens.token": token
        })
        if(!studentData) throw new Error("invalid token")
        req.user = studentData
        req.token = token
        next()
    }
    catch(e){
        myHelper.resHandler(res, 500, false, e.message, "unauthorized")
    }
}
module.exports = {auth}