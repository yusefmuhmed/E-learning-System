const myHelper = require("../util/helper");
const axios = require("axios");
const config = require("../../config.json");
const FormData = require("form-data");
const paymentHistoryModel = require("../../db/models/paymentHistory.model");
const studentModel = require("../../db/models/student.model");
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
      const hmac = req.query.hmac;

      const { obj: paymobData } = req.body;

      if (!paymobData) {
        console.log("Paymob Data not found for this request");
        return;
      }

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
        paymobData.order?.id, // Access nested order ID
        paymobData.owner,
        paymobData.pending,
        paymobData.source_data?.pan, // Access nested source data properties
        paymobData.source_data?.sub_type,
        paymobData.source_data?.type,
        paymobData.success,
      ].join("");

      // Step 2: Compute HMAC using SHA512
      const computedHmac = crypto
        .createHmac("sha512", config.payment.hmac_secret)
        .update(dataString)
        .digest("hex");

      // Step 3: Compare the received HMAC with the computed one
      if (computedHmac !== hmac) {
        console.log("Invalid HMAC");
        return;
      }

      // Destructure and store the necessary payment data
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

      const orderId = order?.id;
      const pan = source_data?.pan;
      const subType = source_data?.sub_type;
      const sourceType = source_data?.type;

      // Save payment history if the payment was successful
      if (success === true) {
        const studentMail = req.body.obj.order.shipping_data.email;
        const paymentHistory = new paymentHistoryModel({
          studentMail,
          amount_cents,
          created_at,
          currency,
          error_occured,
          has_parent_transaction,
          transaction_id: id,
          integration_id,
          is_3d_secure,
          is_auth,
          is_capture,
          is_refunded,
          is_standalone_payment,
          is_voided,
          order_id: orderId,
          owner,
          pending,
          success,
        });
        await paymentHistory.save();

        const student = await studentModel.findOneAndUpdate(
          { email: studentMail },
          {
            $inc: {
              balance: amount_cents / 100, // Increment balance by the payment amount
            },
          },
          { new: true } // Return the updated document
        );

        if (!student) {
          console.log("Student with this mail" + studentMail + " not found");
          return;
        }

        console.log("Payment was successful");
        return;
      } else {
        console.log("Payment was not successful");
        return;
      }
    } catch (e) {
      console.log(e);
      return;
    }
  };
}
module.exports = Payment;
