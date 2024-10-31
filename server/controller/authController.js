const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const College = require("../models/College");
const path = require("path");
const fs = require("fs");
const OfferedCourse = require("../models/OfferedCourse");

exports.userRegister = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    phone,
    address,
    country,
  } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
      role: role,
      phone: phone,
      address: address,
      country: country,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(201).json({ status: 1, msg: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "23h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          status: 1,
          message: "Login Successful!",
          token,
          role: user.role,

        });
      }
    );
    // if (user.role=="Admin"){
    //     <Navigate to="/" replace={true} />;
    // }
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).send("Server error");
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    return res.status(200).json({ message: "Logout successful" });
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  console.log("SMTP Configuration:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: "********", // Don't log the actual password
    },
  });

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Save hashed token to user document
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;

    // Create message
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    // Create a transporter
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send email
    let info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: user.email,
      subject: "Password Reset Token",
      text: message,
      html: `<p>${message}</p>`,
    });

    console.log("Message sent: %s", info.messageId);

    res.status(200).json({ msg: "Email sent" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ msg: "Email could not be sent" });
  }
};

exports.resetPassword = async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ msg: "Password reset successful" });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).send("Server error");
  }
};

exports.registerCollege = async (req, res) => {
  try {
    const {
      collegeName,
      email,
      password,
      address,
      country,
      contactPerson,
      phoneNumber,
      website,
    } = req.body;

    const existingCollege = await College.findOne({ email });
    if (existingCollege) {
      return res.status(400).json({ msg: "College already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const accreditationCertificate = req.files["accreditationCertificate"][0];
    const legalDocuments = req.files["legalDocuments"][0];

    const accreditationPath = path.join(
      "uploads",
      "colleges",
      collegeName,
      "accreditation" + path.extname(accreditationCertificate.originalname)
    );
    const legalDocumentsPath = path.join(
      "uploads",
      "colleges",
      collegeName,
      "legal" + path.extname(legalDocuments.originalname)
    );

    fs.mkdirSync(path.join("uploads", "colleges", collegeName), {
      recursive: true,
    });
    fs.writeFileSync(accreditationPath, accreditationCertificate.buffer);
    fs.writeFileSync(legalDocumentsPath, legalDocuments.buffer);

    const newCollege = new College({
      collegeName,
      email,
      password: hashedPassword,
      address,
      country,
      contactPerson,
      phoneNumber,
      website,
      accreditationCertificate: accreditationPath,
      legalDocuments: legalDocumentsPath,
    });

    await newCollege.save();

    return res
      .status(201)
      .json({ msg: "College registered successfully, pending approval" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.unapprovedColleges = async (req, res) => {
  try {
    const unapprovedColleges = await College.find({ isApproved: false });
    console.log(unapprovedColleges);
    res.json(unapprovedColleges);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching unapproved colleges",
      error: error.message,
    });
  }
};

exports.approvecollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }
    res.json({ message: "College approved successfully", college });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving college", error: error.message });
  }
};

exports.getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find({ isApproved: true });
    console.log(colleges);
    res.json(colleges);
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).send("Server error");
  }
};

exports.collegeLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let college = await College.findOne({ email, isApproved: true });
    if (!college) {
      return res.status(400).json({ status: 0, message: "College Not Found OR Not Approved" });
    }

    const isMatch = await bcrypt.compare(password, college.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // if(!college.isApproved)
    // {
    //   return res.status(400).json({ msg: "College is not approved" });
    // }
    const payload = {
      user: {
        id: college.id,
        role: "CollegeAdmin",
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "23h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          status: 1,
          message: "Login Successful!",
          token,
          role: "CollegeAdmin",
          collegeId: college.id
        });
      }
    );
    
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).send("Server error");
  }
};

exports.disableCollege = async (req, res) => {
  const { id } = req.params; // Get the college ID from the request parameters
  console.log(req.params)
  try {
    // Find the college by ID and update the isApproved field to false
    const college = await College.findByIdAndUpdate(
      id,
      { isApproved: false }
    );
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json({ message: "College disabled successfully", college });
  } catch (error) {
    console.error("Error disabling college:", error.message);
    res.status(500).json({ message: "Error disabling college", error: error.message });
  }

  
};

exports.deletereqcollege= async (req, res) => {
  const { id } = req.params;
  
  try {
    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    
    // Delete the college from the database
    await College.findByIdAndDelete(id);
    res.status(200).json({ message: 'College request declined and deleted' });
  } catch (error) {
    console.error('Error declining college:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFilePath = (basePath, fileNameWithoutExtension) => {
  const jpgPath = path.join(basePath, `${fileNameWithoutExtension}.jpg`);
  const pngPath = path.join(basePath, `${fileNameWithoutExtension}.png`);

  // Check if the file exists with either extension
  if (fs.existsSync(jpgPath)) {
    return jpgPath;
  } else if (fs.existsSync(pngPath)) {
    return pngPath;
  } else {
    return null;
  }
};

exports.downloadAccreditation = async (req, res) => {
  const collegeName = decodeURIComponent(req.params.collegeName); 
  const basePath = path.join("C:/Users/rohit/EduVoyage/server/uploads/colleges", collegeName);

  const accreditationPath = getFilePath(basePath, "accreditation");

  if (accreditationPath) {
    res.download(accreditationPath, path.basename(accreditationPath)); // Download the found file
  } else {
    res.status(404).json({ msg: "Accreditation certificate not found" });
  }
};

exports.downloadLegal = async (req, res) => {
  const collegeName = decodeURIComponent(req.params.collegeName); 
  const basePath = path.join("C:/Users/rohit/EduVoyage/server/uploads/colleges", collegeName);

  const legalDocumentsPath = getFilePath(basePath, "legal");

  if (legalDocumentsPath) {
    res.download(legalDocumentsPath, path.basename(legalDocumentsPath)); // Download the found file
  } else {
    res.status(404).json({ msg: "Legal documents not found" });
  }
};


exports.LoginForAll = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user is a regular user (student/admin)
    let user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid email or password" });
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "23h" },
        (err, token) => {
          if (err) throw err;
          res.json({
            status: 1,
            message: "Login Successful!",
            token,
            role: user.role,
            studentId: user?._id
          });
        }
      );
    } 
    // If not a regular user, check if it's a college admin
    else {
      let college = await College.findOne({ email, isApproved: true });

      if (!college) {
        return res.status(400).json({ msg: "College Not Found OR Not Approved" });
      }

      const isMatch = await bcrypt.compare(password, college.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid email or password" });
      }

      const payload = {
        user: {
          id: college.id,
          role: "CollegeAdmin",
          collegeId: college.id
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "23h" },
        (err, token) => {
          if (err) throw err;
          res.json({
            status: 1,
            message: "Login Successful!",
            token,
            role: "CollegeAdmin",
            collegeId: college.id
          });
        }
      );
    }
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).send("Server error");
  }
}



exports.getOfferedCourses = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const offeredCourses = await OfferedCourse.find({ collegeId });
    res.status(200).json(offeredCourses);
  } catch (error) {
    console.error('Error fetching offered courses:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.getApprovedColleges = async (req, res) => {
  console.log("Entered the backend");
  try {
    const approvedColleges = await College.find({ isApproved: true });
    res.json(approvedColleges);
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).send("Server error");
  }
};
