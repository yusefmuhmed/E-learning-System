const router = require("express").Router();
const { auth } = require("../app/middleware/student.auth.middleware");
const Payment = require("../app/controller/payment.controller");

router.post("/create-payment-link", auth, Payment.createPaymentLink);
router.post("/payment-status", Payment.paymentStatus);

module.exports = router;
