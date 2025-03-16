const Doctor = require("../models/Doctor");
const User = require("../models/User");

exports.getPendingApplications = async (req, res) => {
  try {
    const applications = await Doctor.find({ status: "pending" }).populate(
      "user",
      "firstName lastName email mob age gender"
    );

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Doctor.findById(id).populate("user");

    if (!application)
      return res.status(404).json({ error: "Application not found" });

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    application.status = status;
    await application.save();

    if (status === "approved") {
      application.user.role = "doctor";
      await application.user.save();
    }

    res.json({
      success: true,
      message: `Application ${status}`,
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" })
      .select("-password -__v") // Exclude sensitive fields
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deletePatients = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

exports.deleteDoctors = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// exports.changeDoctorToPatient = async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     // Change the role to 'Patient'
//     doctor.role = "Patient";
//     await doctor.save();

//     res.json({ message: "Doctor role changed to Patient successfully" });
//   } catch (error) {
//     console.error("Error updating role:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
