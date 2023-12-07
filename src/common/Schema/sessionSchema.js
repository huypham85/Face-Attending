export const validate = values => {
  const errors = {};
  if (!values.courseId) {
    errors.courseId = 'Vui lòng nhập mã môn học';
  }
  if (!values.date) {
    errors.date = 'Vui lòng nhập ngày học';
  }
  if (!values.endCheckInTime) {
    errors.endCheckInTime = 'Vui lòng nhập thời gian kết thúc điểm danh';
  }
  if (!values.endTime) {
    errors.endTime = 'Vui lòng nhập thời gian kết thúc của tiết học';
  }
  if (!values.id) {
    errors.id = 'Vui lòng nhập id của tiết học';
  }
  if (!values.roomNo) {
    errors.roomNo = 'Vui lòng nhập tên phòng học';
  }
  if (!values.startCheckInTime) {
    errors.startCheckInTime = 'Vui lòng nhập thời gian bắt đầu điểm danh';
  }
  if (!values.startTime) {
    errors.startTime = 'Vui lòng nhập thời gian bắt đầu của tiết học';
  }
  if (!values.students) {
    errors.startTime = 'Vui lòng chọn sinh viên';
  }

  return errors;
};


