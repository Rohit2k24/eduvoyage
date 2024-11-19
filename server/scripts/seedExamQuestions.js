const mongoose = require('mongoose');
const Exam = require('../models/Exam');

const sampleQuestions = [
  {
    text: "What is the main purpose of this course?",
    options: [
      "To learn basic concepts",
      "To master advanced techniques",
      "To get certified",
      "To meet other students"
    ],
    correctAnswer: "To learn basic concepts"
  },
  {
    text: "Which concept is most fundamental to this course?",
    options: [
      "Basic principles",
      "Advanced applications",
      "Theoretical frameworks",
      "Historical context"
    ],
    correctAnswer: "Basic principles"
  },
  {
    text: "What is the recommended approach to learning this material?",
    options: [
      "Step by step practice",
      "Memorization",
      "Group discussion",
      "Independent research"
    ],
    correctAnswer: "Step by step practice"
  },
  {
    text: "How often should you practice the concepts learned?",
    options: [
      "Daily",
      "Weekly",
      "Monthly",
      "Only before exams"
    ],
    correctAnswer: "Daily"
  },
  {
    text: "What is the best way to understand complex topics?",
    options: [
      "Break them into smaller parts",
      "Memorize everything at once",
      "Skip them entirely",
      "Ask for answers"
    ],
    correctAnswer: "Break them into smaller parts"
  },
  {
    text: "How important is practical application in this course?",
    options: [
      "Very important",
      "Somewhat important",
      "Not important",
      "Optional"
    ],
    correctAnswer: "Very important"
  },
  {
    text: "What should you do if you encounter difficulties?",
    options: [
      "Seek help immediately",
      "Give up",
      "Skip the topic",
      "Wait for others"
    ],
    correctAnswer: "Seek help immediately"
  },
  {
    text: "How should you approach course assignments?",
    options: [
      "Plan and complete early",
      "Wait until deadline",
      "Copy from others",
      "Skip them"
    ],
    correctAnswer: "Plan and complete early"
  },
  {
    text: "What is the role of feedback in learning?",
    options: [
      "Essential for improvement",
      "Not important",
      "Waste of time",
      "Only for grades"
    ],
    correctAnswer: "Essential for improvement"
  },
  {
    text: "How should you manage your study time?",
    options: [
      "Create a schedule",
      "Study when free",
      "No planning needed",
      "Follow others"
    ],
    correctAnswer: "Create a schedule"
  }
];

async function seedQuestions(courseId) {
  try {
    const questions = sampleQuestions.map(q => ({
      ...q,
      courseId
    }));
    
    await Exam.insertMany(questions);
    console.log('Exam questions seeded successfully');
  } catch (error) {
    console.error('Error seeding questions:', error);
  }
}

module.exports = seedQuestions; 