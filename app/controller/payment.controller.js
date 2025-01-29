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
      const token = await this.getAuthToken(); //config.payment.auth_token;
      //await this.getAuthToken();

      let data = new FormData();

      data.append("amount_cents", req.body.amount);
      data.append("payment_methods", "4903758");
      data.append("payment_methods", "4898173");
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

  static getAuthTokenForPayOut = async () => {
    try {
      // Get the base URL based on environment
      const baseURL =
        config.payment.env === "staging"
          ? config.payment.staging
          : config.payment.production;

      // Prepare the form data
      const formData = new URLSearchParams();
      formData.append("client_id", config.payment.client_id_payout);
      formData.append("client_secret", config.payment.client_secret_payout);
      formData.append("username", config.payment.username_payout);
      formData.append("password", config.payment.password_payout);
      formData.append("grant_type", "password");

      // Make the API call
      const response = await axios.post(
        `https://${baseURL}o/token/`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error getting auth token:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  static payOutForMobileWallet = async (req, res) => {
    try {
      const token = await this.getAuthTokenForPayOut();

      const response = await axios.post(
        `https://${config.payment.staging}disburse/`,
        {
          amount: req.body.amount,
          msisdn: req.body.mobileNumber,
          issuer: req.body.issuer,
        },
        {
          headers: {
            Authorization: `${token.token_type} ${token.access_token}`,
          },
        }
      );

      // Send success response
      myHelper.resHandler(
        res,
        200,
        true,
        response.data,
        response.data.status_description
      );
    } catch (error) {
      // Send error response
      myHelper.resHandler(res, 500, false, error, error.message);
    }
  };

  static payoutForBankAccount = async (req, res) => {
    try {
      const token = await this.getAuthTokenForPayOut();

      const response = await axios.post(
        `https://${config.payment.staging}disburse/`,
        {
          issuer: "bank_card",
          amount: req.body.amount,
          full_name: req.body.full_name,
          bank_card_number: req.body.bank_card_number,
          bank_code: req.body.bank_code,
          bank_transaction_type: "cash_transfer",
        },
        {
          headers: {
            Authorization: `${token.token_type} ${token.access_token}`,
          },
        }
      );

      // Send success response
      myHelper.resHandler(
        res,
        200,
        true,
        response.data,
        "Transaction received and validated successfully. Dispatched for being processed by the bank with the transaction ID" +
          response.data.transaction_id +
          "NOTE: Transactions on bank take 2 Working Days to get final status"
      );
    } catch (error) {
      // Send error response
      myHelper.resHandler(res, 500, false, error, error.message);
    }
  };

  static getBankCodes = async (req, res) => {
    try {
      const bankcodes = [
        {
          bankName: "Ahli United Bank",
          bankImage: "https://play-lh.googleusercontent.com/0pwAYvbZ8m-PmBEWVgp6kqAENYSIgSwJvPsO9RyugZXePx9RXdofSTzFGejEwYhfAc5x=w526-h296-rw",
          bankCode: "AUB",
        },
        {
          bankName: "MIDBANK",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxS0j8C-1wItcdKOSsMMEzUKl1wcTPhPt-ug&s",
          bankCode: "MIDB",
        },
        {
          bankName: "Banque Du Caire",
          bankImage: "https://images.wuzzuf-data.net/files/company_logo/Banque-du-Caire-Egypt-40132-1559214734-og.jpeg",
          bankCode: "BDC",
        },
        {
          bankName: "HSBC Bank Egypt S.A.E",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYR-Fs4fbEyCOnO2jeyz4lUqkCdBjq9uqbA&s",
          bankCode: "HSBC",
        },
        {
          bankName: "Credit Agricole Egypt S.A.E",
          bankImage: "https://ebs.ca-egypt.com/sso/OAM-OAMUI-context-root/Images/caLogo.png",
          bankCode: "CAE",
        },
        {
          bankName: "Egyptian Gulf Bank",
          bankImage: "https://www.intercom.com.eg/wp-content/uploads/2018/01/EGbank-300x300.png",
          bankCode: "EGB",
        },
        {
          bankName: "The United Bank",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk4a7pVXOBuPy_BriY5PnIkGc9hXF0jvEsfA&s",
          bankCode: "UB",
        },
        {
          bankName: "Qatar National Bank Alahli",
          bankImage: "https://www.amcham.org.eg/assets/uploads/employer-logo/637730357232901562.png",
          bankCode: "QNB",
        },
        {
          bankName: "Arab Bank PLC",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLqPxyHhhrtpkjg8CKUlJZGCawKfdH7sLvMA&s",
          bankCode: "ARAB",
        },
        {
          bankName: "Emirates National Bank of Dubai",
          bankImage: "https://www.intercom.com.eg/wp-content/uploads/2017/12/Emirates-NBD-300x300.jpg",
          bankCode: "ENBD",
        },
        {
          bankName: "Al Ahli Bank of Kuwait – Egypt",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHDeOAuLghc-2oFriGxBpPL43-t2BbfBnQDQ&s",
          bankCode: "ABK",
        },
        {
          bankName: "National Bank of Kuwait – Egypt",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvdeqQBYPZ2ULll97XsIZ9dnqiIN__WVVA9Q&s",
          bankCode: "NBK",
        },
        {
          bankName: "Arab Banking Corporation - Egypt S.A.E",
          bankImage: "https://cdn.cookielaw.org/logos/4d59aa92-401d-45a6-9aa4-b0b4abef0f5c/7afa467e-9938-4901-9418-d94d2f599eeb/db96bb1a-74ea-41f5-9fd8-8073eb22aefb/BankABCLogo.jpg",
          bankCode: "ABC",
        },
        {
          bankName: "First Abu Dhabi Bank",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzu1Kwg261NqqiuCx2dMFcLESLacC-hHd3lA&s",
          bankCode: "FAB",
        },
        {
          bankName: "Abu Dhabi Islamic Bank – Egypt",
          bankImage: "https://media.licdn.com/dms/image/v2/C4D0BAQGbjd6IbH5cGA/company-logo_200_200/company-logo_200_200/0/1652955360152/abu_dhabi_islamic_bank___egypt_logo?e=2147483647&v=beta&t=592ylCKcHTv1DZuuued_knBEk_ptxKI0fKc_DSCxSE4",
          bankCode: "ADIB",
        },
        {
          bankName: "Commercial International Bank - Egypt S.A.E",
          bankImage: "https://media.licdn.com/dms/image/v2/C4D0BAQENCEziPXxnfQ/company-logo_200_200/company-logo_200_200/0/1630467522538/cibegypt_logo?e=2147483647&v=beta&t=GCkt_C_o1RnW5aRCQkFLSQBISpNGpJlGdZ6U40HRA-0",
          bankCode: "CIB",
        },
        {
          bankName: "Housing And Development Bank",
          bankImage: "https://ahl-masr.ngo/wp-content/uploads/2021/01/customer-service-5fc0ce73d8710.png",
          bankCode: "HDB",
        },
        {
          bankName: "Banque Misr",
          bankImage: "https://play-lh.googleusercontent.com/tnKul4kP0mldSGs06J3mjkwUDKox6-TmPfwzGO8ZJQ6_CUkuryF9IcMp4Gp64fIMfmY",
          bankCode: "MISR",
        },
        {
          bankName: "Arab African International Bank",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnESEgEJRHaKGsmhWmnzMTLrpwMzBbYh-kYQ&s",
          bankCode: "AAIB",
        },
        {
          bankName: "Egyptian Arab Land Bank",
          bankImage: "https://media.licdn.com/dms/image/v2/C4E0BAQGNUxMmCCEPXw/company-logo_200_200/company-logo_200_200/0/1631357606258?e=2147483647&v=beta&t=uhl2E_gXM5nRuQyE0oonarrYThseuwfgQIreCSb01pk",
          bankCode: "EALB",
        },
        {
          bankName: "Export Development Bank of Egypt",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPrc0kdQ6cMszXhX9ZunprHxqdRUt7WSHdtw&s",
          bankCode: "EDBE",
        },
        {
          bankName: "Faisal Islamic Bank of Egypt",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLcW0nZ3tTxTGpGCu7fidq8hDmL10wB0BwXQ&s",
          bankCode: "FAIB",
        },
        {
          bankName: "Blom Bank",
          bankImage: "https://egyeconomy.com/wp-content/uploads/2021/01/1580288121831287-0.jpg",
          bankCode: "BLOM",
        },
        {
          bankName: "Abu Dhabi Commercial Bank – Egypt",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi-TVi9U_2L1CXBfemqHiuGrFqGureQM6MWQ&s",
          bankCode: "ADCB",
        },
        {
          bankName: "Alex Bank Egypt",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUtwK57Yd-WMLVkq7I4oJr3ulhksgfR5vVLw&s",
          bankCode: "BOA",
        },
        {
          bankName: "Societe Arabe Internationale De Banque",
          bankImage: "https://www.temenos.com/wp-content/uploads/2022/09/Saib-cs-logo.png",
          bankCode: "SAIB",
        },
        {
          bankName: "National Bank of Egypt",
          bankImage: "https://www.intercom.com.eg/wp-content/uploads/2017/12/National-Bank-of-Egypt-300x300.jpg",
          bankCode: "NBE",
        },
        {
          bankName: "Al Baraka Bank Egypt B.S.C.",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYU2y2ZelO5pDJXm8xNhMgrgfjVWMnlENyPg&s",
          bankCode: "ABRK",
        },
        {
          bankName: "Egypt Post",
          bankImage: "https://play-lh.googleusercontent.com/-CnLTBxqEqCdjvP_IBNVya1zrBgsKmpfjJqGd7TopKkSH7FobVEkiNrCwTx9CHs8wdA",
          bankCode: "POST",
        },
        {
          bankName: "Nasser Social Bank",
          bankImage: "https://www.intercom.com.eg/wp-content/uploads/2017/12/NSB-300x300.jpg",
          bankCode: "NSB",
        },
        {
          bankName: "Industrial Development Bank",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKbsfNBVD1jHcPQVKYfjALNx37g-I1-NB4QQ&s",
          bankCode: "IDB",
        },
        {
          bankName: "Suez Canal Bank",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh_bltYhwUSpS2NJzW2S48DX9pysAMdFh1zg&s",
          bankCode: "SCB",
        },
        {
          bankName: "Mashreq Bank",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpNHPY0b8x9PnH07V7fIFyYZfWTtDwxfDW8w&s",
          bankCode: "MASH",
        },
        {
          bankName: "Arab Investment Bank",
          bankImage: "https://images.wuzzuf-data.net/files/company_logo/Arab-Investment-Bank-Egypt-10880-1585744074.png",
          bankCode: "AIB",
        },
        {
          bankName: "General Authority For Supply Commodities",
          bankImage: "https://www.sis.gov.eg/Content/Upload/slider/1220222513017362.jpg",
          bankCode: "GASC",
        },
        {
          bankName: "Arab International Bank",
          bankImage: "https://media.licdn.com/dms/image/v2/C4E0BAQE1bl1OWP12Eg/company-logo_200_200/company-logo_200_200/0/1630640034609?e=2147483647&v=beta&t=UaZhYuA3oITtvHoVNRdKKfgfse0CTH9M4yZ9IJKtzwE",
          bankCode: "ARIB",
        },
        {
          bankName: "Agricultural Bank of Egypt",
          bankImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-AhpNY5chWKkaUIPRnSOBuzHKILURa_gTUw&s",
          bankCode: "PDAC",
        },
        {
          bankName: "National Bank of Greece",
          bankImage: "https://data.cbonds.com/organisations_logos/3922/1631080442logo.png",
          bankCode: "NBG",
        },
        {
          bankName: "Central Bank Of Egypt",
          bankImage: "https://upload.wikimedia.org/wikipedia/commons/7/79/Central_Bank_of_Egypt_Logo.png",
          bankCode: "CBE",
        },
        {
          bankName: "ATTIJARIWAFA BANK Egypt",
          bankImage: "https://www.attijariwafabank.com.eg/app/uploads/2018/01/1522929326_826_11693_linkedin300x30001.png",
          bankCode: "BBE",
        },
      ];

      // Send success response
      myHelper.resHandler(
        res,
        200,
        true,
        bankcodes,
        "Bank codes retrieved successfully"
      );
    } catch (error) {
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
