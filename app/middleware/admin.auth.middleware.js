const adminModel = require("../../db/models/admin.model");
const myHelper = require("../util/helper")
const jwt = require("jsonwebtoken")
const auth = async(req, res, next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ", "")
        const decodedToken = jwt.verify(token, process.env.tokenPass)
        const adminData = await adminModel.findOne({
            _id: decodedToken._id,
            "tokens.token": token
        })
        if(!adminData) throw new Error("invalid token")
        req.admin = adminData
        req.token = token
        next()
    }
    catch(e){
        myHelper.resHandler(res, 500, false, e.message, "unauthorized")
    }
}
module.exports = {auth}