module.exports = {
  getSubjects: async (locale) => {
    let subjectsAr;
    let subjectsEn;
    let subjects;
    subjectsAr = [
      "لغة عربية", // Arabic Language
      "رياضيات", // Mathematics
      "علوم", // Science
      "دراسات اجتماعية", // Social Studies
      "لغة إنجليزية", // English Language
      "تربية إسلامية", // Islamic Education
      "تربية وطنية", // National Education
      "تربية فنية", // Art Education
      "الفيزياء", // Physics
      "الكيمياء", // Chemistry
      "الأحياء", // Biology
      "الجغرافيا", // Geography
      "التاريخ", // History
      "الفلسفة", // Philosophy
      "الاقتصاد", // Economics
      "التكنولوجيا", // Technology
      "الدراسات الاجتماعية", // Social Sciences
      "اللغة الفرنسية", // French Language
      "اللغة الألمانية", // German Language
      "اللغة الإسبانية", // Spanish Language
      "اللغة الإيطالية", // Italian Language
      "الحاسب الآلي",
    ];


    subjectsEn = [
      "Arabic",
      "Mathematics",
      "Science",
      "Social Studies",
      "English",
      "Islamic",
      "National Education",
      "Art Education",
      "Physics",
      "Chemistry",
      "Biology",
      "Geography",
      "History",
      "Philosophy",
      "Economics",
      "Technology",
      "Social Sciences",
      "French",
      "German",
      "Spanish",
      "Italian",
      "ICT",
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
    } else if( locale === "en") {
      return classesEN;
    } else {
      return [...classesAR, ...classesEN];
    }
  },
};
