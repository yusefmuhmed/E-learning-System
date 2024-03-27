const teacherModel = require("../../db/models/teacher.model")
const myHelper = require("../helper")
const jwt = require("jsonwebtoken")
const auth = async(req, res, next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ", "")
        const decodedToken = jwt.verify(token, process.env.tokenPass)
        const teacherData = await teacherModel.findOne({
            _id: decodedToken._id,
            "tokens.token": token
        })
        if(!teacherData) throw new Error("invalid token")
        req.teacher = teacherData
        req.token = token
        next()
    }
    catch(e){
        myHelper.resHandler(res, 500, false, e.message, "unauthorized")
    }
}
module.exports = {auth}