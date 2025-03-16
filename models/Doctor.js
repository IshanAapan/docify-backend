const mongoose = require("mongoose"); //  No need for `{ default: mongoose }`

const DoctorSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      unique: true
    },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    fees: { type: Number, required: true },
    contactNumber: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    appliedAt: { type: Date, default: Date.now }
});

//  Export the model
module.exports = mongoose.model("Doctor", DoctorSchema);
