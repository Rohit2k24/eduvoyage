const Exam = require('../models/Exam');
const Certificate = require('../models/Certificate');
const College = require('../models/College');
const EducationCourse = require('../models/EducationCourse');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const Enroll = require('../models/Enroll');
const seedQuestions = require('../scripts/seedExamQuestions');

const getExamQuestions = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log('Received courseId:', courseId);
    
    if (!courseId) {
      return res.status(400).json({ 
        message: 'Course ID is required' 
      });
    }

    let questions = await Exam.find({ courseId })
      .select('text options _id')
      .limit(10);
    
    console.log('Found questions:', questions.length);

    if (!questions || questions.length === 0) {
      console.log('No questions found, seeding...');
      await seedQuestions(courseId);
      questions = await Exam.find({ courseId })
        .select('text options _id')
        .limit(10);
    }

    const sanitizedQuestions = questions.map(({ _id, text, options }) => ({
      _id,
      text,
      options
    }));

    res.json(sanitizedQuestions);
  } catch (error) {
    console.error('Error in getExamQuestions:', error);
    res.status(500).json({ 
      message: 'Error fetching questions',
      error: error.message 
    });
  }
};

const submitExam = async (req, res) => {
  try {
    const { answers, courseId, studentId } = req.body;
    const questions = await Exam.find({ courseId });
    
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question._id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / questions.length) * 100;
    const passed = score >= 50;

    // Check if exam was already taken
    const existingCertificate = await Certificate.findOne({ 
      studentId, 
      courseId 
    });

    if (existingCertificate) {
      return res.json({ 
        score: existingCertificate.examScore, 
        passed: existingCertificate.examScore >= 50,
        certificateId: existingCertificate._id,
        alreadyTaken: true
      });
    }

    if (passed) {
      const enrollment = await Enroll.findOne({ studentId, courseId });
      const certificate = new Certificate({
        studentId,
        courseId,
        collegeId: enrollment.collegeId,
        examScore: score,
        examTaken: true
      });
      await certificate.save();

      res.json({ 
        score, 
        passed,
        certificateId: certificate._id 
      });
    } else {
      res.json({ score, passed });
    }
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ message: 'Error submitting exam' });
  }
};

const generateCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findById(certificateId)
      .populate('studentId')
      .populate('courseId')
      .populate('collegeId');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Create PDF document
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition', 
      `attachment; filename=certificate-${certificate._id}.pdf`
    );

    // Pipe PDF directly to response
    doc.pipe(res);

    // Add certificate content
    doc.fontSize(30)
       .text('Certificate of Completion', { align: 'center' })
       .moveDown();

    doc.fontSize(20)
       .text(`This certifies that`, { align: 'center' })
       .moveDown();

    doc.fontSize(25)
       .text(`${certificate.studentId.firstname} ${certificate.studentId.lastname}`, { align: 'center' })
       .moveDown();

    doc.fontSize(20)
       .text(`has successfully completed the course`, { align: 'center' })
       .moveDown();

    doc.fontSize(25)
       .text(`${certificate.courseId.courseName}`, { align: 'center' })
       .moveDown();

    doc.fontSize(20)
       .text(`with a score of ${certificate.examScore}%`, { align: 'center' })
       .moveDown();

    doc.fontSize(15)
       .text(`Certificate ID: ${certificate._id}`, { align: 'center' })
       .moveDown();

    doc.fontSize(15)
       .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ 
      message: 'Error generating certificate',
      error: error.message 
    });
  }
};

const getCompletedCourses = async (req, res) => {
  try {
    const { studentId } = req.params;

    const completedCourses = await Enroll.find({
      studentId: studentId,
      status: 'completed',
      progress: 100
    })
    .populate({
      path: 'courseId',
      select: 'courseName courseDescription'
    })
    .populate({
      path: 'collegeId',
      select: 'collegeName'
    });

    if (!completedCourses) {
      return res.status(404).json({ 
        message: 'No completed courses found' 
      });
    }

    const formattedCourses = completedCourses.map(enrollment => ({
      id: enrollment._id,
      courseId: enrollment.courseId._id,
      name: enrollment.courseId.courseName,
      description: enrollment.courseId.courseDescription,
      collegeName: enrollment.collegeId.collegeName,
      collegeId: enrollment.collegeId._id,
      completionDate: enrollment.updatedAt
    }));

    res.json(formattedCourses);

  } catch (error) {
    console.error('Error fetching completed courses:', error);
    res.status(500).json({ 
      message: 'Error fetching completed courses',
      error: error.message 
    });
  }
};

const getStudentCertificates = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const certificates = await Certificate.find({ studentId })
      .populate('courseId', 'courseName')
      .populate('collegeId', 'collegeName')
      .sort({ createdAt: -1 });

    res.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ 
      message: 'Error fetching certificates',
      error: error.message 
    });
  }
};

module.exports = {
  getExamQuestions,
  submitExam,
  generateCertificate,
  getCompletedCourses,
  getStudentCertificates
};
