const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: [validator.isEmail, 'Invalid email']
    validate: {
      validator: function (v) {
        return this.role !== "admin" || v === process.env.ADMIN_EMAIL;
      },
      message: "Only one admin user allowed",
    },
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["patient", "doctor", "admin"],
    default: "patient",
  },
  mob: Number,
  age: Number,
  gender: String,
  address: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
});


// Add to the userSchema if not already present
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
  }
});

module.exports = mongoose.model("User", userSchema);
