const myHelper = require("../../app/helper");
const guestModel = require("../../db/models/guest.model");
class Guest {
  static checkVisitedGuest = async (req, res) => {
    try {
      const guestData = await guestModel.findOne({
        deviceID: req.body.deviceID,
      });
      if (!guestData) {
        const guest = new guestModel(req.body);
        await guest.save();
        myHelper.resHandler(
          res,
          200,
          true,
          guest,
          "guest added successfully"
        );
      } else {
        myHelper.resHandler(res, 401, false, false, "Not authorized guest");
      }
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
}

module.exports = Guest;
