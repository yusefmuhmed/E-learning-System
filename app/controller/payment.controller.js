const myHelper = require("../util/helper");
const axios = require("axios");
const config = require("../../config.json");
const FormData = require("form-data");
const paymentHistoryModel = require("../../db/models/paymentHistory.model");
const crypto = require("crypto");

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
      data.append("redirection_url", config.payment.redirection_url);

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

  static paymentStatus = async (req, res) => {
    try {
      // Log the Paymob response
      console.log("Paymob Response:", req.query);

      // Extract the HMAC and payment data from `req.query`
      const { hmac, ...paymobData } = req.query;

      // Step 1: Construct the data string in the specified order
      const dataString = [
        paymobData.amount_cents,
        paymobData.created_at,
        paymobData.currency,
        paymobData.error_occured,
        paymobData.has_parent_transaction,
        paymobData.id,
        paymobData.integration_id,
        paymobData.is_3d_secure,
        paymobData.is_auth,
        paymobData.is_capture,
        paymobData.is_refunded,
        paymobData.is_standalone_payment,
        paymobData.is_voided,
        paymobData.order_id,
        paymobData.owner,
        paymobData.pending,
        paymobData.source_data.pan,
        paymobData.source_data.sub_type,
        paymobData.source_data.type,
        paymobData.success,
      ].join("");

      // Step 2: Compute HMAC using SHA512
      const computedHmac = crypto
        .createHmac("sha512", config.payment.hmac_secret)
        .update(dataString)
        .digest("hex");

      // Step 3: Compare the received HMAC with the computed one
      if (computedHmac !== hmac) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid HMAC" });
      }

      // Destructure the payment data from paymobData object
      const {
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        owner,
        pending,
        success,
        order,
        source_data,
      } = paymobData;

      // Access nested properties if required
      const orderId = order?.id;
      const pan = source_data?.pan;
      const subType = source_data?.sub_type;
      const sourceType = source_data?.type;

      // Respond based on payment success status
      if (success === "true") {
        myHelper.resHandler(
          res,
          200,
          true,
          {
            transaction_id: id,
            order: orderId,
            amount_cents,
          },
          "Payment was successful"
        );
      } else {
        myHelper.resHandler(
          res,
          400,
          false,
          {
            transaction_id: id,
            error_occured,
          },
          "Payment failed or was canceled"
        );
      }
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
}
module.exports = Payment;
