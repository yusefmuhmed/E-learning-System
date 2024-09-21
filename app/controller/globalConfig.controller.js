const MyHelper = require("../util/helper");
const GlobalConfig = require("../../db/models/globalConfig.model");

module.exports = {
    getGlobalSessionDuration: async (req, res) => {
        try {
            const globalConfig = await GlobalConfig.findOne({});

            if (!globalConfig) {
                throw new Error("global config not found");
            }

            MyHelper.resHandler(res, 200, true, globalConfig, "global config");
        } catch (e) {
            MyHelper.resHandler(res, 500, false, e, e.message);
        }
    },


    addGlobalSessionDuration : async (req, res) => {
        try {
            const globalConfig = new GlobalConfig(req.body);
            await GlobalConfig.deleteMany({});
            await globalConfig.save();
            MyHelper.resHandler(res, 200, true, globalConfig, "global config added successfully");
        } catch (e) {
            MyHelper.resHandler(res, 500, false, e, e.message);
        }
    }



}