module.exports = {
  getSubjects: async (locale) => {
    if (locale === "ar") {
      const subjects = [
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
        "العلوم الاجتماعية", // Social Sciences
        "اللغة الفرنسية", // French Language
        "اللغة الألمانية", // German Language
        "اللغة الإسبانية", // Spanish Language
        "اللغة الإيطالية", // Italian Language
        "ICT",
      ];

      return subjects;
    } else {
      const subjects = [
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

      return subjects;
    }
  },

  getClasses: async (locale) => {
    if (locale === "ar") {
      const classes = [
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

      return classes;
    } else {
      const classes = [
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

      return classes;
    }
  },
};
