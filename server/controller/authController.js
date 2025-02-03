const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const College = require("../models/College");
const path = require("path");
const fs = require("fs");
const OfferedCourse = require("../models/OfferedCourse");
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  return otpGenerator.generate(6, { 
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false
  });
};

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

    // Generate OTP
    const otp = generateOTP();
    
    // Create user with unverified status
    user = new User({
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
      role: role,
      phone: phone,
      address: address,
      country: country,
      isVerified: false,
      otp: otp,
      otpExpiry: Date.now() + 10 * 60 * 1000 // OTP valid for 10 minutes
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      text: `Your OTP for email verification is: ${otp}. Valid for 10 minutes.`
    });

    res.status(201).json({ 
      status: 1, 
      msg: "OTP sent to your email",
      email: email
    });
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
      pass: "", // Don't log the actual password
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
    // Validate all required files are present
    if (!req.files || 
        !req.files.accreditationCertificate || 
        !req.files.legalDocuments || 
        !req.files.collegeImage) {
      return res.status(400).json({ 
        msg: "All required files (accreditation certificate, legal documents, and college image) must be uploaded" 
      });
    }

    const {
      collegeName,
      email,
      password,
      address,
      country,
      contactPerson,
      website,
    } = req.body;

    const existingCollege = await College.findOne({ email });
    if (existingCollege) {
      return res.status(400).json({ msg: "College already exists" });
    }

    // Generate OTP
    const otp = generateOTP();
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const accreditationCertificate = req.files.accreditationCertificate[0];
    const legalDocuments = req.files.legalDocuments[0];
    const collegeImage = req.files.collegeImage[0];

    // Create directory for college files
    const collegeDir = path.join("uploads", "colleges", collegeName);
    fs.mkdirSync(collegeDir, { recursive: true });

    // Save all files
    const accreditationPath = path.join(collegeDir, "accreditation" + path.extname(accreditationCertificate.originalname));
    const legalDocumentsPath = path.join(collegeDir, "legal" + path.extname(legalDocuments.originalname));
    const collegeImagePath = path.join(collegeDir, "image" + path.extname(collegeImage.originalname));

    fs.writeFileSync(accreditationPath, accreditationCertificate.buffer);
    fs.writeFileSync(legalDocumentsPath, legalDocuments.buffer);
    fs.writeFileSync(collegeImagePath, collegeImage.buffer);

    const newCollege = new College({
      collegeName,
      email,
      password: hashedPassword,
      address,
      country,
      contactPerson,
      website,
      accreditationCertificate: accreditationPath,
      legalDocuments: legalDocumentsPath,
      collegeImage: collegeImagePath,
      isVerified: false,
      otp: otp,
      otpExpiry: Date.now() + 10 * 60 * 1000 // OTP valid for 10 minutes
    });

    await newCollege.save();

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "College Email Verification OTP",
      text: `Your OTP for college email verification is: ${otp}. Valid for 10 minutes.`
    });

    return res.status(201).json({ 
      status: 1,
      msg: "OTP sent to college email",
      email: email
    });
  } catch (error) {
    console.error('Error in registerCollege:', error);
    res.status(500).json({ 
      msg: "Server error", 
      error: error.message 
    });
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

    const collegeEmail = college.email;  // Make sure this field exists in your College model
    if (collegeEmail) {
      await sendEmailNotification(
        collegeEmail,
        "College Approval Notification",
        `Dear ${college.collegeName}, we are pleased to inform you that your college has been approved.`
      );
    } else {
      console.warn("College email not found. Approval email not sent.");
    }

    res.json({ message: "College approved successfully", college });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving college", error: error.message });
  }
};

