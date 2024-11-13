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
      const token ="ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RrM05EazFMQ0p3YUdGemFDSTZJbVk1TTJSa1pEQXlNR000WkRVM056TmpaRFV5TldKbU5UYzBOalprTXpkbU56QTFNR1prWldabE9ERXpOVEpoWWpGa1ltSmxNRFF5TjJSbE16STVaVEVpTENKbGVIQWlPakUzTXpFMU1ERTFPREI5LjFvcjR0ZW0zUWR5RG90Xy1CR1BmdjdoNWJ5cUY0cXFFTzloeGpBeXNheW9LbldCYmNQZmRjMEJaNzhJQjY4UTJmcjBRdFppckJIdkxyRE4xTTZGQjJB" 
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
            Authorization: `Bearer ${token}`
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
