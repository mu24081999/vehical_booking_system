const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    cnic: {
      type: String,
      unique: true,
      sparse: true, // allow null but unique if exists
    },

    address: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for fast search
customerSchema.index({ name: "text", phone: "text" });

module.exports = mongoose.model("Customer", customerSchema);
