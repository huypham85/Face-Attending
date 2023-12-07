export const validate = values => {
  const errors = {};

  if (!values.id) {
    errors.id = 'Vui lòng nhập mã môn học';
  }
  if (!values.name) {
    errors.name = 'Vui lòng nhập tên môn học';
  }
  if (!values.numberCredits) {
    errors.numberCredits = 'Vui lòng nhập số tín chỉ';
  }else if (values.numberCredits <= 0) {
    errors.numberCredits = 'Vui lòng nhập số tín chỉ lớn hơn 0';
  }

  if (values.students.length === 0) {
    errors.students = 'Vui lòng chọn các sinh viên sẽ tham gia lớp học';
  }

  if (!values.teacherId) {
    errors.teacherId = 'Vui lòng chọn giảng viên cho lớp học';
  }

  return errors;
};


