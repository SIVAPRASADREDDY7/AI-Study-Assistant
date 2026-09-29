
// ==========================================
// AI STUDY ASSISTANT - MAIN JAVASCRIPT
// ==========================================


// Page loaded message
document.addEventListener("DOMContentLoaded", function () {

    console.log("AI Study Assistant loaded successfully.");

});


// ==========================================
// NAVIGATION ACTIVE LINK
// ==========================================

const currentPage = window.location.pathname.split("/").pop();

const navLinks = document.querySelectorAll(".navbar a");

navLinks.forEach(function (link) {

    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {

        link.classList.add("active");

    }

});


// ==========================================
// BUTTON CLICK ANIMATION
// ==========================================

const buttons = document.querySelectorAll(
    ".primary-button, .secondary-button, .nav-button"
);

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        button.style.transform = "scale(0.97)";

        setTimeout(function () {

            button.style.transform = "";

        }, 150);

    });

});


// ==========================================
// AI DEMO
// ==========================================

function askDemoQuestion() {

    const question = prompt(
        "Enter your study question:"
    );

    if (question === null || question.trim() === "") {

        return;

    }

    alert(
        "Your question:\n\n" +
        question +
        "\n\nAI Assistant will answer your question here."
    );

}

// ================= DASHBOARD DATA =================

