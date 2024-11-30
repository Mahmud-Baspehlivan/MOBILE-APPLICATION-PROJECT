export const calculateAgeAtDate = (birthDate, testDate) => {
  const birth = birthDate instanceof Date ? birthDate : birthDate.toDate();
  const test = testDate instanceof Date ? testDate : testDate.toDate();
  
  let age = test.getFullYear() - birth.getFullYear();
  const monthDiff = test.getMonth() - birth.getMonth();
  
  // Ay ve gün kontrolü
  if (monthDiff < 0 || (monthDiff === 0 && test.getDate() < birth.getDate())) {
    age--;
  }

  // Ay cinsinden yaş (küçük yaşlar için)
  const months = age * 12 + (test.getMonth() - birth.getMonth());
  
  // Gün cinsinden yaş (yenidoğanlar için)
  const days = Math.floor((test - birth) / (1000 * 60 * 60 * 24));

  return { years: age, months, days };
};

export const getAgeGroup = (birthDate, testDate, testType) => {
  const age = calculateAgeAtDate(birthDate, testDate);
  const totalMonths = age.years * 12 + age.months;

  if (['IgG1', 'IgG2', 'IgG3', 'IgG4'].includes(testType)) {
    if (totalMonths >= 25 && totalMonths <= 36) return "25-36 months";
    if (totalMonths <= 60) return "3-5 years";
    if (totalMonths <= 96) return "6-8 years";
    if (totalMonths <= 132) return "9-11 years";
    if (totalMonths <= 192) return "12-16 years";
    if (totalMonths <= 216) return "16-18 years";
  } else {
    if (age.days <= 30) return "0-30 days";
    if (totalMonths <= 3) return "1-3 months";
    if (totalMonths <= 6) return "4-6 months";
    if (totalMonths <= 12) return "7-12 months";
    if (totalMonths <= 24) return "13-24 months";
    if (totalMonths <= 36) return "25-36 months";
    if (totalMonths <= 60) return "3-5 years";
    if (totalMonths <= 96) return "6-8 years";
    if (totalMonths <= 132) return "9-11 years";
    if (totalMonths <= 192) return "12-16 years";
    if (totalMonths <= 216) return "16-18 years";
  }
  
  return "Other";
};