const schoolModel = require("../../db/models/schools.model")
const myHelper = require("../../app/helper")

class School {


    static getGovernorate = async(req, res) => {
        try {
            const governorate = await schoolModel.findById(req.params.id)
            myHelper.resHandler(res, 200, true, governorate, "governorate fetched successfully")
        } catch (e) {
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }

}

module.exports = School