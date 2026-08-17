/* =========================
   GLOBAL VARIABLES
========================= */

let currentUser = null;

let currentExam = [];

let currentSubject = "";

let answers = [];

let notificationTimer = null;


/* =========================
   AUTH
========================= */

function showAuth(type, button){

    document.querySelectorAll(".tab").forEach(function(tab){
        tab.classList.remove("active");
    });

    button.classList.add("active");

    document.getElementById("loginForm").classList.remove("active");

    document.getElementById("registerForm").classList.remove("active");

    document.getElementById(type + "Form").classList.add("active");

}


/* =========================
   REGISTER
========================= */

function register(){

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim().toLowerCase();

    const password =
        document.getElementById("registerPassword").value;

    const confirm =
        document.getElementById("registerConfirm").value;

    const message =
        document.getElementById("registerMessage");


    if(!name || !email || !password || !confirm){

        message.className = "error";

        message.innerText =
            "من فضلك املأ كل البيانات.";

        return;
    }


    if(password.length < 6){

        message.className = "error";

        message.innerText =
            "كلمة المرور يجب أن تكون 6 أحرف على الأقل.";

        return;
    }


    if(password !== confirm){

        message.className = "error";

        message.innerText =
            "كلمتا المرور غير متطابقتين.";

        return;
    }


    let users =
        JSON.parse(
            localStorage.getItem("students") || "[]"
        );


    const exists =
        users.some(function(user){
            return user.email === email;
        });


    if(exists){

        message.className = "error";

        message.innerText =
            "هذا الإيميل مسجل بالفعل.";

        return;
    }


    const user = {

        id: Date.now(),

        name: name,

        email: email,

        password: password,

        watchedLessons: [],

        grades: [],

        schedule: JSON.parse(
            JSON.stringify(defaultSchedule)
        )

    };


    users.push(user);


    localStorage.setItem(
        "students",
        JSON.stringify(users)
    );


    message.className = "success";

    message.innerText =
        "تم إنشاء الحساب بنجاح 🎉";


    setTimeout(function(){

        document.getElementById("loginEmail").value =
            email;

        document.getElementById("loginPassword").value =
            "";

        showLoginTab();

    },800);

}


/* =========================
   SHOW LOGIN
========================= */

function showLoginTab(){

    const tabs =
        document.querySelectorAll(".tab");

    tabs[0].click();

}


/* =========================
   LOGIN
========================= */

function login(){

    const email =
        document.getElementById("loginEmail")
        .value
        .trim()
        .toLowerCase();

    const password =
        document.getElementById("loginPassword")
        .value;

    const message =
        document.getElementById("loginMessage");


    let users =
        JSON.parse(
            localStorage.getItem("students") || "[]"
        );


    const user =
        users.find(function(user){

            return (
                user.email === email &&
                user.password === password
            );

        });


    if(!user){

        message.className = "error";

        message.innerText =
            "الإيميل أو كلمة المرور غير صحيحة ❌";

        return;
    }


    /* حماية من البيانات القديمة */

    if(!Array.isArray(user.watchedLessons)){
        user.watchedLessons = [];
    }

    if(!Array.isArray(user.grades)){
        user.grades = [];
    }

    if(!Array.isArray(user.schedule)){
        user.schedule =
            JSON.parse(
                JSON.stringify(defaultSchedule)
            );
    }


    currentUser = user;


    saveCurrentUser();


    openApp();

}


/* =========================
   SAVE CURRENT USER
========================= */

function saveCurrentUser(){

    if(!currentUser){
        return;
    }


    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );


    let users =
        JSON.parse(
            localStorage.getItem("students") || "[]"
        );


    const index =
        users.findIndex(function(user){

            return user.email === currentUser.email;

        });


    if(index !== -1){

        users[index] = currentUser;

        localStorage.setItem(
            "students",
            JSON.stringify(users)
        );

    }

}


/* =========================
   OPEN APP
========================= */

function openApp(){

    document.getElementById("authPage").style.display =
        "none";

    document.getElementById("app").style.display =
        "block";


    document.getElementById("headerName").innerText =
        currentUser.name;


    document.getElementById("welcomeName").innerText =
        currentUser.name;


    renderLessons();

    renderExams();

    renderSchedule();

    updateDashboard();

    updateGrades();

    checkScheduleNotification();

}


