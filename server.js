const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const Student = require("./models/Student");
const QuizResult = require("./models/QuizResult");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();


// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ================= STATIC FRONTEND =================

app.use(express.static("public"));


// ================= MONGODB CONNECTION =================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });


// ================= TEST ROUTE =================

app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message: "AI Study Assistant Backend is Working!"
    });

});


// ================= STUDENT REGISTRATION =================

app.post("/api/students/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }

        const existingStudent = await Student.findOne({ email });

        if (existingStudent) {

            return res.status(400).json({
                success: false,
                message: "Student already registered with this email"
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({

            name: name,
            email: email,
            password: hashedPassword

        });

        await student.save();

        res.status(201).json({

            success: true,
            message: "Student registered successfully",
            studentId: student._id

        });

    } catch (error) {

        console.log("Registration Error:", error.message);

        res.status(500).json({

            success: false,
            message: "Server error during registration"

        });

    }

});
// ================= STUDENT LOGIN =================

app.post("/api/students/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        }

        const student = await Student.findOne({ email });

        if (!student) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            student.password
        );

        if (!isPasswordCorrect) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        res.json({

            success: true,
            message: "Login successful",
            studentId: student._id,
            name: student.name

        });

    } catch (error) {

        console.log("Login Error:", error.message);

        res.status(500).json({

            success: false,
            message: "Server error during login"

        });

    }

});
// ================= SAVE QUIZ RESULT =================


app.post("/api/quiz-results", async (req, res) => {

    try {

        const {
            studentId,
            subject,
            score,
            totalQuestions
        } = req.body;


        if (
            !studentId ||
            !subject ||
            score === undefined ||
            !totalQuestions
        ) {

            return res.status(400).json({

                success: false,
                message: "All quiz result fields are required"

            });

        }


        const percentage =
            (score / totalQuestions) * 100;


        const quizResult = new QuizResult({

            studentId: studentId,

            subject: subject,

            score: score,

            totalQuestions: totalQuestions,

            percentage: percentage

        });


        await quizResult.save();


        res.status(201).json({

            success: true,

            message: "Quiz result saved successfully",

            resultId: quizResult._id

        });


    } catch (error) {

        console.log(
            "Quiz Result Error:",
            error.message
        );


        res.status(500).json({

            success: false,

            message: "Server error while saving quiz result"

        });

    }

});
// Dashboard API
app.get("/api/dashboard/:studentId", async (req, res) => {

    try {

        const { studentId } = req.params;

        // Find student
        const student = await Student
            .findById(studentId)
            .select("-password");

        if (!student) {

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });

        }

        // Get all quiz results of this student
        const results = await QuizResult
            .find({ studentId })
            .sort({ completedAt: -1 });
// ================= STUDY STREAK =================

let studyStreak = 0;

if (results.length > 0) {

    const studyDates = [
        ...new Set(
            results.map(result =>
                new Date(result.completedAt)
                    .toISOString()
                    .split("T")[0]
            )
        )
    ];

    const today = new Date();

    for (let i = 0; i < studyDates.length; i++) {

        const expectedDate = new Date(today);

        expectedDate.setDate(
            today.getDate() - i
        );

        const expectedDateString =
            expectedDate
                .toISOString()
                .split("T")[0];

        if (studyDates.includes(expectedDateString)) {

            studyStreak++;

        } else {

            break;

        }
    }
}
        // Total quizzes
        const totalQuizzes = results.length;

        // Average percentage
        let averagePercentage = 0;

        if (totalQuizzes > 0) {

            const totalPercentage = results.reduce(
                (sum, result) => sum + result.percentage,
                0
            );

            averagePercentage =
                Math.round(totalPercentage / totalQuizzes);

        }

        // Best score
        let bestScore = 0;

        if (totalQuizzes > 0) {

            bestScore = Math.max(
                ...results.map(result => result.percentage)
            );

        }
// Subject-wise progress
const subjectProgress = {};

results.forEach(result => {

    if (!subjectProgress[result.subject]) {

        subjectProgress[result.subject] = {
            totalScore: 0,
            count: 0
        };

    }

    subjectProgress[result.subject].totalScore +=
        result.percentage;

    subjectProgress[result.subject].count++;

});

const subjectProgressData = Object.keys(subjectProgress).map(
    subject => {

        const data = subjectProgress[subject];

        return {
            subject: subject,
            percentage: Math.round(
                data.totalScore / data.count
            )
        };

    }
);
        // Send dashboard data
        res.json({

            success: true,

            student: {
                name: student.name,
                email: student.email
            },

            stats: {
                totalQuizzes: totalQuizzes,
                averagePercentage: averagePercentage,
                bestScore: bestScore,
                studyStreak: studyStreak,
            },

           recentResults: results.slice(0, 5),

subjectProgress: subjectProgressData

        });

    } catch (error) {

        console.log(
            "Dashboard Error:",
            error.message
        );

        res.status(500).json({

            success: false,
            message: "Server error while loading dashboard"

        });

    }

});
// ================= AI ASSISTANT =================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/api/ai/ask", async (req, res) => {

    try {

        const { question, subject, answerType } = req.body;
        if (!question || question.trim() === "") {

            return res.status(400).json({
                success: false,
                message: "Question is required"
            });

        }

     let response;

for (let attempt = 1; attempt <= 3; attempt++) {
    try {
        response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: question,
            config: {
                systemInstruction:
                "Selected subject: " + subject + ". " +
                "Answer type: " + answerType + ". " +
                "You are an AI Study Assistant for B.Tech students. " +
                "Give simple, accurate, structured and exam-friendly answers. " +
                "Answer in Tenglish (Telugu written using English letters mixed with English technical terms). " +
"Do not answer in Hindi. " +
"Do not answer in pure Telugu script. " +
"Never use asterisks (*) anywhere in the answer. " +
"Never use Markdown bold or italic formatting. " +
"Use simple language suitable for B.Tech students. " +
                "Do NOT use Markdown symbols such as #, ##, ###, **, *, _, >, or backticks. " +
                "Do not use Markdown formatting. " +
                "Use simple headings as plain text. " +
                "Use numbered points like 1., 2., 3. " +
                "Use bullet points with • when needed. " +
                "Keep the answer clean and easy to read on a website. " +
                "Do not add unnecessary greetings or follow-up questions."
            }
        });

        break;

    } catch (error) {

        if (attempt === 3) {
            throw error;
        }

        console.log(
            "Gemini busy. Retrying... Attempt " + attempt
        );

        await new Promise(resolve =>
            setTimeout(resolve, 5000)
        );
    }
}

       const cleanAnswer = response.text.replace(/\*/g, "");

res.json({
    success: true,
    answer: cleanAnswer
});

    } catch (error) {

        console.log(
            "Gemini AI Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "AI Assistant could not generate a response"
        });

    }

});
// ================= HOME ROUTE =================

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/public/index.html");

});


// ================= SERVER =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server started at port ${PORT}`);

});
