const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    score: {
        type: Number,
        required: true
    },

    totalQuestions: {
        type: Number,
        required: true
    },

    percentage: {
        type: Number,
        required: true
    },

    completedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("QuizResult", quizResultSchema);