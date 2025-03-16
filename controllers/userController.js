const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    // Remove restricted fields if present
    delete updates.role;
    delete updates.image;

    // Handle password separately
    if (updates.password) {
      if (updates.password !== updates.cpassword) {
        console.log("password is not same!!");
        console.log(
          "password and cpassword",
          updates.password,
          "&&",
          updates.cpassword
        );

        return res.status(400).json({ error: "Passwords do not match" });
      }
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
      delete updates.confirmPassword;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already in use" });
    }

    res.status(500).json({ error: "Server error" });
  }
};
