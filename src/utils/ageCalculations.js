export const calculateAgeAtDate = (birthDate, testDate) => {
  const birth = birthDate instanceof Date ? birthDate : birthDate.toDate();
  const test = testDate instanceof Date ? testDate : testDate.toDate();

  let years = test.getFullYear() - birth.getFullYear();
  let months = test.getMonth() - birth.getMonth();
  let days = test.getDate() - birth.getDate();

  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }

  if (days < 0) {
    months--;
    const lastDayOfMonth = new Date(
      test.getFullYear(),
      test.getMonth(),
      0
    ).getDate();
    days += lastDayOfMonth;
  }

  return {
    years,
    months,
    days,
  };
};

const AGE_GROUP_MAPPINGS = {
  "kilavuz-turkjmedsci": {
    ranges: [
      { max: 1, group: "0-30 days" },
      { max: 3, group: "1-3 months" },
      { max: 6, group: "4-6 months" },
      { max: 12, group: "7-12 months" },
      { max: 24, group: "13-24 months" },
      { max: 36, group: "25-36 months" },
      { max: 60, group: "3-5 years" },
      { max: 96, group: "6-8 years" },
      { max: 132, group: "9-11 years" },
      { max: 192, group: "12-16 years" },
      { max: 216, group: "17-18 years" },
      { max: Infinity, group: "Older than 18 years" },
    ],
    useMonths: true,
  },
  "kilavuz-ap": {
    ranges: [
      { max: 5, group: "0-5 months" },
      { max: 9, group: "5-9 months" },
      { max: 15, group: "9-15 months" },
      { max: 24, group: "15-24 months" },
      { max: 48, group: "2-4 years" },
      { max: 84, group: "4-7 years" },
      { max: 120, group: "7-10 years" },
      { max: 156, group: "10-13 years" },
      { max: 192, group: "13-16 years" },
      { max: 216, group: "16-18 years" },
      { max: Infinity, group: "Older than 18 years" },
    ],
    useMonths: true,
  },
  "kilavuz-cilv": {
    ranges: [
      { max: 1, group: "0-1 months" },
      { max: 4, group: "1-4 months" },
      { max: 7, group: "4-7 months" },
      { max: 13, group: "7-13 months" },
      { max: 36, group: "1-3 years" },
      { max: 72, group: "3-6 years" },
      { max: Infinity, group: "Older than 6 years" },
    ],
    useMonths: true,
    getGroup: function (age, isIgG1_IgG2_IgG3_IgG4) {
      if (isIgG1_IgG2_IgG3_IgG4) {
        if (age <= 3) return "0-3 months";
        if (age <= 6) return "3-6 months";
        if (age <= 9) return "6-9 months";
        if (age <= 24) return "9 mo-2 yr";
        if (age <= 48) return "2-4 years";
        if (age <= 72) return "4-6 years";
        if (age <= 96) return "6-8 years";
        if (age <= 120) return "8-10 years";
        if (age <= 144) return "10-12 years";
        if (age <= 168) return "12-14 years";
        return "Older than 14 years";
      }
    },
  },

  "kilavuz-os": {
    ranges: [
      { max: 3, group: "1-3 months" },
      { max: 6, group: "4-6 months" },
      { max: 12, group: "7-12 months" },
      { max: 24, group: "13-24 months" },
      { max: 36, group: "25-36 months" },
      { max: 60, group: "4-5 years" },
      { max: 96, group: "6-8 years" },
      { max: 132, group: "9-11 years" },
      { max: 192, group: "12-16 years" },
    ],
    useMonths: true,
  },
  "kilavuz-tjp": {
    ranges: [
      { max: 1, group: "0-30 days" },
      { max: 5, group: "1-5 months" },
      { max: 8, group: "6-8 months" },
      { max: 12, group: "9-12 months" },
      { max: 24, group: "13-24 months" },
      { max: 36, group: "25-36 months" },
      { max: 48, group: "37-48 months" },
      { max: 72, group: "49-72 months" },
      { max: 96, group: "7-8 years" },
      { max: 120, group: "9-10 years" },
      { max: 144, group: "11-12 years" },
      { max: 168, group: "13-14 years" },
      { max: 192, group: "15-16 years" },
      { max: Infinity, group: "Older than 16 years" },
    ],
    useMonths: true,
  },
};

export const getAgeGroup = (birthDate, testDate, testType, articleName) => {
  const age = calculateAgeAtDate(birthDate, testDate);
  const totalMonths = age.years * 12 + age.months;

  const mapping = AGE_GROUP_MAPPINGS[articleName];
  if (!mapping) return null;

  const ageValue = mapping.useMonths ? totalMonths : age.years;

  if (
    mapping.getGroup &&
    (testType === "IgG1" ||
      testType === "IgG2" ||
      testType === "IgG3" ||
      testType === "IgG4")
  ) {
    return mapping.getGroup(ageValue, true);
  }

  const range = mapping.ranges.find((r) => ageValue <= r.max);
  return range ? range.group : null;
};
