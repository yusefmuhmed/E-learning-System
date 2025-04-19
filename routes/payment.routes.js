const router = require("express").Router();
const { auth } = require("../app/middleware/student.auth.middleware");
const Payment = require("../app/controller/payment.controller");

router.get("/get-bank-codes", Payment.getBankCodes);
router.post("/create-payment-link", auth, Payment.createPaymentLink);
router.post("/payment-status", Payment.paymentStatus);
router.post("/pay-out-mobileWallet/:id", Payment.payOutForMobileWallet);
router.post("/pay-out-bankAccount/:id", Payment.payoutForBankAccount);
router.post("/transfer-to-company-account", Payment.payoutToCompanyAccount);

module.exports = router;