async function loadDashboard() {

    try {

        // Get logged-in student ID
        const studentId = localStorage.getItem("studentId");

        console.log("Student ID:", studentId);

        // Check login
        if (!studentId) {

            alert("Please login to view your dashboard.");

            window.location.href = "login.html";

            return;
        }


        // Get dashboard data from backend
        const response = await fetch(
            `/api/dashboard/${studentId}`
        );

        const data = await response.json();

        console.log("Dashboard Data:", data);


        if (!data.success) {

            alert(data.message);

            return;
        }


        // ================= STUDENT NAME =================

        document.getElementById("studentName").textContent =
            data.student.name;


        // ================= DASHBOARD STATS =================

        document.getElementById("totalQuizzes").textContent =
            data.stats.totalQuizzes;

        document.getElementById("averageScore").textContent =
            data.stats.averagePercentage + "%";

        document.getElementById("performanceScore").textContent =
            data.stats.averagePercentage + "%";

        document.getElementById("attemptedQuizzes").textContent =
            data.stats.totalQuizzes;

        document.getElementById("bestScore").textContent =
            data.stats.bestScore + "%";
            // ================= PASSED QUIZZES =================

const passedQuizzes =
    document.getElementById("passedQuizzes");

if (passedQuizzes) {

    const passedCount =
        data.recentResults.filter(function (result) {

            return result.percentage >= 50;

        }).length;

    passedQuizzes.textContent =
        passedCount;

}


        // ================= SUBJECT PROGRESS =================

        const subjectProgress =
            document.getElementById("subjectProgress");


        // Clear loading message
        subjectProgress.innerHTML = "";


        // Check if quiz results exist
        if (
            data.subjectProgress &&
            data.subjectProgress.length > 0
        ) {


            data.subjectProgress.forEach(function (item) {


                const progressItem =
                    document.createElement("div");


                progressItem.className =
                    "progress-item";


                progressItem.innerHTML = `

                    <div class="progress-info">

                        <span>
                            ${item.subject}
                        </span>

                        <strong>
                            ${item.percentage}%
                        </strong>

                    </div>


                    <div class="progress-track">

                        <div
                            class="progress-fill"
                            style="width: ${item.percentage}%;">
                        </div>

                    </div>

                `;


                subjectProgress.appendChild(
                    progressItem
                );


            });


        } else {


            subjectProgress.innerHTML = `

                <p>
                    No quiz results available yet.
                </p>

            `;

        }
        // ================= RECENT ACTIVITY =================

        const activityList =
            document.getElementById("activityList");


        if (
            activityList &&
            data.recentResults &&
            data.recentResults.length > 0
        ) {

            activityList.innerHTML = "";


            data.recentResults.forEach(function (result) {

                const activityItem =
                    document.createElement("div");


                activityItem.className =
                    "activity-item";


                const completedDate =
                    new Date(result.completedAt)
                        .toLocaleDateString();


                activityItem.innerHTML = `

                    <div class="activity-icon">
                        📝
                    </div>


                    <div>

                        <h4>
                            Completed ${result.subject}
                        </h4>


                        <span>
                            ${completedDate} •
                            Score ${result.percentage}%
                        </span>

                    </div>


                    <strong>
                        ✓
                    </strong>

                `;


                activityList.appendChild(
                    activityItem
                );

            });


        } else if (activityList) {

            activityList.innerHTML = `

                <p>
                    No recent activity available yet.
                </p>

            `;

        }
        // ================= STUDY STREAK =================

const studyStreak =
    document.getElementById("studyStreak");

if (studyStreak) {

    let streak = 0;

    if (
        data.recentResults &&
        data.recentResults.length > 0
    ) {

        const activityDates =
            data.recentResults.map(function (result) {

                return new Date(result.completedAt)
                    .toLocaleDateString();

            });


        const uniqueDates =
            [...new Set(activityDates)];


        // Most recent activity date
        let currentDate =
            new Date(uniqueDates[0]);


        for (
            let i = 0;
            i < uniqueDates.length;
            i++
        ) {

            const checkDate =
                new Date(uniqueDates[i]);


            const difference =
                Math.floor(
                    (
                        currentDate - checkDate
                    ) /
                    (1000 * 60 * 60 * 24)
                );


            if (difference === i) {

                streak++;

            } else {

                break;

            }

        }

    }


    studyStreak.textContent = streak;

}
// ================= ACHIEVEMENTS =================

const achievementsList =
    document.getElementById("achievementsList");


if (achievementsList) {

    achievementsList.innerHTML = "";


    const totalQuizzes =
        data.stats.totalQuizzes;

    const bestScore =
        data.stats.bestScore;


    // ================= QUIZ MASTER =================

    if (totalQuizzes > 0) {

        const quizAchievement =
            document.createElement("div");

        quizAchievement.className =
            "achievement-item";

        quizAchievement.innerHTML = `

            <div class="achievement-icon">
                🏆
            </div>

            <div>

                <h4>
                    Quiz Master
                </h4>

                <p>
                    Completed ${totalQuizzes} quiz${totalQuizzes > 1 ? "zes" : ""}
                </p>

            </div>

        `;

        achievementsList.appendChild(
            quizAchievement
        );

    }


    // ================= HIGH SCORER =================

    if (bestScore >= 80) {

        const scoreAchievement =
            document.createElement("div");

        scoreAchievement.className =
            "achievement-item";

        scoreAchievement.innerHTML = `

            <div class="achievement-icon">
                ⭐
            </div>

            <div>

                <h4>
                    High Scorer
                </h4>

                <p>
                    Achieved a best score of ${bestScore}%
                </p>

            </div>

        `;

        achievementsList.appendChild(
            scoreAchievement
        );

    }


    // ================= FIRST QUIZ =================

    if (totalQuizzes >= 1) {

        const firstQuizAchievement =
            document.createElement("div");

        firstQuizAchievement.className =
            "achievement-item";

        firstQuizAchievement.innerHTML = `

            <div class="achievement-icon">
                🎯
            </div>

            <div>

                <h4>
                    First Quiz Completed
                </h4>

                <p>
                    You started your learning journey
                </p>

            </div>

        `;

        achievementsList.appendChild(
            firstQuizAchievement
        );

    }


    // ================= NO ACHIEVEMENTS =================

    if (achievementsList.children.length === 0) {

        achievementsList.innerHTML = `

            <p>
                Complete your first quiz to unlock achievements.
            </p>

        `;

    }

}
        console.log(
            "Dashboard loaded successfully."
        );

    }


    catch (error) {

        console.error(
            "Dashboard Loading Error:",
            error
        );

    }

}


// ================= LOAD DASHBOARD =================

if (
    window.location.pathname.includes("dashboard.html")
) {

    loadDashboard();

}
// ================= AI RESPONSE FORMATTER =================
function formatAIResponse(text) {

    // Remove * symbols
    text = text.replace(/\*/g, "");

    // Make numbered headings bold
    text = text.replace(
        /^(\d+\.\s+[^.\n]{1,80})$/gm,
        "<strong>$1</strong>"
    );

    // Make common headings bold
    text = text.replace(
        /^(What is .*|Key Concepts.*|Advantages.*|Disadvantages.*|Applications.*|Conclusion.*|Exam-Friendly Summary.*)$/gm,
        "<strong>$1</strong>"
    );

    // Convert bullet points
    text = text.replace(
        /^\s*[-]\s+/gm,
        "• "
    );

    // Convert new lines
    text = text.replace(/\n/g, "<br>");

    return text;
}

