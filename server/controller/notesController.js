const multer = require('multer');
const path = require('path');
const fs = require('fs');
const CourseNotes = require('../models/CourseNotes');

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/course-notes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${uniqueSuffix}-${safeFileName}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
});

// Upload course notes controller
const uploadCourseNotes = async (req, res) => {
  const uploadMiddleware = upload.array('notes');

  uploadMiddleware(req, res, async function(err) {
    try {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'File upload error', error: err.message });
      } else if (err) {
        return res.status(400).json({ message: 'Invalid file type', error: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const { courseId, collegeId, courseName, titles } = req.body;
      const titleArray = Array.isArray(titles) ? titles : [titles];

      const savedNotes = [];

      for (let i = 0; i < req.files.length; i++) {
        const courseNotes = new CourseNotes({
          courseId,
          collegeId,
          courseName,
          fileName: req.files[i].filename,
          title: titleArray[i] || `Note ${i + 1}`,
        });

        await courseNotes.save();
        savedNotes.push(courseNotes);
      }

      res.status(200).json({ 
        message: 'Notes uploaded successfully',
        savedNotes 
      });
    } catch (error) {
      console.error('Error uploading notes:', error);
      // Clean up uploaded files if database operation fails
      if (req.files) {
        req.files.forEach(file => {
          const filePath = path.join(__dirname, '../uploads/course-notes', file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      res.status(500).json({ message: 'Error uploading notes', error: error.message });
    }
  });
};

// Download course notes controller
const downloadCourseNotes = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '../uploads/course-notes', fileName);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
};

// Get course notes controller
const getCourseNotes = async (req, res) => {
    console.log(req.params.courseId)
  try {
    const notes = await CourseNotes.find({ courseId: req.params.courseId });
    console.log("notess",notes)
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
};

module.exports = {
  uploadCourseNotes,
  downloadCourseNotes,
  getCourseNotes
}; 