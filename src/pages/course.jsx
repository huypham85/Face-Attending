import { Helmet } from 'react-helmet-async';

import { CourseView } from 'src/sections/products/view';

// ----------------------------------------------------------------------

export default function CoursePage() {
  return (
    <>
      <Helmet>
        <title> Quản lý khoá học </title>
      </Helmet>

      <CourseView />
    </>
  );
}