function copyAIAnswer(button) {
    const answer = button.previousElementSibling.innerText;

    navigator.clipboard.writeText(answer).then(() => {
        button.innerText = "✅ Copied!";

        setTimeout(() => {
            button.innerText = "📋 Copy";
        }, 1500);
    });
}
function downloadAIAnswer(button) {

    const answer =
        button.parentElement.querySelector("#aiLoading").innerText;

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const lines =
        doc.splitTextToSize(answer, 180);

    doc.text(lines, 15, 20);

    doc.save("AI-Study-Answer.pdf");
}
function saveAIAnswer(button) {

    const answer =
        button.parentElement.querySelector("#aiLoading").innerText;

    let savedAnswers =
        JSON.parse(localStorage.getItem("savedAIAnswers")) || [];

    savedAnswers.push({
        answer: answer,
        date: new Date().toLocaleString()
    });

    localStorage.setItem(
        "savedAIAnswers",
        JSON.stringify(savedAnswers)
    );

    displaySavedAnswers();

    button.innerText = "✅ Saved!";

    setTimeout(() => {
        button.innerText = "⭐ Save";
    }, 1500);
}
function displaySavedAnswers() {

    const savedBox =
        document.getElementById("savedAnswerBox");

    if (!savedBox) return;

    const savedAnswers =
        JSON.parse(localStorage.getItem("savedAIAnswers")) || [];

    if (savedAnswers.length === 0) {
        savedBox.innerText = "No saved answers yet.";
        return;
    }

    savedBox.innerHTML = "";

    savedAnswers.forEach((item, index) => {

        const answer =
            typeof item === "string"
                ? item
                : item.answer;

        const date =
            typeof item === "string"
                ? ""
                : item.date;

        const answerDiv =
            document.createElement("div");

        answerDiv.className = "saved-answer-item";

        answerDiv.innerHTML = `
            <strong>Answer ${index + 1}</strong>

            ${date ? `<small>${date}</small>` : ""}

            <p>${answer}</p>

            <button
                class="delete-answer-btn"
                onclick="deleteSavedAnswer(${index})"
            >
                🗑️ Delete
            </button>
        `;

        savedBox.appendChild(answerDiv);
    });
}
window.addEventListener("DOMContentLoaded", function () {

    displaySavedAnswers();
displayQuestionHistory();
});

function deleteSavedAnswer(index) {

    let savedAnswers =
        JSON.parse(localStorage.getItem("savedAIAnswers")) || [];

    savedAnswers.splice(index, 1);

    localStorage.setItem(
        "savedAIAnswers",
        JSON.stringify(savedAnswers)
    );

    displaySavedAnswers();
}

// ================= CLEAR CHAT =================

function clearChat() {

    const confirmClear =
        confirm("Are you sure you want to clear the chat?");

    if (!confirmClear) {
        return;
    }

    const chatMessages =
        document.querySelector(".chat-messages");

    if (!chatMessages) return;

    chatMessages.innerHTML = "";

    const welcomeMessage =
        document.createElement("div");

    welcomeMessage.className = "ai-message";

    welcomeMessage.innerHTML = `
        <div class="message-avatar">
            AI
        </div>

        <div class="message-content">
            <span class="message-name">
                AI Assistant
            </span>

            <p>
                Chat cleared. Ask me a new study question!
            </p>
        </div>
    `;

    chatMessages.appendChild(welcomeMessage);
}


// ================= LOADING INDICATOR =================

function showLoading() {

    const loadingIndicator =
        document.getElementById("loadingIndicator");

    if (loadingIndicator) {
        loadingIndicator.style.display = "block";
    }
}


function hideLoading() {

    const loadingIndicator =
        document.getElementById("loadingIndicator");

    if (loadingIndicator) {
        loadingIndicator.style.display = "none";
    }
}


// ================= AI STUDY ASSISTANT =================

