import { Helmet } from 'react-helmet-async';

import { TeacherDetailView } from 'src/sections/teacherDetail/view';

// ----------------------------------------------------------------------

export default function TeacherDetailPage() {
  return (
    <>
      <Helmet>
        <title> Danh sách giảng viên </title>
      </Helmet>

      <TeacherDetailView />
    </>
  );
}
