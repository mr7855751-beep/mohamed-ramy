/* =========================
   DATA
========================= */

const subjects = {

    English: {
        name: "English",
        icon: "🇬🇧",
        description: "English lessons, vocabulary and exercises."
    },

    German: {
        name: "German",
        icon: "🇩🇪",
        description: "German lessons, vocabulary and exercises."
    }

};


/* =========================
   LESSONS
========================= */

const lessonsData = {

    English: [
        {
            id: "english-1",
            title: "English Basics",
            description: "أساسيات اللغة الإنجليزية والكلمات البسيطة."
        },
        {
            id: "english-2",
            title: "English Vocabulary",
            description: "كلمات ومفردات مهمة باللغة الإنجليزية."
        },
        {
            id: "english-3",
            title: "Simple Sentences",
            description: "تكوين الجمل الإنجليزية البسيطة."
        }
    ],

    German: [
        {
            id: "german-1",
            title: "German Basics",
            description: "أساسيات اللغة الألمانية."
        },
        {
            id: "german-2",
            title: "German Vocabulary",
            description: "أهم الكلمات الألمانية."
        },
        {
            id: "german-3",
            title: "German Sentences",
            description: "تكوين الجمل الألمانية."
        }
    ]

};


/* =========================
   EXAMS
========================= */

const examsData = {

    English: [

        [
            "What is the opposite of big?",
            "Small",
            ["Tall", "Fast", "Strong"]
        ],

        [
            "What is the plural of book?",
            "Books",
            ["Book", "Booking", "Booked"]
        ],

        [
            "The sky is usually...",
            "Blue",
            ["Red", "Green", "Black"]
        ],

        [
            "What is 2 + 3?",
            "Five",
            ["Three", "Four", "Six"]
        ],

        [
            "Which one is an animal?",
            "Cat",
            ["Table", "Book", "Pen"]
        ]

    ],


    German: [

        [
            "What does 'Hallo' mean?",
            "Hello",
            ["Goodbye", "Thanks", "Yes"]
        ],

        [
            "What does 'Danke' mean?",
            "Thank you",
            ["Hello", "No", "Good morning"]
        ],

        [
            "What is 'Haus'?",
            "House",
            ["School", "Book", "Car"]
        ],

        [
            "What is 'Wasser'?",
            "Water",
            ["Food", "Air", "Fire"]
        ],

        [
            "What is 'Guten Morgen'?",
            "Good morning",
            ["Good night", "Goodbye", "Thank you"]
        ]

    ]

};


/* =========================
   DEFAULT SCHEDULE
========================= */

const defaultSchedule = [

    {
        id: 1,
        day: "السبت",
        subject: "English",
        time: "17:00"
    },

    {
        id: 2,
        day: "الأحد",
        subject: "German",
        time: "18:00"
    },

    {
        id: 3,
        day: "الإثنين",
        subject: "English",
        time: "19:00"
    },

    {
        id: 4,
        day: "الأربعاء",
        subject: "German",
        time: "20:00"
    }

];
