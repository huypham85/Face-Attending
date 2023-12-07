export const columnsSession = [
  {field: 'id', headerName: 'ID', width: 150},
  {field: 'courseName', headerName: 'Môn học', width: 150},
  {
    field: 'teacherName',
    headerName: 'Giảng viên',
    width: 160,
  },
  {
    field: 'startTime',
    headerName: 'Thời gian bắt đầu',
    sortable: false,
    width: 150,
  },
  {
    field: 'startCheckInTime',
    headerName: 'Bắt đầu điểm danh',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
  },
  {
    field: 'endTime',
    headerName: 'Thời gian kết thúc',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 150,
  },
  {
    field: 'endCheckInTime',
    headerName: 'Kết thúc điểm danh',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
  },
  {
    field: 'analysisAttendance',
    headerName: 'Thống kê điểm danh',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 150,
  },
  {
    field: 'roomNo',
    headerName: 'Phòng',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 70,
  },
];


export function convertDateFormat(dateTimeString) {
  const originalDate = new Date(dateTimeString);

  const hours = originalDate.getHours().toString().padStart(2, '0');
  const minutes = originalDate.getMinutes().toString().padStart(2, '0');
  const day = originalDate.getDate().toString().padStart(2, '0');
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
  const year = originalDate.getFullYear();

  const convertedDate = `${hours}:${minutes} ${day}/${month}/${year}`;

  return convertedDate;
}

