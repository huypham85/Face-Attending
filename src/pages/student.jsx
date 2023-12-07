import { Helmet } from 'react-helmet-async';

import { StudentView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function StudentPage() {
  return (
    <>
      <Helmet>
        <title> Danh sách sinh viên</title>
      </Helmet>

      <StudentView />
    </>
  );
}
