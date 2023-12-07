import { Helmet } from 'react-helmet-async';

import { CourseDetailView } from 'src/sections/courseDetail/view';

// ----------------------------------------------------------------------

export default function CourseDetail() {
  return (
    <>
      <Helmet>
        <title> Danh sách sinh viên </title>
      </Helmet>

      <CourseDetailView />
    </>
  );
}