async function sendQuestion() {
    

    console.log("SEND QUESTION RUNNING");

    const input =
        document.getElementById("userQuestion");

   

    const question =
        input.value.trim();

    if (question === "") {

        alert("Please enter your study question.");

        return;
    }

    let questionHistory =
        JSON.parse(localStorage.getItem("questionHistory")) || [];

    questionHistory.push({
        question: question,
        date: new Date().toLocaleString()
    });

    localStorage.setItem(
        "questionHistory",
        JSON.stringify(questionHistory)
    );

    displayQuestionHistory();
    const chatMessages =
        document.querySelector(".chat-messages");


    // ================= USER MESSAGE =================

    const userMessage =
        document.createElement("div");

    userMessage.className =
        "message user-message";

    userMessage.innerHTML = `
        <div class="message-content">

            <span class="message-name">
                You
            </span>

            <p>
                ${question}
            </p>

        </div>
    `;

    chatMessages.appendChild(userMessage);


    // Clear input
    input.value = "";


    // ================= AI MESSAGE =================

    const aiMessage =
        document.createElement("div");

    aiMessage.className =
        "message ai-message";
aiMessage.innerHTML = `
    <div class="message-avatar">
        AI
    </div>

    <div class="message-content">
        <span class="message-name">
            AI Assistant
        </span>

        <p id="aiLoading">
            ⏳ AI is thinking...
        </p>

        <button
            class="copy-answer-btn"
            onclick="copyAIAnswer(this)"
           
        >
            📋 Copy
        </button>
    </div>
`;

    chatMessages.appendChild(aiMessage);


    chatMessages.scrollTop =
        chatMessages.scrollHeight;


    // ================= API REQUEST =================

    try {

        const response =
           await fetch("https://ai-study-assistant-1n0x.onrender.com/api/ai/ask", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    question: question
                })
            });


        const data =
            await response.json();
alert(JSON.stringify(data));
console.log("AI DATA:", data);
        const loadingText =
            aiMessage.querySelector("#aiLoading");

console.log("AI SUCCESS:", data.success);
        // ================= AI ANSWER =================

        if (data.success) {

            // IMPORTANT:
            // Format AI answer before displaying

            loadingText.innerHTML =
                formatAIResponse(data.answer);
   
        } else {

            loadingText.textContent =
                "Sorry, I could not generate an answer.";

        }

    } catch (error) {

        console.error(
            "AI Assistant Error:",
            error
        );


        const loadingText =
            aiMessage.querySelector("#aiLoading");


        loadingText.textContent =
            "Unable to connect to AI Assistant. Please try again.";
    }


    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}
function displayQuestionHistory() {

    const historyBox =
        document.getElementById("questionHistoryBox");

    if (!historyBox) return;

    const questionHistory =
        JSON.parse(localStorage.getItem("questionHistory")) || [];

    if (questionHistory.length === 0) {
        historyBox.innerText = "No questions asked yet.";
        return;
    }

    historyBox.innerHTML = "";

    questionHistory.forEach((item, index) => {

        const historyDiv =
            document.createElement("div");

        historyDiv.className = "history-item";

        historyDiv.innerHTML = `
            <strong>Question ${index + 1}</strong>
            <p>${item.question}</p>
            <small>${item.date}</small>
        `;

        historyBox.appendChild(historyDiv);
    });
}
function readAIAnswer(button) {

    const answer =
        button.parentElement.querySelector("#aiLoading").innerText;

    const speech =
        new SpeechSynthesisUtterance(answer);

    const language =
    document.getElementById("voiceLanguageSelect").value;

speech.lang = language;
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(speech);
}
speechSynthesis.onvoiceschanged = function () {
    const voices = speechSynthesis.getVoices();

    voices.forEach(function (voice) {
        console.log(
            voice.name,
            voice.lang
        );
    });
};
// ================= DASHBOARD DATA =================