/* =========================
   AUTO LOGIN
========================= */

window.addEventListener("load",function(){

    const saved =
        localStorage.getItem("currentUser");


    if(saved){

        try{

            currentUser =
                JSON.parse(saved);


            if(!Array.isArray(currentUser.watchedLessons)){
                currentUser.watchedLessons = [];
            }

            if(!Array.isArray(currentUser.grades)){
                currentUser.grades = [];
            }

            if(!Array.isArray(currentUser.schedule)){
                currentUser.schedule =
                    JSON.parse(
                        JSON.stringify(defaultSchedule)
                    );
            }


            openApp();

        }catch(error){

            localStorage.removeItem("currentUser");

        }

    }

});


/* =========================
   LOGOUT
========================= */

function logout(){

    currentUser = null;

    localStorage.removeItem("currentUser");


    document.getElementById("app").style.display =
        "none";

    document.getElementById("authPage").style.display =
        "flex";


    document.getElementById("loginPassword").value =
        "";

}


/* =========================
   NAVIGATION
========================= */

function showPage(page, button){

    document.querySelectorAll(".page").forEach(function(p){

        p.classList.remove("active");

    });


    const target =
        document.getElementById(page);


    if(target){
        target.classList.add("active");
    }


    document.querySelectorAll(".nav-btn").forEach(function(btn){

        btn.classList.remove("active");

    });


    if(button){
        button.classList.add("active");
    }


    if(page === "dashboard"){
        updateDashboard();
    }

    if(page === "schedule"){
        renderSchedule();
    }

    if(page === "grades"){
        updateGrades();
    }

}


/* =========================
   LESSONS
========================= */

function renderLessons(){

    const container =
        document.getElementById("lessonsContainer");

    container.innerHTML = "";


    Object.keys(subjects).forEach(function(subject){

        const subjectInfo =
            subjects[subject];


        const lessons =
            lessonsData[subject] || [];


        lessons.forEach(function(lesson){

            const watched =
                currentUser.watchedLessons.includes(
                    lesson.id
                );


            container.innerHTML += `

                <div class="card">

                    <div class="card-icon">
                        ${subjectInfo.icon}
                    </div>

                    <h3>
                        ${lesson.title}
                    </h3>

                    <p>
                        ${lesson.description}
                    </p>

                    <p style="margin-top:10px">
                        المادة:
                        <strong>${subjectInfo.name}</strong>
                    </p>

                    <button
                        onclick="openLesson('${subject}','${lesson.id}')">

                        ${watched ? "✅ شاهدت الدرس" : "▶️ مشاهدة الدرس"}

                    </button>

                </div>

            `;

        });

    });

}


/* =========================
   OPEN LESSON
========================= */

function openLesson(subject, lessonId){

    const lessonList =
        lessonsData[subject] || [];


    const lesson =
        lessonList.find(function(item){

            return item.id === lessonId;

        });


    if(!lesson){
        return;
    }


    /* تسجيل مشاهدة الدرس */

    if(!currentUser.watchedLessons.includes(lessonId)){

        currentUser.watchedLessons.push(lessonId);

        saveCurrentUser();

        updateDashboard();

        renderLessons();

    }


    document.getElementById("lessonContent").innerHTML = `

        <h2>
            ${subjects[subject].icon}
            ${lesson.title}
        </h2>

        <div style="
            height:250px;
            background:#111827;
            border-radius:15px;
            margin:20px 0;
            display:flex;
            justify-content:center;
            align-items:center;
            color:white;
            font-size:55px;
        ">
            ▶️
        </div>

        <h3>
            شرح الدرس
        </h3>

        <p style="
            line-height:2;
            color:#64748b;
            margin-top:12px;
        ">

            أنت الآن تشاهد درس
            <strong>${lesson.title}</strong>.

            <br>

            هنا يمكنك لاحقًا وضع الفيديو
            أو شرح الدرس الحقيقي.

            <br>

            تم تسجيل هذا الدرس ضمن
            الدروس التي شاهدتها.

        </p>

    `;


    document.getElementById("lessonModal")
        .classList.add("show");

}


