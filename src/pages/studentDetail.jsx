import { Helmet } from 'react-helmet-async';

import { StudentDetailView } from 'src/sections/studentDetail/view';

// ----------------------------------------------------------------------

export default function StudentDetailPage() {
  return (
    <>
      <Helmet>
        <title> Danh sách sinh viên </title>
      </Helmet>

      <StudentDetailView />
    </>
  );
}
