const KJUR = require("jsrsasign");
require("dotenv").config();
const myHelper = require("../util/helper");

const middleware = {};

middleware.generateToken = async (req, res) => {
  try {
    let signature = "";
    const iat = Math.round(Date.now() / 1000);
    const exp = iat + 60 * 60 * 2;
    const oHeader = { alg: "HS256", typ: "JWT" };
    const sdk_key = process.env.SDK_KEY;
    const sdk_secret = process.env.SDK_SECRET;

    const { topic, passWord, userIdentity, sessionKey, roleType } = req.body;

    const oPayload = {
      appKey: sdk_key,
      iat: iat,
      exp: exp,
      tpc: topic,
      pwd: passWord,
      user_identity: userIdentity,
      session_key: sessionKey,
      role_type: roleType,
    };

    const sHeader = JSON.stringify(oHeader);

    const sPayload = JSON.stringify(oPayload);

    signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdk_secret);
    res.locals.signature = signature;

    myHelper.resHandler(
      res,
      200,
      true,
      signature,
      "Token generated successfully"
    );
  } catch (error) {
    myHelper.resHandler(res, 500, false, error, error.message);
  }
};

module.exports = middleware;