/* =========================
   EXAMS
========================= */

function renderExams(){

    const container =
        document.getElementById("examsContainer");

    container.innerHTML = "";


    Object.keys(examsData).forEach(function(subject){

        const icon =
            subjects[subject].icon;


        container.innerHTML += `

            <div class="exam">

                <div>

                    <h3>
                        ${icon}
                        امتحان ${subject}
                    </h3>

                    <p>
                        ${examsData[subject].length}
                        أسئلة
                    </p>

                </div>

                <button
                    onclick="startExam('${subject}')">

                    ابدأ الاختبار

                </button>

            </div>

        `;

    });

}


/* =========================
   START EXAM
========================= */

function startExam(subject){

    currentSubject = subject;

    currentExam =
        examsData[subject] || [];

    answers = [];


    let html = `

        <h2>
            ${subjects[subject].icon}
            امتحان ${subject}
        </h2>

        <p style="
            color:#64748b;
            margin:15px 0;
        ">
            اختر إجابة واحدة لكل سؤال.
        </p>

    `;


    currentExam.forEach(function(question,index){

        let options = [
            question[1],
            ...question[2]
        ];


        options.sort(function(){

            return Math.random() - 0.5;

        });


        html += `

            <div class="question">

                <h3>
                    ${index + 1}.
                    ${question[0]}
                </h3>

        `;


        options.forEach(function(option){

            const safeOption =
                escapeQuotes(option);


            html += `

                <button
                    class="option"
                    onclick="selectAnswer(
                        ${index},
                        '${safeOption}',
                        this
                    )">

                    ${option}

                </button>

            `;

        });


        html += `

            </div>

        `;

    });


    html += `

        <button
            class="main-btn"
            onclick="finishExam()">

            إنهاء الاختبار

        </button>

    `;


    document.getElementById("examContent")
        .innerHTML = html;


    document.getElementById("examModal")
        .classList.add("show");

}


/* =========================
   ESCAPE
========================= */

