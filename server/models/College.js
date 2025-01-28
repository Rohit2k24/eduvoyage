const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  collegeName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phoneNumber: { type: String },
  website: { type: String },
  accreditationCertificate: { type: String },
  legalDocuments: { type: String },
  collegeImage: { type: String },
  isApproved: { type: Boolean, default: false },
  paymentVerified: { type: Boolean, default: false, }, 
});

module.exports = mongoose.model('College', collegeSchema);

