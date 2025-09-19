module.exports = {
  getSubjects: async (locale) => {
    let subjectsAr;
    let subjectsEn;
    let subjects;
    subjectsAr = [
      "الأحياء",        // Biology
      "الاقتصاد",       // Economics
      "الفيزياء",       // Physics
      "الكيمياء",       // Chemistry
      "اللغة الألمانية", // German Language
      "اللغة الإسبانية", // Spanish Language
      "اللغة الفرنسية",  // French Language
      "اللغة الإيطالية", // Italian Language
      "اللغة الإنجليزية", // English Language (your original was "لغة إنجليزية")
      "اللغة العربية",   // Arabic Language (your original was "لغة عربية")
      "تربية إسلامية",   // Islamic Education
      "تربية فنية",      // Art Education
      "تربية وطنية",     // National Education
      "التاريخ",        // History
      "التكنولوجيا",    // Technology
      "الجغرافيا",      // Geography
      "الدراسات الاجتماعية", // Social Sciences
      "رياضيات",        // Mathematics
      "علوم",           // Science
      "فلسفة",          // Philosophy
      "الحاسب الآلي"    // Computer Science
    ];

    subjectsEn = [
      "Arabic",
      "Art Education",
      "Biology",
      "Chemistry",
      "Economics",
      "English",
      "French",
      "Geography",
      "German",
      "History",
      "ICT",
      "Islamic",
      "Italian",
      "Mathematics",
      "National Education",
      "Philosophy",
      "Physics",
      "Science",
      "Social Sciences",
      "Social Studies",
      "Spanish",
      "Technology"
    ];


    if (locale === "ar") {
      return subjectsAr;
    } else if (locale === "en") {
      return subjectsEn;
    } else {
      subjects = [...subjectsAr, ...subjectsEn];
      return subjects;
    }
  },

  getClasses: async (locale) => {
    const classesAR = [
      "تأسيس KG",
      "الاول الابتدائي",
      "الثاني الابتدائي",
      "الثالث الابتدائي",
      "الرابع الابتدائي",
      "الخامس الابتدائي",
      "السادس الابتدائي",
      "الاول الاعدادي",
      "الثاني الاعدادي",
      "الثالث الاعدادي",
      "الاول الثانوي",
      "الثاني الثانوي",
      "الثالث الثانوي",
    ];

    const classesEN = [
      "KG Foundation",
      "First Primary",
      "Second Primary",
      "Third Primary",
      "Fourth Primary",
      "Fifth Primary",
      "Sixth Primary",
      "First Prep",
      "Second Prep",
      "Third Prep",
      "First Secondary",
      "Second Secondary",
      "Third Secondary",
      "Grade 1",
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6",
      "Grade 7",
      "Grade 8",
      "Grade 9",
      "Grade 10",
      "Grade 11",
      "Grade 12",
    ];
    if (locale === "ar") {
      return classesAR;
    } else if (locale === "en") {
      return classesEN;
    } else {
      return [...classesAR, ...classesEN];
    }
  },
};
