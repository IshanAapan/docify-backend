const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// Book appointment
exports.bookAppointment = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const { doctorId, appointmentDate, appointmentTime } = req.body;

    // Check if patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(400).json({ error: 'Invalid patient' });
    }

    // Check if doctor exists and is approved
    const doctor = await Doctor.findOne({ user: doctorId, status: 'approved' })
      .populate('user', 'firstName lastName');
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found or not approved' });
    }

    // Check for existing appointment at same time
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      status: { $ne: 'rejected' }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'Time slot already booked' });
    }

    const appointment = new Appointment({
      doctor: doctorId,
      patient: patientId,
      appointmentDate,
      appointmentTime
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



// Get appointments for patient
exports.getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.userId;
    
    const appointments = await Appointment.find({ patient: patientId })
      .populate('doctor', 'firstName lastName specialization')
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



// Get appointments for doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'firstName lastName')
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const doctorId = req.user.userId;

    const appointment = await Appointment.findOne({
      _id: id,
      doctor: doctorId
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      success: true,
      message: `Appointment ${status}`,
      appointment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Get all appointments for admin
exports.getAdminAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.aggregate([
      // Lookup doctor's user details
      {
        $lookup: {
          from: 'users',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctorUser'
        }
      },
      { $unwind: '$doctorUser' },
      // Lookup doctor's profile (specialization, fees, etc.)
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctorUser._id',
          foreignField: 'user',
          as: 'doctorProfile'
        }
      },
      { $unwind: '$doctorProfile' },
      // Lookup patient's user details
      {
        $lookup: {
          from: 'users',
          localField: 'patient',
          foreignField: '_id',
          as: 'patientUser'
        }
      },
      { $unwind: '$patientUser' },
      // Project required fields
      {
        $project: {
          _id: 1,
          appointmentDate: 1,
          appointmentTime: 1,
          bookingDateTime: 1,
          status: 1,
          doctorName: { 
            $concat: ['$doctorUser.firstName', ' ', '$doctorUser.lastName'] 
          },
          specialization: '$doctorProfile.specialization',
          fees: '$doctorProfile.fees',
          experience: '$doctorProfile.experience',
          patientName: { 
            $concat: ['$patientUser.firstName', ' ', '$patientUser.lastName'] 
          }
        }
      }
    ]);

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
