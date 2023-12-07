
export const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Vui lòng nhập email';
  } else if (!/^[A-Z0-9._%+-]+@gmail\.com$/i.test(values.email)) {
    errors.email = 'Địa chỉ email không hợp lệ';
  }
  if (!values.password) {
    errors.password = 'Vui lòng nhập mật khẩu';
  } else if (values.password.length < 6) {
    errors.password = 'Mật khẩu dài tối thiểu 6 ký tự';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Vui lòng nhập mật khẩu xác nhận';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Mật khẩu xác nhận chưa khớp nhau';
  }
  if (!values.name) {
    errors.name = 'Vui lòng nhập tên người dùng';
  }
  if (!values.id) {
    errors.id = 'Vui lòng nhập id';
  }
  if (!values.dob) {
    errors.birthday = 'Vui lòng chọn ngày sinh';
  }
  if (!values.mainClass && values.role === "student") {
    errors.mainClass = 'Vui lòng nhập lớp hành chính';
  }
  return errors;
};


