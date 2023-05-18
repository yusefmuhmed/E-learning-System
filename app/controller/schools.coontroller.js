const schoolModel = require("../../db/models/schools.model")
const myHelper = require("../../app/helper")

class School {

    static addGovernorate = async(req, res) => {
        try{
        const governorateData = new schoolModel(req.body)
            await governorateData.save()
            myHelper.resHandler(res, 200, true, governorateData, "governorate added successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }




    static getAllGovernorate = async(req, res) => {
        try {
            const governorate = await schoolModel.find()
            myHelper.resHandler(res, 200, true, governorate, "governorates fetched successfully")
        } catch (e) {
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }

}

module.exports = School