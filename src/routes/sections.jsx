import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { OutGuard } from 'src/common/guards/OutGuard';
import { PrivateRoute } from 'src/common/guards/AuthGuard';

export const StudentPage = lazy(() => import('src/pages/student'));
export const TeacherPage = lazy(() => import('src/pages/teacher'));
export const StudentDetailPage = lazy(() => import('src/pages/studentDetail'));
export const TeacherDetailPage = lazy(() => import('src/pages/teacherDetail'));
export const CourseDetailPage = lazy(() => import('src/pages/courseDetail'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const CoursePage = lazy(() => import('src/pages/course'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      element: (
        <PrivateRoute>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </PrivateRoute>
      ),
      children: [
        { path: '/users', element: <UserPage />, index: true },
        { path: 'courses', element: <CoursePage /> },
        { path: 'teachers', element: <TeacherPage /> },
        { path: 'students', element: <StudentPage /> },
        { path: 'students/:studentId', element: <StudentDetailPage /> },
        { path: 'teachers/:teacherId', element: <TeacherDetailPage /> },
        { path: 'courses/:courseId', element: <CourseDetailPage /> },
      ],
    },
    {
      path: 'login',
      element: (
        <OutGuard>
          <LoginPage />
        </OutGuard>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/users" replace />,
    },
  ]);
}
