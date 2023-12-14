import { Helmet } from 'react-helmet-async';

import { TeacherView } from 'src/sections/teachers/view';

// ----------------------------------------------------------------------

export default function TeacherPage() {
  return (
    <>
      <Helmet>
        <title> Quản lý giảng viên </title>
      </Helmet>

      <TeacherView />
    </>
  );
}
