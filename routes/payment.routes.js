const router = require("express").Router();
const { auth } = require("../app/middleware/student.auth.middleware");
const Payment = require("../app/controller/payment.controller");

router.get("/get-bank-codes", Payment.getBankCodes);
router.post("/create-payment-link", auth, Payment.createPaymentLink);
router.post("/payment-status", Payment.paymentStatus);
router.post("/pay-out-mobileWallet", Payment.payOutForMobileWallet);
router.post("/pay-out-bankAccount", Payment.payoutForBankAccount);

module.exports = router;