exports.deletereqcollege = async (req, res) => {
  const { id } = req.params;

  try {
    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    const collegeEmail = college.email;  // Make sure this field exists in your College model
    if (collegeEmail) {
      await sendEmailNotification(
        collegeEmail,
        "College Decline Notification",
        `Dear ${college.collegeName}, we are pleased to inform you that your college has been declined.`
      );
    } else {
      console.warn("College email not found. Decline email not sent.");
    }

    // Delete the college from the database
    await College.findByIdAndDelete(id);
    res.status(200).json({ message: "College request declined and deleted" });
  } catch (error) {
    console.error("Error declining college:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const sendEmailNotification = async (email, subject, message) => {
  console.log(email, subject, message);
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
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
      return res
        .status(400)
        .json({ status: 0, message: "College Not Found OR Not Approved" });
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
          collegeId: college.id,
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
  console.log(req.params);
  try {
    // Find the college by ID and update the isApproved field to false
    const college = await College.findByIdAndUpdate(id, { isApproved: false });
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json({ message: "College disabled successfully", college });
  } catch (error) {
    console.error("Error disabling college:", error.message);
    res
      .status(500)
      .json({ message: "Error disabling college", error: error.message });
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
  const basePath = path.join(
    "C:/Users/rohit/EduVoyage/server/uploads/colleges",
    collegeName
  );

  const accreditationPath = getFilePath(basePath, "accreditation");

  if (accreditationPath) {
    res.download(accreditationPath, path.basename(accreditationPath)); // Download the found file
  } else {
    res.status(404).json({ msg: "Accreditation certificate not found" });
  }
};

exports.downloadLegal = async (req, res) => {
  const collegeName = decodeURIComponent(req.params.collegeName);
  const basePath = path.join(
    "C:/Users/rohit/EduVoyage/server/uploads/colleges",
    collegeName
  );

  const legalDocumentsPath = getFilePath(basePath, "legal");

  if (legalDocumentsPath) {
    res.download(legalDocumentsPath, path.basename(legalDocumentsPath)); // Download the found file
  } else {
    res.status(404).json({ msg: "Legal documents not found" });
  }
};

exports.downloadPercentageFile = async (req, res) => {
  // Decode the URL-encoded file path
  const filePath = decodeURIComponent(req.params.filePath);
  console.log(filePath)
  // Define the full file path by joining the uploads directory and the provided file path
  const fileLocation = path.join( 'C:/Users/rohit/EduVoyage/server/uploads', filePath);

  console.log("File path:", fileLocation);

  // Check if the file exists
  if (fs.existsSync(fileLocation)) {
    // Send the file for download
    res.download(fileLocation, path.basename(fileLocation), (err) => {
      if (err) {
        console.error("Error in downloading file:", err);
        res.status(500).json({ msg: "Error in downloading file" });
      }
    });
  } else {
    // If file not found, send a 404 response
    res.status(404).json({ msg: "File not found" });
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
            studentId: user?._id,
          });
        }
      );
    }
    // If not a regular user, check if it's a college admin
    else {
      let college = await College.findOne({ email, isApproved: true });

      if (!college) {
        return res
          .status(400)
          .json({ msg: "College Not Found OR Not Approved" });
      }

      const isMatch = await bcrypt.compare(password, college.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid email or password" });
      }

      

      const payload = {
        user: {
          id: college.id,
          role: "CollegeAdmin",
          collegeId: college.id,
        },
      };
 
      if (!college.paymentVerified) {
        
        const token = jwt.sign({ collegeId: college.id, role: 'CollegeAdmin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
          msg: "Payment not verified. Please complete the payment to access the dashboard.",
          collegeId: college.id,
          role: 'CollegeAdmin',
          token: token // Include the token in the response
        });   
       }

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
            collegeId: college.id,
          });
        }
      );
    }
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).send("Server error");
  }
};

exports.getOfferedCourses = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const offeredCourses = await OfferedCourse.find({ collegeId });
    res.status(200).json(offeredCourses);
  } catch (error) {
    console.error("Error fetching offered courses:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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

exports.verify_payment = async (req, res) => {
  const { collegeId } = req.params;

  try {
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    college.paymentVerified = true; // Set paymentVerified to true
    await college.save(); // Save the changes

    return res.status(200).json({ message: 'Payment verified successfully', college });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add a new endpoint to serve college images
exports.getCollegeImage = async (req, res) => {
  console.log("Entered the image backend");
  try {
    const { collegeName } = req.params;
    const college = await College.findOne({ collegeName });
    
    if (!college || !college.collegeImage) {
      return res.status(404).json({ msg: "College image not found" });
    }

    // Use the absolute path from the root of your project
    const imagePath = path.join(
      __dirname,
      '..',
      college.collegeImage // This path is already relative to the project root
    );
    
    console.log('Attempting to serve image from:', imagePath);
    
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      console.log('Image file not found at path:', imagePath);
      res.status(404).json({ msg: "College image file not found" });
    }
  } catch (error) {
    console.error('Error serving college image:', error);
    res.status(500).json({ msg: "Error serving college image" });
  }
};

// Add new verify OTP endpoint
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ 
      email,
      otp,
      otpExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Update user verification status
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ status: 1, msg: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Add new verify OTP endpoint for colleges
exports.verifyCollegeOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const college = await College.findOne({ 
      email,
      otp,
      otpExpiry: { $gt: Date.now() }
    });

    if (!college) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Update college verification status
    college.isVerified = true;
    college.otp = undefined;
    college.otpExpiry = undefined;
    await college.save();

    res.json({ status: 1, msg: "College email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};