async function loadDashboardData() {

    const studentId =
        localStorage.getItem("studentId");

    if (!studentId) {
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(
            `/api/dashboard/${studentId}`
        );

        const data = await response.json();

        console.log("Dashboard Data:", data);
        // Student Name
if (data.student) {
    const studentName =
        document.getElementById("studentName");

    if (studentName) {
        studentName.textContent =
            data.student.name;
    }
}

// Quiz Statistics
if (data.stats) {

    document.getElementById("totalQuizzes").textContent =
        data.stats.totalQuizzes;

    document.getElementById("averageScore").textContent =
        data.stats.averagePercentage + "%";

    document.getElementById("performanceScore").textContent =
        data.stats.averagePercentage + "%";

    document.getElementById("attemptedQuizzes").textContent =
        data.stats.totalQuizzes;

    document.getElementById("bestScore").textContent =
        data.stats.bestScore + "%";
        document.getElementById("studyStreak").textContent =
    data.stats.studyStreak;
}
// ================= SUBJECT PROGRESS =================

const subjectProgressBox =
    document.getElementById("subjectProgress");

if (subjectProgressBox && data.subjectProgress) {

    if (data.subjectProgress.length === 0) {

        subjectProgressBox.innerHTML =
            "<p>No quiz progress available yet.</p>";

    } else {

        subjectProgressBox.innerHTML = "";

        data.subjectProgress.forEach(item => {

            const progressItem =
                document.createElement("div");

            progressItem.className =
                "subject-progress-item";

            progressItem.innerHTML = `
                <div class="progress-info">
                    <span>${item.subject}</span>
                    <strong>${item.percentage}%</strong>
                </div>

                <div class="progress-bar">
                    <div
                        class="progress-fill"
                        style="width: ${item.percentage}%;">
                    </div>
                </div>
            `;

            subjectProgressBox.appendChild(
                progressItem
            );

        });

    }
}
// ================= RECENT ACTIVITY =================

const activityList =
    document.getElementById("activityList");

if (activityList && data.recentResults) {

    if (data.recentResults.length === 0) {

        activityList.innerHTML =
            "<p>No quiz activity yet.</p>";

    } else {

        activityList.innerHTML = "";

        data.recentResults.forEach(result => {

            const activity =
                document.createElement("div");

            activity.className =
                "activity-item";

            activity.innerHTML = `
                <strong>${result.subject}</strong>
                <p>
                    Score: ${result.score}/${result.totalQuestions}
                    (${Math.round(result.percentage)}%)
                </p>
            `;

            activityList.appendChild(activity);

        });

    }
}
// ================= PASSED QUIZZES =================

const passedQuizzes =
    document.getElementById("passedQuizzes");

if (passedQuizzes && data.recentResults) {

    const passedCount =
        data.recentResults.filter(
            result => result.percentage >= 50
        ).length;

    passedQuizzes.textContent =
        passedCount;
}
// ================= ACHIEVEMENTS =================

const achievementsList =
    document.getElementById("achievementsList");

if (achievementsList && data.stats) {

    const totalQuizzes =
        data.stats.totalQuizzes;

    const averageScore =
        data.stats.averagePercentage;

    achievementsList.innerHTML = "";

    if (totalQuizzes >= 1) {

        achievementsList.innerHTML += `
            <div class="achievement-item">
                📝
                <div>
                    <strong>First Quiz</strong>
                    <p>Completed your first quiz.</p>
                </div>
            </div>
        `;

    }

    if (totalQuizzes >= 5) {

        achievementsList.innerHTML += `
            <div class="achievement-item">
                🏆
                <div>
                    <strong>Quiz Explorer</strong>
                    <p>Completed 5 quizzes.</p>
                </div>
            </div>
        `;

    }

    if (averageScore >= 80) {

        achievementsList.innerHTML += `
            <div class="achievement-item">
                ⭐
                <div>
                    <strong>Excellent Performance</strong>
                    <p>Maintained an average score of 80% or more.</p>
                </div>
            </div>
        `;

    }

    if (totalQuizzes === 0) {

        achievementsList.innerHTML =
            "<p>Complete quizzes to unlock achievements.</p>";
    }
}
    } catch (error) {

        console.error(
            "Dashboard data error:",
            error
        );

    }
}
// ================= STUDENT LOGOUT =================

function logoutStudent() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (!confirmLogout) {
        return;
    }

    // Clear logged-in student data
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");

    // Redirect to login page
    window.location.href = "login.html";
}
// ================= DASHBOARD LOGIN PROTECTION =================

function checkDashboardLogin() {

    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
        window.location.href = "login.html";
    }
}

if (window.location.pathname.includes("dashboard.html")) {
    checkDashboardLogin();
}