function escapeQuotes(text){

    return String(text)
        .replace(/\\/g,"\\\\")
        .replace(/'/g,"\\'")
        .replace(/"/g,'&quot;');

}


/* =========================
   SELECT ANSWER
========================= */

function selectAnswer(index,answer,button){

    answers[index] = answer;


    const parent =
        button.parentElement;


    parent
        .querySelectorAll(".option")
        .forEach(function(btn){

            btn.classList.remove("selected");

        });


    button.classList.add("selected");

}


/* =========================
   FINISH EXAM
========================= */

function finishExam(){

    if(currentExam.length === 0){
        return;
    }


    let score = 0;


    currentExam.forEach(function(question,index){

        if(answers[index] === question[1]){
            score++;
        }

    });


    const percentage =
        Math.round(
            (score / currentExam.length) * 100
        );


    currentUser.grades.push({

        subject: currentSubject,

        score: score,

        total: currentExam.length,

        percentage: percentage,

        date: new Date().toLocaleDateString("ar-EG")

    });


    saveCurrentUser();


    document.getElementById("examContent").innerHTML = `

        <div style="
            text-align:center;
            padding:20px;
        ">

            <h2>
                🎉 انتهى الاختبار
            </h2>

            <div class="score">
                ${percentage}%
            </div>

            <h3>
                ${score}
                من
                ${currentExam.length}
                إجابات صحيحة
            </h3>

            <p style="
                margin:20px;
                color:#64748b;
            ">

                ${
                    percentage >= 80
                    ? "ممتاز جداً 👏"
                    : percentage >= 50
                    ? "جيد جداً 👍"
                    : "راجع الدرس وحاول مرة أخرى 💪"
                }

            </p>

            <button
                class="main-btn"
                onclick="closeModal('examModal')">

                إغلاق

            </button>

        </div>

    `;


    updateDashboard();

    updateGrades();

}


/* =========================
   DASHBOARD
========================= */

function updateDashboard(){

    if(!currentUser){
        return;
    }


    const watched =
        currentUser.watchedLessons || [];


    const grades =
        currentUser.grades || [];


    document.getElementById("watchedLessons")
        .innerText = watched.length;


    document.getElementById("solvedExams")
        .innerText = grades.length;


    let average = 0;


    if(grades.length > 0){

        let total = 0;


        grades.forEach(function(grade){

            total += Number(grade.percentage) || 0;

        });


        average =
            Math.round(
                total / grades.length
            );

    }


    document.getElementById("averageGrade")
        .innerText = average + "%";


    const recent =
        document.getElementById("recentActivity");


    if(grades.length === 0 && watched.length === 0){

        recent.innerHTML =
            "لا يوجد نشاط حتى الآن.";

        return;
    }


    let html = "";


    if(watched.length > 0){

        html += `
            <p>
                📖 شاهدت
                <strong>${watched.length}</strong>
                درس.
            </p>
        `;

    }


    if(grades.length > 0){

        const last =
            grades[grades.length - 1];


        html += `
            <p style="margin-top:10px">
                📝 آخر اختبار:
                <strong>${last.subject}</strong>
                - درجتك
                <strong>${last.percentage}%</strong>
            </p>
        `;

    }


    recent.innerHTML = html;

}


/* =========================
   GRADES
========================= */

function updateGrades(){

    if(!currentUser){
        return;
    }


    const list =
        document.getElementById("gradesList");


    const grades =
        currentUser.grades || [];


    if(grades.length === 0){

        list.innerHTML = `

            <div class="card">

                <h3>
                    📊 لا توجد درجات حتى الآن
                </h3>

                <p style="margin-top:10px">
                    حل أول اختبار وستظهر نتيجتك هنا.
                </p>

            </div>

        `;

        return;
    }


    list.innerHTML = "";


    grades.slice().reverse().forEach(function(grade){

        list.innerHTML += `

            <div class="grade-card">

                <h3>
                    📝 ${grade.subject}
                </h3>

                <div class="grade-percent">
                    ${grade.percentage}%
                </div>

                <p>
                    الدرجة:
                    <strong>
                        ${grade.score}/${grade.total}
                    </strong>
                </p>

                <p style="
                    margin-top:8px;
                    color:#64748b;
                ">
                    التاريخ:
                    ${grade.date}
                </p>

            </div>

        `;

    });

}


/* =========================
   SCHEDULE
========================= */

function renderSchedule(){

    if(!currentUser){
        return;
    }


    const body =
        document.getElementById("scheduleBody");


    let schedule =
        currentUser.schedule || [];


    body.innerHTML = "";


    if(schedule.length === 0){

        body.innerHTML = `

            <tr>

                <td colspan="5"
                    style="text-align:center">

                    لا يوجد جدول حتى الآن.

                </td>

            </tr>

        `;

        return;
    }


    schedule.forEach(function(item){

        const isToday =
            item.day === getTodayArabic();


        body.innerHTML += `

            <tr>

                <td>
                    ${item.day}
                </td>

                <td>
                    ${item.subject}
                </td>

                <td>
                    ${formatTime(item.time)}
                </td>

                <td>

                    <span class="status ${
                        isToday
                        ? "today"
                        : "wait"
                    }">

                        ${
                            isToday
                            ? "📌 اليوم"
                            : "⏳ مجدول"
                        }

                    </span>

                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editSchedule(${item.id})">

                        ✏️ تعديل

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteSchedule(${item.id})">

                        🗑 حذف

                    </button>

                </td>

            </tr>

        `;

    });

}


/* =========================
   OPEN SCHEDULE FORM
========================= */

function openScheduleForm(){

    document.getElementById("scheduleFormTitle")
        .innerText = "إضافة حصة";


    document.getElementById("scheduleId")
        .value = "";


    document.getElementById("scheduleDay")
        .value = "السبت";


    document.getElementById("scheduleSubject")
        .value = "English";


    document.getElementById("scheduleTime")
        .value = "17:00";


    document.getElementById("scheduleModal")
        .classList.add("show");

}


/* =========================
   EDIT SCHEDULE
========================= */

function editSchedule(id){

    const item =
        currentUser.schedule.find(function(row){

            return Number(row.id) === Number(id);

        });


    if(!item){
        return;
    }


    document.getElementById("scheduleFormTitle")
        .innerText = "تعديل الحصة";


    document.getElementById("scheduleId")
        .value = item.id;


    document.getElementById("scheduleDay")
        .value = item.day;


    document.getElementById("scheduleSubject")
        .value = item.subject;


    document.getElementById("scheduleTime")
        .value = item.time;


    document.getElementById("scheduleModal")
        .classList.add("show");

}


/* =========================
   SAVE SCHEDULE
========================= */

function saveSchedule(){

    const id =
        document.getElementById("scheduleId").value;


    const day =
        document.getElementById("scheduleDay").value;


    const subject =
        document.getElementById("scheduleSubject").value;


    const time =
        document.getElementById("scheduleTime").value;


    if(!day || !subject || !time){

        showNotification(
            "من فضلك املأ بيانات الحصة."
        );

        return;
    }


    if(!Array.isArray(currentUser.schedule)){

        currentUser.schedule = [];

    }


    if(id){

        const index =
            currentUser.schedule.findIndex(function(item){

                return Number(item.id) === Number(id);

            });


        if(index !== -1){

            currentUser.schedule[index] = {

                id: Number(id),

                day: day,

                subject: subject,

                time: time

            };

        }

    }else{

        currentUser.schedule.push({

            id: Date.now(),

            day: day,

            subject: subject,

            time: time

        });

    }


    saveCurrentUser();

    renderSchedule();

    closeModal("scheduleModal");


    showNotification(
        "تم حفظ الجدول بنجاح ✅"
    );


    checkScheduleNotification();

}


/* =========================
   DELETE SCHEDULE
========================= */

function deleteSchedule(id){

    const ok =
        confirm("هل تريد حذف هذه الحصة؟");


    if(!ok){
        return;
    }


    currentUser.schedule =
        currentUser.schedule.filter(function(item){

            return Number(item.id) !== Number(id);

        });


    saveCurrentUser();

    renderSchedule();


    showNotification(
        "تم حذف الحصة."
    );

}


/* =========================
   DAY
========================= */

function getTodayArabic(){

    const days = [

        "الأحد",
        "الإثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
        "السبت"

    ];


    return days[new Date().getDay()];

}


/* =========================
   FORMAT TIME
========================= */

function formatTime(time){

    if(!time){
        return "";
    }


    const parts =
        time.split(":");


    let hour =
        Number(parts[0]);


    const minute =
        parts[1];


    const suffix =
        hour >= 12
        ? "مساءً"
        : "صباحاً";


    hour =
        hour % 12 || 12;


    return (
        hour +
        ":" +
        minute +
        " " +
        suffix
    );

}


/* =========================
   SCHEDULE NOTIFICATION
========================= */

function checkScheduleNotification(){

    if(!currentUser){
        return;
    }


    const now =
        new Date();


    const today =
        getTodayArabic();


    const currentHour =
        String(now.getHours())
        .padStart(2,"0");


    const currentMinute =
        String(now.getMinutes())
        .padStart(2,"0");


    const currentTime =
        currentHour +
        ":" +
        currentMinute;


    const schedule =
        currentUser.schedule || [];


    const found =
        schedule.find(function(item){

            return (
                item.day === today &&
                item.time === currentTime
            );

        });


    if(!found){
        return;
    }


    const notificationKey =
        "notified_" +
        currentUser.email +
        "_" +
        today +
        "_" +
        currentTime;


    if(localStorage.getItem(notificationKey)){
        return;
    }


    localStorage.setItem(
        notificationKey,
        "1"
    );


    showNotification(
        "🔔 حان الآن موعد مادة " +
        found.subject +
        " الساعة " +
        formatTime(found.time)
    );

}


/* =========================
   NOTIFICATION
========================= */

function showNotification(message){

    const box =
        document.getElementById("notification");


    box.innerText =
        message;


    box.classList.add("show");


    clearTimeout(notificationTimer);


    notificationTimer =
        setTimeout(function(){

            box.classList.remove("show");

        },7000);

}


/* =========================
   CLOSE MODAL
========================= */

function closeModal(id){

    const modal =
        document.getElementById(id);


    if(modal){
        modal.classList.remove("show");
    }

}


/* =========================
   CHECK TIME
========================= */

setInterval(function(){

    if(currentUser){

        checkScheduleNotification();

    }

},30000);
