const User = require("../models/User");
const Doctor = require("../models/Doctor");

exports.applyForDoctor = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { specialization, experience, fees, contactNumber } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role !== "patient") {
      return res.status(400).json({ error: "Only patients can apply" });
    }

    const existingApplication = await Doctor.findOne({ user: userId });
    if (existingApplication) {
      return res.status(400).json({ error: "Application already exists" });
    }

    const doctor = new Doctor({
      user: userId,
      specialization,
      experience,
      fees,
      contactNumber,
      status: "pending", // Set initial status to pending
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Application submitted for admin approval",
      doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" })
      .populate({
        path: "user",
        select: "firstName lastName image",
      })
      .select("specialization fees experience contactNumber");

    const formattedDoctors = doctors.map((doctor) => ({
      id: doctor.user.id,
      firstName: doctor.user.firstName,
      lastName: doctor.user.lastName,
      image: doctor.user.image,
      specialization: doctor.specialization,
      experience: doctor.experience,
      fees: doctor.fees,
      contactNumber: doctor.contactNumber,
    }));

    res.json(formattedDoctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
