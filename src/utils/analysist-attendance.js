export const analysisAttendance = (listStudents) => {
  const values = Object.values(listStudents);
  const nonEmptyValuesCount = values.filter((value) => value !== '').length;

  return `${nonEmptyValuesCount}/${values.length}`;
};

export const formatDateTime = (date, time) => {
  return `${date} ${time}`;
};

