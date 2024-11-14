const mongoose = require("mongoose");

const paymentHistorySchema = mongoose.Schema(
  {
    studentMail: { type: String, required: true },
    amount_cents: { type: Number, required: true },
    created_at: { type: Date, required: true },
    currency: { type: String, required: true },
    error_occured: { type: Boolean, required: true },
    has_parent_transaction: { type: Boolean, required: true },
    transaction_id: { type: Number, required: true, unique: true }, // Unique transaction ID
    integration_id: { type: Number, required: true },
    is_3d_secure: { type: Boolean, required: true },
    is_auth: { type: Boolean, required: true },
    is_capture: { type: Boolean, required: true },
    is_refunded: { type: Boolean, required: true },
    is_standalone_payment: { type: Boolean, required: true },
    is_voided: { type: Boolean, required: true },
    order_id: { type: Number, required: true }, // Assuming `order.id` is an order identifier
    owner: { type: Number, required: true },
    pending: { type: Boolean, required: true },
    success: { type: Boolean, required: true },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const PaymentHistory = mongoose.model("PaymentHistory", paymentHistorySchema);
module.exports = PaymentHistory;
