const myHelper = require("../util/helper");
const axios = require("axios");
const config = require("../../config.json");
const FormData = require("form-data");

class Payment {
  static getAuthToken = async () => {
    try {
      const response = await axios.post(
        "https://accept.paymob.com/api/auth/tokens",
        {
          api_key: config.payment.api_key,
        }
      );
      return response.data.token;
    } catch (error) {
      return error;
    }
  };

  static createPaymentLink = async (req, res) => {
    try {
      const token = config.payment.auth_token;
      //await this.getAuthToken();

      let data = new FormData();

      data.append("amount_cents", req.body.amount);
      data.append("payment_methods", "4840575");
      data.append("payment_methods", "4872519");
      data.append("email", req.student.email);
      data.append("is_live", config.payment.is_live_mode);
      data.append(
        "full_name",
        `${req.student.firstName} ${req.student.lastName}`
      );
      data.append("phone_number", "+20" + req.student.phoneNum || "");

      // Configure axios request with data and headers
      const response = await axios.post(
        "https://accept.paymob.com/api/ecommerce/payment-links",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          maxBodyLength: Infinity,
        }
      );

      // Send success response
      myHelper.resHandler(
        res,
        200,
        true,
        response.data,
        "Payment link created successfully"
      );
    } catch (error) {
      // Send error response
      myHelper.resHandler(res, 500, false, error, error.message);
    }
  };
}
module.exports = Payment;
